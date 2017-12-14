import React, { Component } from "react";

export default class Login extends Component {
  render() {
    return (
      <div className="container">
        <form action="http://localhost:3100/login" method="post">
          <div>
            <input type="text" name="username" placeholder="Username" />
            <br />
          </div>
          <div>
            <input type="password" name="password" placeholder="Password" />
          </div>
          <div>
            <input type="submit" value="Log In" />
          </div>
        </form>
      </div>
    );
  }
}
