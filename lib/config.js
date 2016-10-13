'use babel';

export default {
    executable : {
        title : 'catkin build Executable',
        description : 'The catkin command to be executed (build/make).',
        type : 'string',
        default : 'catkin build',
        order : 1
    },
    ros_version : {
        title : 'ros_version',
        description : 'ROS distro to be sourced.',
        type : 'string',
        default : '',
        order : 1
    },
    custom_args : {
        title : 'Custom catkin build Arguments',
        description : 'custom catkin build arguments',
        type : 'string',
        default : '',
        order : 4
    },
    clean_first : {
        title : 'catkin clean',
        description : 'Whether to run catkin ckean -a first or not.',
        type : 'boolean',
        default : false,
        order : 1
    }
};
