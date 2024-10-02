import React, { Component } from "react";
import Connection from "./Connection";
import RobotSwitch from "./RobotSwitch"
import RobotState from "./RobotState";

class Home extends Component {

	render() {
		return (
			<div>
				<Connection />
				<RobotSwitch />
				<RobotState />
			</div>
		);
	}
}

export default Home;
