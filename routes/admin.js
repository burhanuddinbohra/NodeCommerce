const path = require("path");
const express = require("express");
const { title } = require("process");
const adminController = require("../controllers/admin");

const isAuth = require("../middleware/is-auth");

const router = express.Router();

//  /admin/add-product => GET
router.get("/add-product",isAuth,  adminController.getAddProducts);

//  /admin/products => POST
router.post("/product",isAuth, adminController.postAddProducts);

//  /admin/products => GET
router.get("/products",isAuth, adminController.getProducts);

// /admin/edit-product/productId
router.get("/edit-product/:productId",isAuth, adminController.getEditProducts);

// /amin/edit-product
router.post("/edit-product",isAuth, adminController.postEditProducts);

//  /admin/delete-product
router.post("/delete-product",isAuth, adminController.postDeleteProducts);

module.exports = router;
