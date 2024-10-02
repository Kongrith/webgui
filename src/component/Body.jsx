// stackoverflow.com/questions/63124161/attempted-import-error-switch-is-not-exported-from-react-router-dom

import React, { Component } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./Home";
import About from "./About";

class Body extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/about" element={<About />} />
        </Routes>
      </Router>
    );
  }
}

export default Body;
