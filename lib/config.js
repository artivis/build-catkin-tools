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
    cmakelists : {
        title : 'CMakeLists',
        description : 'Relative path to the CMakeLists file.',
        type : 'string',
        default : '',
        order : 1
    },
    custom_args : {
        title : 'Custom catkin build Arguments',
        description : 'custom catkin build arguments',
        type : 'string',
        default : ' -v',
        order : 4
    }
};
