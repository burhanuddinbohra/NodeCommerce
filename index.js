const path = require("path");

const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/errorControllers");

const User = require("./models/user");

const app = express();
const PORT = 8000;
const MONGO_URI =
  "mongodb://127.0.0.1:27017/node-learn?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.5";

//setting a mongodb Session store
const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//setting templating engines
app.set("view engine", "ejs"); //setting what to use
app.set("views", "views"); //where will be the templating engine files

const adminRouter = require("./routes/admin");
const shopRoutes = require(`./routes/shop`);
const authRoutes = require(`./routes/auth`);

app.use(bodyparser.urlencoded({ extended: false }));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "mera secret hai ye",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  if (res.locals.isAuthenticated) {
    res.locals.userEmail = req.session.user.email;
  }
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log("user not found: " + err);
    });
});

app.use("/admin", adminRouter);
app.use(shopRoutes);
app.use(authRoutes);
//test
//error page
app.get("/500", errorController.getError500);
app.use(errorController.getError404);

//error middleware
app.use((err, req, res, next) => {
  res.redirect("/500");
});

mongoose
  .connect(MONGO_URI)
  .then((result) => {
    console.log("connected to mongoose");
    app.listen(PORT);
  })
  .catch((err) => {
    console.log("UNABLE  to connect to  mongoose: " + err);
  });
