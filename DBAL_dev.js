// Development Database Abstraction Layer
// This module contains the handlers for each API endpoint,
// using in-memory data to mock the database.

// To shift the application to a real database,
// copy this file into `DBAL_SQL.js`, reimplement
// its methods, and change the import line in index.js.

var request = require("request");

var users = ["Sam", "Richard", "Christopher"];
var private_lists = [[], [], ["B-day"]];
var items_in_private_lists = [{}, {}, { 0: [item("Cake"), item("Whisky")] }];
var spent = [0.0, 0.0, 0.0];
var assigned = [[], [], []];
var fridge = [item("Chicken"), item("Avocado")];

var all_lists = [
  "Main",
  "Christmas Dinner",
  "Lunch",
  "Mario Kart Night",
  "Conference Room Snacks"
];

var items_in_lists = {
  0: [item("Water"), item("Coffee"), item("Paper plates"), item("Salt")],
  1: [
    item("Wine"),
    item("Buche de Noel"),
    item("Lobster"),
    item("Foie Gras"),
    item("Toast")
  ],
  2: [item("Bread"), item("Mayonaise"), item("Ham"), item("Tomato")],
  3: [item("Crisps"), item("Chicken Wings"), item("Cheese Assortment")],
  4: [item("Nuts"), item("Vegetable Chips")]
};

// Helper, creates an item.
function item(name, qty, status, assignee, price) {
  return {
    name: name,
    qty: qty || 1,
    status: status || "pending",
    assignee: assignee || "",
    price: price || 0.0
  };
}

// Helper. From: https://stackoverflow.com/a/4878800
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

