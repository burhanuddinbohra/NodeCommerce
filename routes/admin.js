const path = require("path");
const express = require("express");
const { title } = require("process");
const adminController = require("../controllers/admin");

const router = express.Router();

//  /admin/add-product => GET
router.get("/add-product", adminController.getAddProducts);

//  /admin/products => POST
router.post("/product", adminController.postAddProducts);

//  /admin/products => GET
router.get("/products" , adminController.getProducts);

 // /admin/edit-product/productId
router.get('/edit-product/:productId', adminController.getEditProducts);

 // /amin/edit-product
router.post('/edit-product', adminController.postEditProducts);

//  /admin/delete-product
router.post('/delete-product',adminController.postDeleteProducts)

module.exports = router;
