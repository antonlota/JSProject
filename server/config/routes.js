var users = require("../controllers/users.js");
module.exports = function(app) {
  app.get("/", users.index);

  app.post("/login", users.login);

  app.post("/addUser", users.addUser);

  app.get("/main", users.main);

  app.get("/logout", users.logout);

  app.get("/users/:id", users.viewAccount);

  app.post("/users/update", users.updateAccount);

  app.get("/destroy/:id", users.destroyUser);

  app.get("/damage/:id/:damage", users.damageDealt);

  app.get("/timer", users.timer);

  //   app.get("/users/edit/:id", users.editAnimal);

  //   app.post("/users/update", users.updateAnimal);

  //   app.post("/add", users.addAnimal);
};
