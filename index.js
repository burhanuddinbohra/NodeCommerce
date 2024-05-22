const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");

const adminRouter = require("./routes/admin");
const shopRoutes = require(`./routes/shop`);

const errorController = require("./controllers/errorControllers");

const User = require("./models/user");

const mongoConnect = require("./util/database").mongoConnect;

const app = express();

//setting templating engines
app.set("view engine", "ejs"); //setting what to use
app.set("views", "views"); //where will be the templating engine files

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//making a middleware to store user in a requset object so that we can use it in the app

app.use((req, res, next) => {
  User.findByUserId("663d3ab0ff72cb3fd709aec0")
    .then((users) => {
      req.users = new User(users.name, users.email, users.cart, users._id);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRouter);
app.use(shopRoutes);

//error page
app.use(errorController.getError404);

mongoConnect(() => {
  app.listen(8000);
});