module.exports = {
  fridge: function(req, res) {
    res.json({ items: JSON.stringify(fridge) });
  },
  lists: function(req, res) {
    res.json({ lists: JSON.stringify(all_lists) });
  },
  spent: function(req, res) {
    console.log("here");
    const user_idx = users.findIndex(_user => _user === req.params.user);
    res.send(spent[user_idx].toString().slice(0, 5));
  },
  privateLists: function(req, res) {
    const user_idx = users.findIndex(_user => _user === req.params.user);
    res.json({ lists: JSON.stringify(private_lists[user_idx]) });
  },
  list: function(req, res) {
    const id = req.params.id;
    res.json({ items: JSON.stringify(items_in_lists[id]) });
  },
  privateList: function(req, res) {
    const id = req.params.id;
    const user_idx = users.findIndex(_user => _user === req.params.user);
    res.json({ items: JSON.stringify(items_in_private_lists[user_idx][id]) });
  },
  assigned: function(req, res) {
    const user = req.params.user;
    const user_idx = users.findIndex(_user => _user === user);
    console.log(assigned[user_idx]);
    res.json({ items: JSON.stringify(assigned[user_idx]) });
  },
  assign: function(req, res, next) {
    const b = req.body;
    const list_idx = b.list_id;
    const user_idx = users.findIndex(user => user === b.user);
    const item_idx = items_in_lists[list_idx].findIndex(
      item => item.name === b.itemName
    );
  
    // Update item status
    items_in_lists[list_idx][item_idx].status = "assigned";
    items_in_lists[list_idx][item_idx].assignee = b.user;
  
    // Add it to the assigned list for this user
    assigned[user_idx].push([items_in_lists[list_idx][item_idx], list_idx]);
    console.log(assigned[user_idx]);
  
    res.json({ items: JSON.stringify(items_in_lists[list_idx]) });
  },
  // @parallel
  complete: function(req, res, next) {
    const b = req.body;
    const list_idx = b.list_id;
    const user_idx = users.findIndex(user => user === b.user);
  
    if (b.isPrivate) {
      // Find the item in the enclosing list
      const item_idx = items_in_private_lists[user_idx][list_idx].findIndex(
        item => item.name === b.itemName
      );
  
      // Update item status and place in the fridge
      items_in_private_lists[user_idx][list_idx][item_idx].status = "completed";
      items_in_private_lists[user_idx][list_idx][item_idx].assignee = b.user;
      items_in_private_lists[user_idx][list_idx][item_idx].price += b.price;
      fridge.push(items_in_private_lists[user_idx][list_idx][item_idx]);
  
      // Update total spent
      spent[user_idx] += b.price;
  
      // Items in private lists are never assigned.
  
      // Return updated data
      res.json({
        items: JSON.stringify(items_in_private_lists[user_idx][list_idx])
      });
    } else {
      // !b.isPrivate
      // Find the item in the enclosing list
      const item_idx = items_in_lists[list_idx].findIndex(
        item => item.name === b.itemName
      );
  
      // Update item status and place in the fridge
      items_in_lists[list_idx][item_idx].status = "completed";
      items_in_lists[list_idx][item_idx].assignee = b.user;
      items_in_lists[list_idx][item_idx].price += b.price;
      fridge.push(items_in_lists[list_idx][item_idx]);
  
      // Update total spent
      spent[user_idx] += b.price;
  
      // Unassign the item
      // @bug: filter on list as well, in case two lists have
      // elements named identically.
      const assigned_idx = assigned[user_idx].findIndex(
        item => item[0].name === b.itemName
      );
      assigned[user_idx].splice(assigned_idx, 1);
  
      // Respond with the appropriate data:
      // b.query will be either "assigned" or "list"
      // depending on the url that made the request.
      // @todo: Remove this query parameter and match on
      // the request's origin URL.
      if (b.query === "assigned") {
        res.json({ items: JSON.stringify(assigned[user_idx]) });
      } else {
        res.json({ items: JSON.stringify(items_in_lists[list_idx]) });
      }
    }
  },
  completeFromAssigned: function(req, res, next) {
    const b = req.body;
    const list_idx = b.origin;  
    const user_idx = users.findIndex(user => user === b.user);
    const item_idx = items_in_lists[list_idx].findIndex(
      item => item.name === b.itemName
    );
    
    // Remove from assigned list
    var idx = assigned[user_idx].findIndex(function(_item) {
      return _item[0].name === b.itemName && _item[1] == b.origin;
    });
    assigned[user_idx].splice(idx, 1);
  
    // Update status in origin list and add to fridge
    items_in_lists[list_idx][idx].status = "completed";
    items_in_lists[list_idx][idx].payload = "0.0";
    fridge.push(items_in_lists[list_idx][item_idx]);
  
    // Respond
    res.json({ items: JSON.stringify(assigned[user_idx]) });
  },
  // @parallel
  addItem: function(req, res, next) {
    const b = req.body;
    const list_idx = b.list_id;
    const user_idx = users.findIndex(user => user === b.user);
    const new_name = toTitleCase(b.item_name);
    var duplicate = false;
  
    if (b.isPrivate) {
      // Check that the item is not a duplicate
      for (i of items_in_private_lists[user_idx][list_idx]) {
        if (i.name === new_name) {
          // If so, update qty
          i.qty += b.qty;
          duplicate = true;
          break;
        }
      }
      // Otherwise, create a new item
      if (!duplicate) {
        const _item = item(new_name, b.qty);
        items_in_private_lists[user_idx][list_idx].push(_item);
      }
      res.json({
        items: JSON.stringify(items_in_private_lists[user_idx][list_idx])
      });
    } else {
      for (i of items_in_lists[list_idx]) {
        if (i.name === new_name) {
          i.qty += b.qty;
          duplicate = true;
          break;
        }
      }
      if (!duplicate) {
        const _item = item(new_name, b.qty);
        items_in_lists[list_idx].push(_item);
      }
      // Respond
      res.json({ items: JSON.stringify(items_in_lists[list_idx]) });
    }
  },
  removeFromFridge: function(req, res, next) {
    item_idx = fridge.findIndex(item => item.name === req.body.itemName);
    fridge.splice(item_idx, 1);
  
    res.json({ items: JSON.stringify(fridge) });
  },
  newList: function(req, res, next) {
    const b = req.body;
    // The URL to redirect the client to.
    var url;
  
    if (b.isPrivate) {
      const user_idx = users.findIndex(_user => _user === b.user);
      const idx = private_lists[user_idx].push(b.listName) - 1;
      items_in_private_lists[user_idx][idx] = [];
  
      url = `/${b.user}/lists/${idx}`;
    } else {
      const idx = all_lists.length;
      all_lists.push(b.listName);
      items_in_lists[idx] = [];
  
      url = `/lists/${idx}`;
    }
    res.send(url);
  },
  suggestions: function(req, res) {
    const API_KEY = "519f4b9f00da9ec95d3d238d91f5e7f9";
    var payload = [];
    for (i of fridge) {
      request(
        "http://food2fork.com/api/search?key=519f4b9f00da9ec95d3d238d91f5e7f9&q=" +
          i.name,
        function(error, response, body) {
          if (!error && response.statusCode == 200) {
            r = JSON.parse(body);
            console.log(r["recipes"][0]);
            payload.push(r["recipes"][0]);
            // This is async, only respond when all requests have
            // completed.
            if (payload.length === fridge.length) {
              res.json({ recipes: JSON.stringify(payload) });
            }
          }
        }
      );
    }
  }
};
