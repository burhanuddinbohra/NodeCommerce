const path = require("path");
const express = require("express");
const { title } = require("process");

const { check, body } = require("express-validator");

const adminController = require("../controllers/admin");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

//  /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProducts);

//  /admin/products => POST
router.post(
  "/product",
  isAuth,
  [
    body("title", "title must have minimum 3 characters")
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body("imageUrl").trim().isURL().withMessage("url galat daalra hai"),
    body("price", "price must be numeric").isNumeric(),
    body("descriptioin", "description must have minimum 5 characters")
      .trim()
      .isLength({ min: 5 }),
  ],
  adminController.postAddProducts
);

//  /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/edit-product/productId
router.get("/edit-product/:productId", isAuth, adminController.getEditProducts);

// /amin/edit-product
router.post(
  "/edit-product",
  isAuth,
  [
    body("title", "title must have minimum 3 characters")
      .trim()
      .isLength({ min: 3 })
      .isString(),
    body("imageUrl").trim().isURL().withMessage("url galat daalra hai"),
    body("price", "price must be numeric").isNumeric(),
    body("descriptioin", "description must have minimum 5 characters")
      .trim()
      .isLength({ min: 5 }),
  ],
  adminController.postEditProducts
);

//  /admin/delete-product
router.post("/delete-product", isAuth, adminController.postDeleteProducts);

module.exports = router;
