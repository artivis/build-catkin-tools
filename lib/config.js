'use babel';

export default {
    ros_version : {
        title : 'ros_version',
        description : 'ROS distro to be sourced.',
        type : 'string',
        default : '',
        order : 2
    },
    custom_args : {
        title : 'Custom catkin build Arguments',
        description : 'custom catkin build arguments',
        type : 'string',
        default : '',
        order : 1
    },
    clean_first : {
        title : 'catkin clean',
        description : 'Whether to run **catkin clean --all** first or not.',
        type : 'boolean',
        default : false,
        order : 3
    }
};
