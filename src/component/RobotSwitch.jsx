import React, { Component } from "react";
import Config from "./config/config";

class RobotSwitch extends Component {
  state = {
    connected: false,
    ros: null,
  };

  constructor() {
    super();
    // this.init_connection();
  }

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

  //
  mode_callback = (mode_name) => {
    var mode_msg = new window.ROSLIB.Message({
      data: mode_name,
    });

    var mode_pub = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: Config.MODE_TOPIC,
      messageType: "std_msgs/String",
    });

    mode_pub.publish(mode_msg);
  };

  render() {
    return (
      <div>
        <button
          onClick={() => this.mode_callback("AUTO")}
          dype="button"
          className="btn btn-outline-primary"
        >
          Auto Mode
        </button>
        <button
          onClick={() => this.mode_callback("MANUAL")}
          type="button"
          className="btn btn-outline-primary"
        >
          Manual Mode
        </button>
      </div>
    );
  }
}

export default RobotSwitch;
