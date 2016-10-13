# catkin_tools build system for Atom

Uses the [atom-build](https://github.com/noseglid/atom-build) package to execute [catkin build](http://catkin-tools.readthedocs.io/en/latest/verbs/catkin_build.html) for the [catkin_tools](https://catkin-tools.readthedocs.io/en/latest/) package.

-   Assuming the open project is either a `catkin_tools` workspace or a [ROS package](http://wiki.ros.org/Packages), this executes the `catkin build` command.
-   Notice that as for now the `catkin_tools` workspace must have been built once.

Thanks to [build-cmake](https://atom.io/packages/build-cmake) from which this package is largely inspired.

** Note This package requires [atom-build](https://github.com/noseglid/atom-build) to be installed.

---
TODO :

-   [x] enable options.
-   [x] choosing ROS_VERSION to be sourced.
-   [x] passing args to `catkin build`.
-   [x] option to clean first.
-   [ ] allows for custom source path.
-   [ ] support for catkin_make.
