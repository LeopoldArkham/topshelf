import React, { Component } from "react";

// const?
// item -> name
export default class ListItem extends Component {
    render() {
        // const idx = this.props.idx;
        const item = this.props.item;
        return(
            <li
            className="list_item"
            id={item.name}
            origin={this.props.origin}
            onClick={this.props.handleClick}
          >
            {item.qty}x {item.name}
          </li>
        );
    }
}