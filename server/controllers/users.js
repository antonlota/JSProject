const mongoose = require("mongoose");
require("../models/user.js");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");

module.exports = {
  index: function(req, res) {
    res.render("index");
  },

  logout: function(req, res) {
    // console.log(req.session);
    req.session.destroy();
    res.redirect("/");
  },

  login: function(req, res) {
    User.find({ username: req.body.username }, function(err, data) {
      bcrypt
        .compare(req.body.password, data[0].password)

        .then(result => {
          if (result != true) {
            console.log(err);
            req.flash(
              "success",
              "This is a flash message using the express-flash module."
            );
            console.log(req.flash.success);
            console.log("result is false");
          } else {
            session.id = data[0]._id;
            session.username = data[0].username;
            session.damage = data[0].damage;

            // console.log(data[0].password);
            // console.log(result);
            res.redirect("/main");
          }
        })
        .catch(error => {
          console.log("there was an error", error);
          res.redirect("/");
        });
    });
  },

  addUser: function(req, res) {
    bcrypt.hash(req.body.password, 10).then(hashed_password => {
      User.create({
        username: req.body.username,
        password: hashed_password,
        damage: req.body.damage
      }).then(registration => {
        session.id = registration._id;
        session.username = registration.username;
        session.damage = registration.damage;
        res.redirect("/main");
      });
    });
  },

  main: function(req, res) {
    User.find({})
      .sort({ damage: "descending" })
      .exec(function(err, all) {
        User.find({ _id: session.id }, function(err, data) {
          res.render("main", { data: data, all: all });
          // console.log(all);
        });
      });
  },

  destroyUser: function(req, res) {
    // console.log(req.params.id);
    User.remove({ _id: req.params.id }, function(err) {
      res.redirect("/");
    });
  },

  viewAccount: function(req, res) {
    User.find({ _id: req.params.id }, function(err, data) {
      res.render("account", { data: data });
    });
  },

  updateAccount: function(req, res) {
    // console.log(req.body.id);
    bcrypt.hash(req.body.password, 10).then(hashed_password => {
      User.update(
        { _id: req.body.id },
        { $set: { username: req.body.username, password: hashed_password } }
      ).then(registration => {
        console.log(registration);
        res.redirect("/main");
      });
    });
  },

  damageDealt: function(req, res) {
    // console.log(session.damage);
    session.damage += parseInt(req.params.damage);
    User.update(
      { _id: req.params.id },
      { $set: { damage: session.damage } },
      function(err) {
        res.redirect("/main");
      }
    );
  },

  reload: function(req, res) {
    res.redirect("/main");
  },

  superman: function(req, res) {
    res.render("superman");
  }
};
