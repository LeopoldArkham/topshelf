import React, { Component } from "react";

export default class ProgressBar extends Component {
  render() {
      const v = this.props.vals;
      const width_pending = (v[1] / v[0]) * 100;
      const width_assigned = (v[2] / v[0]) * 100;
      const width_completed = (v[3] / v[0]) * 100;
      
    return (
      <div>
        <div
          style={{ display: "inline-block", backgroundColor: "green", width: width_pending + "%", height: "10px" }}
        />
        <div
          style={{ display: "inline-block", backgroundColor: "orange", width: width_assigned + "%", height: "10px" }}
        />
        <div style={{ display: "inline-block", backgroundColor: "red", width: width_completed + "%", height: "10px" }} />
      </div>
    );
  }
}
