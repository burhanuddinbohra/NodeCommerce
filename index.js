const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");

const mongoose = require("mongoose");

const adminRouter = require("./routes/admin");
const shopRoutes = require(`./routes/shop`);

const errorController = require("./controllers/errorControllers");

const User = require("./models/user");
const user = require("./models/user");

const app = express();
const PORT = 8000;

//setting templating engines
app.set("view engine", "ejs"); //setting what to use
app.set("views", "views"); //where will be the templating engine files

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//making a middleware to store user in a requset object so that we can use it in the app

app.use((req, res, next) => {
  User.findById("664e4d39ff3bfaea319666dc")
    .then((user) => {
      req.user = user;
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

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/node-learn?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5"
  )
  .then((result) => {
    console.log("connected to mongoose");
    //cheking if there is a user already

    User.findOne().then((user) => {
      if (!user) {
        //making a new user

        const user = new User({
          name: "Burhan",
          email: "burhan@bnw.com",
          cart: [],
        });
        user.save().then((result) => {
          console.log("user created sucessfully");
        });
      }
    });

    app.listen(PORT);
  })
  .catch((err) => {
    console.log("UNABLE  to connect to  mongoose: " + err);
  });
