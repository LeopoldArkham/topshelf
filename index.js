var express = require("express");
// var bodyParser = require("body-parser");
var request = require("request");
var passport = require("passport");
var Strategy = require("passport-local").Strategy;
var cookieSession = require('cookie-session');
// Edit this line to switch out the backend.
var DBAL = require("./DBAL_dev");

// Authentication middleware
passport.use(
  new Strategy(function(username, password, cb) {
    DBAL.findByUsername(username, function(err, user) {
      if (err) {
        return cb(err);
      }
      if (!user) {
        return cb(null, false);
      }
      if (user.password != password) {
        return cb(null, false);
      }
      console.log("Success: ", user);
      return cb(null, user);
    });
  })
);

// Serialization support for HTTP sessions.
passport.serializeUser(function(user, cb) {
  console.log("Serialized user!");  
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  console.log("Deserialized user!");  
  DBAL.findById(id, function(err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

var app = express();

app.use(cookieSession({
  secret: "Vulnerant Omnes"
}))

// Middleware for logging requests
app.use(function(req, res, next) {
  res.set("Access-Control-Allow-Origin", "http://localhost:3000");
  res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.set("Access-Control-Allow-Credentials", "true");
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

// app.use(require('cookie-parser')("Vulnerant omnes"));
app.use(require("body-parser").urlencoded({ extended: true }));
// app.use(
//   require("express-session")({
//     secret: "Vulnerant omnes",
//     resave: false,
//     saveUninitialized: false
//   })
// );


app.use(passport.initialize());
app.use(passport.session());


// Handle login request
app.post(
  "/login",
  passport.authenticate("local", { session: true, failureRedirect: "http://localhost:3000/login" }),
  function(req, res) {
    res.redirect("http://localhost:3000/");
  }
);

// The display name of the currently logged in user
app.get("/api/user", DBAL.user);

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
