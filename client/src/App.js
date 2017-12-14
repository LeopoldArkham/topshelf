import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./NavBar.js";
import Groceries from "./Groceries.js";
import Home from "./Home.js";
import Assigned from "./Assigned.js";
import Fridge from "./Fridge.js";
import Newlist from "./Newlist.js";
import Login from "./Login.js";
import http from "./http.js";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: ""
    };
  }

  componentWillMount() {
    http.get("/api/user").then(result => {
      this.setState({ user: result.data });
    });
  }

  render() {
    return (
      <Router>
        <div className="App">
        {/* @cleanup: Should be a  nested component */}
          <Route path="/" exact render={routeProps => {
              return <NavBar name={this.state.user} />;
            }} />
          <Route
            path="/:any"
            render={routeProps => {
              console.log(routeProps.match);
              if (routeProps.match.url !== "/login") {
                return <NavBar name={this.state.user} />;
              } else {
                return null;
              }
            }}
          />
          <Route exact={true} path="/login" component={Login} />
          <Route exact={true} path="/fridge" component={Fridge} />
          <Route
            path="/"
            exact={true}
            render={routeProps => {
              return <Home user={this.state.user} {...routeProps} />;
            }}
          />
          <Route
            path="/assigned"
            exact={true}
            render={routeProps => {
              return <Assigned user={this.state.user} />;
            }}
          />
          <Route
            path="/newlist"
            exact={true}
            render={routeProps => {
              return <Newlist user={this.state.user} {...routeProps} />;
            }}
          />
          <Route
            path="/lists/:id"
            exact={true}
            render={routeProps => {
              return (
                <Groceries
                  user={this.state.user}
                  private={false}
                  {...routeProps}
                />
              );
            }}
          />
          <Route
            path="/:user/lists/:id"
            exact={true}
            render={routeProps => {
              return (
                <Groceries
                  user={this.state.user}
                  private={true}
                  {...routeProps}
                />
              );
            }}
          />
        </div>
      </Router>
    );
  }
}

export default App;
