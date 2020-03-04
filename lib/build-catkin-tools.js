'use babel';

import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  execSync
} from 'child_process';

import {
  CompositeDisposable
} from 'atom';

export const config = require('./config');


export function providingFunction() {
  const generateErrorMatch = [
    "CMake Error at (?<file>[\\/0-9a-zA-Z\\._-]+):(?<line>\\d+)"
  ];
  const generateWarningMatch = [
    "CMake Error at (?<file>[\\/0-9a-zA-Z\\._-]+):(?<line>\\d+)"
  ];
  const compileErrorMatch = [
    "(?<file>\\/.+):(?<line>\\d+):(?<column>\\d+):\\s+?error:\\s+(?<message>.+)", // GCC/Clang Error
    "(.*>)?(?<file>.+)\\((?<line>\\d+)\\):\\s+(.*\\s+)?error\\s+(C\\d+):(?<message>.*)" // Visual Studio Error
    //"In file included from ([\/.*]):[0-9]:[0-9]:(?<file>.+):((?<line>\\d+)\\):(?<column>\\d+):(?<message>.*)"
    //"(?<file>\/[\w\/.]+):(?<line>\\d+):(?<column>\\d+)":
  ];
  const compileWarningMatch = [
    "(?<file>.+):(?<line>\\d+):(?<column>\\d+):\\s+?warning:\\s+(?<message>.+)", // GCC/Clang warning
    "(.*>)?(?<file>.+)\\((?<line>\\d+)\\):\\s+(.*\\s+)?warning\\s+(C\\d+):(?<message>.*)" // Visual Studio warning
  ];

  return class CatkinBuildProvider extends EventEmitter {
    constructor(source_dir) {
      super();
      atom.config.observe('build-catkin-tools.clean_first', (clean_first) => {
        this.clean_executable = (clean_first) ? 'catkin clean --all;' : '';
      });
      atom.config.observe('build-catkin-tools.executable', (executable) => {
        this.executable = 'catkin';
      });
      atom.config.observe('build-catkin-tools.ros_version', (ros_version) => {
        this.ros_version = ros_version;
      });
      atom.config.observe('build-catkin-tools.custom_args', (c_args) => {
        this.custom_args = c_args;
      });
      atom.config.onDidChange('build-catkin-tools.clean_first', () => {
        this.emit('refresh');
      });
      atom.config.onDidChange('build-catkin-tools.executable', () => {
        this.emit('refresh');
      });
      atom.config.onDidChange('build-catkin-tools.ros_version', () => {
        this.emit('refresh');
      });
      atom.config.onDidChange('build-catkin-tools.custom_args', () => {
        this.emit('refresh');
      });

      this.ros_base_path = '/opt/ros/';
      this.ros_source_file = '/setup.sh';
      this.ros_distro = ['melodic', 'kinetic', 'jade', 'indigo', 'hydro'];
      this.source_exec = '. ' + this.ros_base_path + 'ROSVERSION' + this.ros_source_file + ';';

      this.source_dir = source_dir;

    }
    destructor() {
      return 'void';
    }

    getNiceName() {
      return 'catkin build';
    }

    isEligible() {
      return this.isCatkinToolsWorkspace() || this.isCatkinPackage();
    }

    isCatkinToolsWorkspace() {
      return fs.existsSync(path.join(this.source_dir, '.catkin_tools'));
    }

    isCatkinPackage() {
      is_pkg = fs.existsSync(path.join(this.source_dir, 'CMakeLists.txt')) &&
        fs.existsSync(path.join(this.source_dir, 'package.xml'));

      if (is_pkg) {
        this.custom_args.concat([' --this']);
      }

      return is_pkg;
    }

    sourceROS() {
      try {
        fs.statSync(path.join(this.ros_base_path)).isDirectory();
      } catch (e) {
        throw new Error('Could not find ' + this.ros_base_path + ' directory. Custom install not supported yet !');
      }

      ros_version_found = '';

      if (this.ros_version != '') {
        ros_version_found = this.ros_distro.filter(v => v == this.ros_version);

        if (ros_version_found == '') {
          throw new Error('Unknown ROS version ' + this.ros_version);
        }

        this.source_exec = this.source_exec.replace('ROSVERSION', ros_version_found);
        return;
      }

      for (key in this.ros_distro) {
        ros_source_file_exists = false;
        try {
          ros_source_file_exists = fs.statSync(path.join(this.ros_base_path, this.ros_distro[key], '/setup.bash')).isFile();
        } catch (e) {}

        if (ros_source_file_exists) {
          this.source_exec = this.source_exec.replace('ROSVERSION', this.ros_distro[key]);

          return;
        }
      }

      throw new Error('Could not find any ROS distro.');
    }


    createCatkinTarget(command, args) {

      console.log(command.alias);


      return {
        atomCommandName: 'catkin-tools:' + command.alias,
        name: command.alias,
        exec: this.source_exec + this.clean_executable + this.executable,
        args: command.cmd.split(' ').concat(args),
        errorMatch: compileErrorMatch.concat(generateErrorMatch),
        warningMatch: compileWarningMatch.concat(generateWarningMatch),
        sh: this.source_environment
      };
    }

    settings() {
      this.sourceROS();

      var catkin_build_commands = [{
          cmd: 'build',
          alias: 'build workspace'
        },{
          cmd: 'build --this',
          alias: 'build package with dependencies'
        },{
          cmd: 'build --this --no-deps',
          alias: 'build package without dependencies'
        }];


      var catkin_extra_commands = [{
        cmd: 'clean -y',
        alias: 'clean workspace'
      },{
        cmd: 'run_tests',
        alias: 'run all tests'
      }];

      // Export compile commands
      var args = this.custom_args.split(' ').concat(['-DCMAKE_EXPORT_COMPILE_COMMANDS=ON']);

      // create all targets
      var targets = [];
      for (cmd in catkin_build_commands) {
        targets.push(this.createCatkinTarget(catkin_build_commands[cmd], args))
      }
      for (cmd in catkin_extra_commands) {
        targets.push(this.createCatkinTarget(catkin_extra_commands[cmd], []))
      }

      return targets;

    }
  }

}
