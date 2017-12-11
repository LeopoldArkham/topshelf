import React, { Component } from "react";
import {post} from "axios";

export default class Newlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPrivate: false,
      listName: ""
    };
  }

  updateCheckbox(e) {
    this.setState({ isPrivate: e.target.value });
  }

  updateListName(e) {
    this.setState({ listName: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.listName.length === 0) {
      return
    }
    post("http://localhost:3100/api/newlist", {
      isPrivate: this.state.isPrivate,
      listName: this.state.listName,
      user: this.props.user
    }).then(result => (window.location = result.data));
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit.bind(this)}>
          Name:{" "}
          <input
            onChange={this.updateListName.bind(this)}
            type="text"
            placeholder="My List"
          />
          <br />
          <input
            onChange={this.updateCheckbox.bind(this)}
            type="checkbox"
            value="Private"
          />{" "}
          Private?<br />
          <br />
          <input type="submit" value="Create" />
        </form>
      </div>
    );
  }
}
