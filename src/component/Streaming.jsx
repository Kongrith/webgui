import React, { Component } from "react";
import Config from "./config/config";

class Streaming extends Component {
  state = {
	  connected: false,
    	ros: null,
	  info_msg: "",
  };

  constructor() {
    super();
  }

  componentDidMount() {
	  this.init_connection();
	  this.getStreamingInfo();
  }


	init_connection() {
    this.state.ros = new window.ROSLIB.Ros();

    this.state.ros.on("connection", () => {
		this.setState({ connected: true });
		console.log("connected");
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
	getStreamingInfo = () => {
    var info_sub = new window.ROSLIB.Topic({
		ros: this.state.ros,
		name: Config.RGB_TOPIC, // The ROS topic you want to subscribe to
		messageType: 'sensor_msgs/CompressedImage' // The message type for the topic ,
    });

		info_sub.subscribe(function (message) {
			// console.log('Received message on ' + message);
			// var imagedata = "data:image/jpg;base64," + message.data;
			// console.log(imagedata)
			document.getElementById("image_sub").src = "data:image/png;base64," + message.data;
            // info_sub.unsubscribe();
			// this.setState({ info_msg: message.data });
			// document.getElementById('image_sub').src = "data:image/jpeg;base64," + message.data;
	})

{/* <img src="http://192.168.1.114:8080/stream?topic=/rgb/compressed" /> */}
    // info_sub.subscribe((message) => {
    //   this.setState({ info_msg: message.data });
    // });

// 	info_sub.subscribe(function(msg) {
//     var canvas = document.getElementById('rgb-canvas');
//     ctx = canvas.getContext('2d');
//     var image = new Image();
//     image.onload = function() {
//       ctx.drawImage(image, 0, 0);
//     };
//     image.src = `data:image/png;base64,${msg.data}`;
//   });
  };

  render() {
    return (
      <div>
			<h1>Streaming</h1>
			<img id="image_sub" />
			{/* <img src="http://localhost:8080/stream?topic=/IMAGE_TOPIC" /> */}
			{/* <img src="http://192.168.1.119:8080/stream?topic=/rgb/compressed" /> */}
      </div>
    );
  }
}

export default Streaming;
