require("dotenv").config({ path: "./creds.env" });
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
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// Setting up MongoDB session store
const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: "sessions",
});

// Setting up CSRF protection
const csrfProtection = csrf();

// Configuring multer for file uploads
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

// Setting the templating engine to EJS
app.set("view engine", "ejs"); //setting what to use
app.set("views", "views"); //where will be the templating engine files

// Importing routes
const adminRouter = require("./routes/admin");
const shopRoutes = require(`./routes/shop`);
const authRoutes = require(`./routes/auth`);

app.use(bodyparser.urlencoded({ extended: false }));

// Setting up multer for handling file uploads
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// Serving static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

// Configuring session management
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

// Adding CSRF token and authentication status to response locals
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  if (res.locals.isAuthenticated) {
    res.locals.userEmail = req.session.user.email;
  }
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Middleware to fetch user information from session
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

// Setting up routes
app.use("/admin", adminRouter);
app.use(shopRoutes);
app.use(authRoutes);

// Error handling routes
app.get("/500", errorController.getError500);
app.use(errorController.getError404);

// Error handling middleware
app.use((err, req, res, next) => {
  res.redirect("/500");
});

// Connecting to MongoDB and starting the server
mongoose
  .connect(MONGO_URI)
  .then((result) => {
    console.log("connected to mongoose");
    app.listen(PORT);
  })
  .catch((err) => {
    console.log("UNABLE  to connect to  mongoose: " + err);
  });
