import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./NavBar.js";
import Groceries from "./Groceries.js";
import Home from "./Home.js";
import Assigned from "./Assigned.js";
import Fridge from "./Fridge.js";
import Newlist from "./Newlist.js";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: "Christopher"
    };
  }

  render() {
    return (
      <Router>
        <div className="App">
          <NavBar name={this.state.user} />
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
              return <Groceries user={this.state.user} private={false} {...routeProps} />;
            }}
          />
          <Route
            path="/:user/lists/:id"
            exact={true}
            render={routeProps => {
              return <Groceries user={this.state.user} private={true} {...routeProps} />;
            }}
          />
        </div>
      </Router>
    );
  }
}

export default App;
