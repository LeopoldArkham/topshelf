import React, { Component } from "react";
import http from "./http.js"
import { Link } from "react-router-dom";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      publicLists: [],
      privateLists: [],
    };
  }

  componentWillMount() {
    http.get("/api/lists").then(result => {
      this.setState({
        publicLists: JSON.parse(result.data.lists)
      });
    });
    http.get("/api/" + this.props.user + "/lists").then(result => {
      this.setState({
        privateLists: JSON.parse(result.data.lists)
      });
    })
  }

  render() {
    return (
      <div className="container">
        <Link to="/fridge" ><h2>View Fridge</h2></Link>
        Public Lists:
        <ul>
          {this.state.publicLists.map((l, idx) => {
            return (
              <Link key={idx} to={"/lists/" + idx}>
                <li>{l}</li>
              </Link>
            );
          })}
        </ul><br/>
        Your Private Lists:
        <ul>
          {this.state.privateLists.map((l, idx) => {
            return (
              <Link key={idx} to={"/" + this.props.user + "/lists/" + idx}>
                <li>{l}</li>
              </Link>
            );
          })}
        </ul><br/>
        <Link to="/newlist"> + New List </Link>
      </div>
    );
  }
}
