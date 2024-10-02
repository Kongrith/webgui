import React, { Component } from "react";
import Config from "./config/config";

class Connection extends Component {
  state = {
    connected: false,
    ros: null,
  };

//   constructor() {
//     super();
//   }

  componentDidMount() {
    this.init_connection();
  }

  init_connection() {
    this.state.ros = new window.ROSLIB.Ros();

    this.state.ros.on("connection", () => {
    //   console.log("connection established");
      this.setState({ connected: true });
    });

    this.state.ros.on("error", (error) => {
      console.log("error");
    });

    this.state.ros.on("close", () => {
      console.log("connection closed");
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

  render() {
    const statusStyle = {
      color: this.state.connected ? "blue" : "red",
    };

    return (
      <div>
        <span>Status: </span>
        <span style={statusStyle}>
          {this.state.connected ? "Connected" : "Closed"}
        </span>
      </div>
    );
  }
}

export default Connection;
