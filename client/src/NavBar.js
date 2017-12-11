import React, {Component} from "react";
import {Link} from "react-router-dom";

export default class NavBar extends Component {
    render() {
      return (
        <div
          style={{ padding: "5px", overflow: "auto", backgroundColor: "blue" }}
          id="navbar"
        >
          <Link
            to="/"
            style={{ color: "white", float: "left" }}
            id="nav"
          >
            Home
          </Link>
          <Link
            to="/assigned"
            style={{ color: "white", float: "right" }}
            id="name"
          >
            {this.props.name}
          </Link>
        </div>
      );
    }
  }