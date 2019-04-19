const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const server = app.listen(8000);
const session = require("express-session");
const io = require("socket.io")(server);
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
  socket.emit("greeting", {
    msg: "Greetings, from server Node, brought to you by Sockets! -Server"
  });
  socket.on("thankyou", function(data) {
    console.log(data.msg);
  });
});
