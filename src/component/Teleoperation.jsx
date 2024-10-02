import React, { Component } from "react";
import * as Three from "three";
import Config from "./config/config";

class Teleoperation extends Component {
  //   constructor() {}

  state = {
    connected: false,
    ros: null,
    info_msg: "",
    x: 0,
    y: 0,
    yaw: 0,
    linear_vel: 0,
    angular_vel: 0,
  };

  componentDidMount() {
    this.init_connection();
    this.getRobotInfo();
    this.getRobotState();
  }

  init_connection() {
    this.state.ros = new window.ROSLIB.Ros();

    this.state.ros.on("connection", () => {
      this.setState({ connected: true });
    });

    this.state.ros.on("error", (error) => {
      console.log("error");
    });

    this.state.ros.on("close", () => {
      this.setState({ connected: false });

      setTimeout(() => {
        try {
          this.state.ros.connect("ws://" + Config.ROSBRIDGE_IP + ":9090");
        } catch (error) {
          console.log("connection problem");
        }
      }, 1000);
    });

    try {
      this.state.ros.connect("ws://" + Config.ROSBRIDGE_IP + ":9090");
    } catch (error) {
      console.log("connection problem");
    }
  }

  getRobotInfo = () => {
    var info_sub = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: Config.INFO_TOPIC,
      messageType: "std_msgs/String",
    });

    info_sub.subscribe((message) => {
      this.setState({ info_msg: message.data });
    });
  };

  getEulerFromQuat(quat) {
    var q = new Three.Quaternion(quat.x, quat.y, quat.z, quat.w);

    var rpy = new Three.Euler().setFromQuaternion(q);

    //   คืนค่า yaw
    return rpy["_z"] * (180 / 3.14159);
  }

  getRobotState = () => {
    var pose_sub = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: Config.ODOM_TOPIC,
      messageType: "nav_msgs/Odometry",
    });

    pose_sub.subscribe((message) => {
      this.setState({ x: message.pose.pose.position.x.toFixed(2) });
      this.setState({ y: message.pose.pose.position.y.toFixed(2) });
      this.setState({
        yaw: this.getEulerFromQuat(message.pose.pose.orientation).toFixed(2),
      });
      this.setState({ linear_vel: message.twist.twist.linear.x.toFixed(2) });
      this.setState({ angular_vel: message.twist.twist.angular.z.toFixed(2) });
    });
  };

  render() {
    return (
      <div>
        <p>{this.state.info_msg}</p>
        <h6>Odometry</h6>
        <p>x: {this.state.x}</p>
        <p>y: {this.state.y}</p>
        <p>yaw: {this.state.yaw}</p>
        <p>linear velocity: {this.state.linear_vel}</p>
        <p>angular velocity: {this.state.angular_vel}</p>
      </div>
    );
  }
}

export default Teleoperation;
