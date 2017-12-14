import React, { Component } from "react";
import http from "./http.js"
import ListItem from "./ListItem.js";

export default class Assigned extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spent: 0.0,
      items: []
    };
  }

  componentWillMount() {
    http.get("/api/" + this.props.user + "/assigned").then(
      result =>
        this.setState({
          items: JSON.parse(result.data.items)
        })
    );
    this.updateTotalSpent();
  }

  updateTotalSpent() {
    http.get("/api/" + this.props.user + "/spent").then(
      result =>
        this.setState({
          spent: JSON.parse(result.data)
        })
    );
  }

  assignedToCompleted(e) {
    const price = parseFloat(prompt("Price for " + e.target.attributes.id.value));    
    http.post("/api/item/complete", {
      list_id: e.target.attributes.origin.value,
      itemName: e.target.attributes.id.value,
      user: this.props.user,
      price: price,
      query: "assigned",
      isPrivate: false,
    }).then(result => {
      this.setState({
        items: JSON.parse(result.data.items)
      })
      this.updateTotalSpent(); // React hopefully batches both state updates.
    }
    );
  }

  render() {
    return (
      <div>
        <span>Total amount spent: €{this.state.spent}</span><br/><br/>
        Assigned to you:
        <ul>
          {this.state.items.map((obj, idx) => {
            const item = obj[0];
            const origin = obj[1];
            console.log(item);
            return (
              <ListItem
                key={idx}
                item={item}
                origin={origin}
                handleClick={this.assignedToCompleted.bind(this)}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}
