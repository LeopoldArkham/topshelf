import React, { Component } from "react";
import http from "./http.js"
import ListItem from "./ListItem.js"


export default class Fridge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      suggestions: []
    };
  }

  componentWillMount() {
    this.getSuggestions();
    http.get("/api/fridge").then(result => {
      this.setState({
        items: JSON.parse(result.data.items)
      });
    });
  }

  getSuggestions() {
    http.get("/api/suggestions").then(result => {
      this.setState({
        suggestions: JSON.parse(result.data.recipes)
      });
      console.log(this.state.suggestions);
    });
  }

  remove(e, idx) {
    http.post("/api/removeFromFridge", {
      itemName: e.target.id
    }).then (result =>
    this.setState( {
      items: JSON.parse(result.data.items)
    }))
    this.getSuggestions();
  }

  render() {
    return (
      <div className="container">
        Fridge
        <ul>
          {this.state.items.map((item, idx) => (
            <ListItem
              key={idx}
              item={item}
              handleClick={this.remove.bind(this)}
            />
          ))}
        </ul>
        Suggestions:
        <ul>
        {this.state.suggestions.map((s, idx) => {
          if (s) {
            return <li key={idx}><a href={s.source_url}>{s.title}</a></li>
          } else {return null}})}
        </ul>
      </div>
    );
  }
}
