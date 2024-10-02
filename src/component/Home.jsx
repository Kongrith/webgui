import React, { Component } from "react";

import Connection from "./Connection";
import RobotSwitch from "./RobotSwitch";
import RobotState from "./RobotState";
import Teleoperation from "./Teleoperation";
import NavConsole from "./NavConsole";
import Map from "./Map";

import { Row, Col } from "react-bootstrap";

class Home extends Component {
  render() {
    return (
      <>
        <Row>
          <Col xs={2} sm={2} md={2} lg={2} xl={2}>
            <Connection />
          </Col>
          <Col xl={6}>
            <RobotSwitch />
          </Col>
        </Row>
        <Row>
          <Col>
            <Map />
          </Col>
          <Col xs={4} sm={4} md={4} lg={4} xl={4}>
            <NavConsole />
            <RobotState />
            <Teleoperation />
          </Col>
        </Row>
      </>
    );
  }
}

export default Home;
