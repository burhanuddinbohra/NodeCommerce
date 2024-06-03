const express = require("express");
const router = express.Router();

const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

const User = require("../models/user");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("invalid email").normalizeEmail(),
    body(
      "password",
      "Please enter password with atleast 5 character and contains characters and numbers."
    )
      .isLength({ min: 4 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              "This email already exists, please choose a different email!"
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter password with atleast 5 character and contains characters and numbers."
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((pass, { req }) => {
        if (pass !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.get("/reset", authController.getResetPassword);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
