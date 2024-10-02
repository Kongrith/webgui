import React, { Component } from "react";
import Config from "./config/config";
import { Joystick } from "react-joystick-component";
import Joy_img from "./images/joy.jpg";

class Teleoperation extends Component {
  constructor() {
    super();

    this.handleMove = this.handleMove.bind(this);
    this.handleStop = this.handleStop.bind(this);
  }

  state = {
    connected: false,
    ros: null,
  };

  componentDidMount() {
    this.init_connection();
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

  handleMove(event) {
    var vel_pub = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: Config.VEL_TOPIC,
      messageType: "geometry_msgs/Twist",
    });

    var twist_msg = new window.ROSLIB.Message({
      linear: {
        x: event.y * 0.5,
        y: 0.0,
        z: 0.0,
      },
      angular: {
        x: 0.0,
        y: 0.0,
        z: -event.x * 0.5,
      },
    });

    vel_pub.publish(twist_msg);
  }

  handleStop(event) {
    var vel_pub = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: Config.VEL_TOPIC,
      messageType: "geometry_msgs/Twist",
    });

    var twist_msg = new window.ROSLIB.Message({
      linear: {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
      angular: {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
    });

    vel_pub.publish(twist_msg);
  }
  render() {
    return (
      <div>
        <Joystick
          size={200}
          sticky={false}
          baseColor="black"
          stickColor="white"
          move={this.handleMove}
          stop={this.handleStop}
          stickImage={Joy_img}
        />
      </div>
    );
  }
}

export default Teleoperation;
