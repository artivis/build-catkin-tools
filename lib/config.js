'use babel';

export default {
    executable : {
        title : 'catkin build Executable',
        description : 'The catkin command to be executed (build/make not supported yet).',
        type : 'string',
        default : 'catkin build',
        order : 1
    },
    ros_version : {
        title : 'ros_version',
        description : 'ROS distro to be sourced.',
        type : 'string',
        default : '',
        order : 3
    },
    custom_args : {
        title : 'Custom catkin build Arguments',
        description : 'custom catkin build arguments',
        type : 'string',
        default : '',
        order : 2
    },
    clean_first : {
        title : 'catkin clean',
        description : 'Whether to run **catkin clean --all** first or not.',
        type : 'boolean',
        default : false,
        order : 4
    }
};
