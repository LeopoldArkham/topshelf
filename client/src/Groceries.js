import React, { Component } from "react";
import { get, post } from "axios";
import ListItem from "./ListItem.js";
import ProgressBar from "./ProgressBar.js";

export default class Groceries extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newItem: "",
      qty: 1,
      items: []
    };

    this.list_id = this.props.match.params.id;
    if (this.props.private) {
      this.endpoint =
        "http://localhost:3100/api/" + this.props.user + "/lists/";
    } else {
      this.endpoint = "http://localhost:3100/api/lists/";
    }
  }

  componentWillMount() {
    console.log("URL: ", this.endpoint + this.list_id);
    get(this.endpoint + this.list_id).then(result =>
      this.setState({
        items: JSON.parse(result.data.items)
      })
    );
    console.log("Items: ", this.state.items);
  }

  pendingToAssigned(e) {
    post("http://localhost:3100/api/item/assign", {
      list_id: this.list_id,
      itemName: e.target.id,
      user: this.props.user
    }).then(result =>
      this.setState({
        items: JSON.parse(result.data.items)
      })
    );
  }

  completeItem(e) {
    const price = parseFloat(prompt("Price for " + e.target.id));
    post("http://localhost:3100/api/item/complete", {
      list_id: this.list_id,
      itemName: e.target.id,
      user: this.props.user,
      price: price,
      query: "list",
      isPrivate: this.props.private
    }).then(result =>
      this.setState({
        items: JSON.parse(result.data.items)
      })
    );
  }

  addItem(e) {
    e.preventDefault();
    if (this.state.newItem.length > 0) {
      post("http://localhost:3100/api/addItem", {
        list_id: this.list_id,
        item_name: this.state.newItem,
        qty: parseInt(this.state.qty, 10),
        user: this.props.user,
        isPrivate: this.props.private
      }).then(result =>
        this.setState({
          items: JSON.parse(result.data.items),
          newItem: "",
          qty: 1
        })
      );
    }
  }

  updateNewItem(e) {
    this.setState({ newItem: e.target.value });
  }

  updateQty(e) {
    this.setState({ qty: e.target.value });
  }

  pendingItemClicked(e) {
    if (this.props.private) {
      this.completeItem(e);
    } else {
      this.pendingToAssigned(e);
    }
  }

  render() {
    const pending = this.state.items.filter(item => item.status === "pending");
    const assigned = this.state.items.filter(
      item => item.status === "assigned"
    );
    const completed = this.state.items.filter(
      item => item.status === "completed"
    );
    return (
      <div className="container">
        <ProgressBar vals={[this.state.items.length, pending.length, assigned.length, completed.length]}/>
        Pending:
        <ul>
          {pending.map((item, idx) => (
            <ListItem
              key={idx}
              item={item}
              handleClick={this.pendingItemClicked.bind(this)}
            />
          ))}
        </ul>
        {assigned.length > 0 && (
          <div>
            <span>Assigned:</span>
            <ul>
              {assigned &&
                this.state.items
                  .filter(item => item.status === "assigned")
                  .map((item, idx) => (
                    <ListItem
                      key={idx}
                      item={item}
                      handleClick={this.completeItem.bind(this)}
                    />
                  ))}
            </ul>
          </div>
        )}
        {completed.length > 0 && (
          <details>
            <summary>Completed Items</summary>
            <ul>
              {completed.map((item, idx) => <ListItem key={idx} item={item} />)}
            </ul>
          </details>
        )}
        <form onSubmit={this.addItem.bind(this)}>
        <br/>
          <input
            type="text"
            placeholder="New Item"
            value={this.state.newItem}
            onChange={this.updateNewItem.bind(this)}
          />
          <input
            type="number"
            style={{ width: "10%" }}
            value={this.state.qty}
            onChange={this.updateQty.bind(this)}
            min="1"
          />
          <input value="Add" type="submit" />
        </form>
      </div>
    );
  }
}
