var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
// Edit this line  when switching to real DB
var DBAL = require("./DBAL_dev");
var app = express();

// Middleware for logging requests
app.use(function(req, res, next) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (req.method !== "OPTIONS") {
    // Don't log preflight CORS requests.
    console.log("\n" + req.method + " request:\nPath: " + req.path + "\n");
  }
  next();
});
// Parser for POST requests
app.use(bodyParser());

// Serves back public lists
app.get("/api/suggestions", DBAL.suggestions);

// Serves back public lists
app.get("/api/lists", DBAL.lists);

// Serves back the user's expenses
app.get("/api/:user/spent", DBAL.spent);

// Serves back the user's private lists
app.get("/api/:user/lists", DBAL.privateLists);

// Serves back the items contained in list :id
app.get("/api/lists/:id", DBAL.list);

// Serves back the items contained in private list :id
app.get("/api/:user/lists/:id", DBAL.privateList);

// Serves back the items contained in list :id
app.get("/api/:user/assigned", DBAL.assigned);

// Serves back the items contained in list :id
app.get("/api/fridge", DBAL.fridge);

// Changes an item's status to assigned
app.post("/api/item/assign", DBAL.assign);

// Changes an item's status to completed.
app.post("/api/item/complete", DBAL.complete);

// Item was marked as completed from the Assigned page
app.post("/api/item/completeFromAssigned", DBAL.completeFromAssigned);

// Adds a new item to a list
app.post("/api/addItem", DBAL.addItem);

// Removes an item from the fridge
app.post("/api/removeFromFridge", DBAL.removeFromFridge);

// Creates a new list
app.post("/api/newlist", DBAL.newList);

app.listen(3100);
