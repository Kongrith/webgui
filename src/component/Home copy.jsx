import React, { Component } from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

class Home extends Component {
	state = {
		num_count: 0,
		x: 0.0,
		y: 0.0
	}

	count_callback = (num) => {
		this.setState({ num_count: this.state.num_count + num });
	}

	button_callback = () => console.log("hello button")

	render() {
		return (
      <div>
        <button
          onClick={() => this.button_callback()}
          type="button"
          className="btn btn-outline-primary"
        >
          Primary
        </button>
        <button
          onClick={() => this.button_callback()}
          type="button"
          className="btn btn-outline-danger"
        >
          Primary
        </button>

        <button
          onClick={() => this.count_callback(1)}
          type="button"
          className="btn btn-outline-info"
        >
          +
        </button>
        <button
          onClick={() => this.count_callback(-1)}
           type="button"
          className="btn btn-outline-info"
        >
          -
        </button>
        <h4>{this.state.num_count}</h4>
      </div>
    );
	}
}

export default Home;
