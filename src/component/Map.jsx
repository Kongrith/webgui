import React, { Component } from "react";
import * as Three from "three";
import Config from "./config/config";
import { Row, Col, ButtonGroup, Button } from "react-bootstrap";
import {
  BsZoomIn,
  BsZoomOut,
  BsFillCaretLeftFill,
  BsFillCaretRightFill,
  BsFillCaretUpFill,
  BsFillCaretDownFill,
} from "react-icons/bs";

class RobotState extends Component {
  state = {
    connected: false,
    ros: null,
    viewer: null,
    map_x: 0.0,
    map_y: 0.0,
    map_yaw: 0.0,
  };

  constructor() {
    super();
    this.view_map = this.view_map.bind(this);
  }

  componentDidMount() {
    this.init_connection();
    this.view_map();
    this.getMapPose();
  }

  view_map() {
    var viewer = new window.ROS2D.Viewer({
      divID: "map_show",
      width: 800,
      height: 480,
    });

    // init viewer
    this.setState({ viewer });

    var mapClient = new window.ROS2D.OccupancyGridClient({
      ros: this.state.ros,
      rootObject: viewer.scene,
      topic: Config.MAP_TOPIC,
      continuous: true,
    });

    mapClient.on("change", () => {
      viewer.scaleToDimensions(
        mapClient.currentGrid.width,
        mapClient.currentGrid.height,
        1
      );
      viewer.shift(
        mapClient.currentGrid.pose.position.x,
        mapClient.currentGrid.pose.position.y
      );
    });

    // x, y, length, direction, color
    viewer.addRobot(0, 0, 0.5, 0.5, "#cc0066");
  }

  sendMapClickPosition(x, y) {
    var map_click_pub = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: Config.MAPCLICK_TOPIC,
      messageType: "geometry_msgs/Vector3",
    });

    var pose_click_msg = new window.ROSLIB.Message({
      x: parseFloat(x),
      y: parseFloat(y),
      z: 0.0,
    });

    map_click_pub.publish(pose_click_msg);
  }

  updateRobotPosition(x, y, yaw) {
    if (this.state.viewer) {
      this.state.viewer.updateArrowPosition(0, x, y);
      this.state.viewer.updateArrowRotation(0, yaw);

      var clickPose = this.state.viewer.getMapClickPosition();
      this.sendMapClickPosition(clickPose.x, clickPose.y);
    }
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

  map_zoom(factor) {
    if (this.state.viewer) {
      if (factor > 0) {
        factor = factor + 1;
        this.state.viewer.zoomIn(factor);
      } else if (factor < 0) {
        this.state.viewer.zoomOut(1.1);
      }
    }
  }

  map_pan(dx, dy) {
    if (this.state.viewer) {
      this.state.viewer.shift(dx, dy);
    }
  }

  getMapPose = () => {
    var pose_sub = new window.ROSLIB.Topic({
      ros: this.state.ros,
      name: Config.MAPPOSE_TOPIC,
      messageType: "geometry_msgs/PoseWithCovarianceStamped",
    });

    pose_sub.subscribe((message) => {
      this.setState({ map_x: message.pose.pose.position.x.toFixed(2) });
      this.setState({ map_y: message.pose.pose.position.y.toFixed(2) });
      this.setState({
        map_yaw: this.getEulerFromQuat(message.pose.pose.orientation).toFixed(
          2
        ),
      });

      this.updateRobotPosition(
        this.state.map_x,
        this.state.map_y,
        180 - this.state.map_yaw
      );
    });
  };

  render() {
    return (
      <div>
        <Row>
          <div id="map_show"></div>
        </Row>
        <Row>
          <Col></Col>
          <Col>
            <ButtonGroup>
              <Button
                onClick={() => this.map_zoom(-0.1)}
                variant="outline-primary"
              >
                <BsZoomOut />
              </Button>
              <Button
                onClick={() => this.map_zoom(0.1)}
                variant="outline-primary"
              >
                <BsZoomIn />
              </Button>
              <Button
                onClick={() => this.map_pan(0.5, 0)}
                variant="outline-primary"
              >
                <BsFillCaretLeftFill />
              </Button>
              <Button
                onClick={() => this.map_pan(-0.5, 0)}
                variant="outline-primary"
              >
                <BsFillCaretRightFill />
              </Button>
              <Button
                onClick={() => this.map_pan(0, -0.5)}
                variant="outline-primary"
              >
                <BsFillCaretUpFill />
              </Button>
              <Button
                onClick={() => this.map_pan(0, 0.5)}
                variant="outline-primary"
              >
                <BsFillCaretDownFill />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        {/* <Row></Row> */}
      </div>
    );
  }
}

export default RobotState;
