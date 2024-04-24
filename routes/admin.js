const path = require('path');
const express = require('express');
const { title } = require('process');
const adminController = require('../controllers/admin');

const router = express.Router();

//  /admin/add-product => GET
router.use('/add-product',adminController.getAddProducts);

//  /admin/products => POST
router.post('/product',adminController.postAddProducts);

//  /admin/products => GET
router.get("/products" , adminController.getProducts);

module.exports=router;