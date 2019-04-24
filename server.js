const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const server = app.listen(8000);
const session = require("express-session");
const io = require("socket.io")(server);
const mongoose = require("mongoose");
require("./server/models/user.js");
const User = mongoose.model("User");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "keyboardkitteh",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
  })
);
require("./server/config/mongoose.js");
require("./server/config/routes.js")(app);

io.on("connection", function(socket) {
  //   app.io.route("got_new_user", function(req) {
  //     app.io.broadcast("new_user", { new_user_name: req.data.name });
  //   });
  socket.on("weak_punch", function(data) {
    session.damage += parseInt(data.damage);
    socket.emit("button_update", {
      damage: session.damage
    });
    User.update(
      { _id: data.name },
      { $set: { damage: session.damage } },

      function(err) {
        // console.log(data);
      }
    );
  });

  socket.on("normal_punch", function(data) {
    session.damage += parseInt(data.damage);
    User.update(
      { _id: data.name },
      { $set: { damage: session.damage } },

      function(err) {
        // console.log(data);
      }
    );
  });

  socket.on("serious_punch", function(data) {
    session.damage += parseInt(data.damage);
    User.update(
      { _id: data.name },
      { $set: { damage: session.damage } },

      function(err) {
        // console.log(data);
      }
    );
  });

  socket.on("really_serious_punch", function(data) {
    session.damage += parseInt(data.damage);
    User.update(
      { _id: data.name },
      { $set: { damage: session.damage } },

      function(err) {
        // console.log(data);
      }
    );
  });

  socket.on("update_ranking", function(data) {
    User.find({})
      .sort({ damage: "descending" })
      .exec(function(err, ranking) {
        socket.emit("sent", { ranking: ranking });
        socket.broadcast.emit("sent", { ranking: ranking });

        // add socket to create new punch buttons then cooldowns
      });
  });
});
