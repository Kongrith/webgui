import React, { Component } from "react";
import * as Three from "three";
import Config from "./config/config";
import { Row, Col, ButtonGroup, Button } from "react-bootstrap";

class NavConsole extends Component {
  state = {
    connected: false,
    ros: null,
    x: 0.0,
    y: 0.0,
    yaw: 0.0,
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.init_connection();
    this.getNavPoint();
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

  getEulerFromQuat(quat) {
    var q = new Three.Quaternion(quat.x, quat.y, quat.z, quat.w);

    var rpy = new Three.Euler().setFromQuaternion(q);

    //   คืนค่า yaw
    return rpy["_z"] * (180 / 3.14159);
  }

  yawSlideHandle = (event) => {
    this.setState({ yaw: parseFloat(event.target.value) });
  };

  getNavPoint() {
    var point_subscriber = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: Config.MAPCLICK_TOPIC,
      messageType: "geometry_msgs/Vector3",
    });

    point_subscriber.subscribe((message) => {
      this.setState({ x: message.x.toFixed(3) });
      this.setState({ y: message.y.toFixed(3) });
    });
  }

  render() {
    return (
      <div>
        <Row>
          <h4>Navigation Console</h4>
        </Row>
        <Row>
          <Col sm={2}>
            <h5>
              <b>X[m]:</b> {this.state.x}
            </h5>
          </Col>
          <Col sm={2}>
            <h5>
              <b>Y[m]:</b> {this.state.y}
            </h5>
          </Col>

          <Col sm={4}>
            <h5>
              <b>Yaw[deg]:</b> {this.state.yaw}
            </h5>
            <input
              onChange={this.yawSlideHandle}
              type="range"
              className="form-range"
              id="customRange1"
              min="-180"
              max="180"
              step="5"
            />
          </Col>
          <Col>
            <button type="button" className="btn btn-info btn-lg">SET</button>
          </Col>
        </Row>

        <Row>
          <Col>
            <button type="button" className="btn btn-outline-info">
              <h6>Point A</h6>
            </button>
          </Col>
          <Col>
            <button type="button" className="btn btn-success">
              <h6>Go to Goal</h6>
            </button>
          </Col>
        </Row>
        <Row>
          <Col>
            <button type="button" className="btn btn-outline-info">
              <h6>Point B</h6>
            </button>
          </Col>
          <Col>
            <button type="button" className="btn btn-success">
              <h6>Home</h6>
            </button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NavConsole;
