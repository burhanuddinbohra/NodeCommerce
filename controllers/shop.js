
const Product = require('../models/product');


exports.getProducts= (req, res, next) => {
    Product.fetchAll((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products"
      });
    });
  }

exports.getProduct = (req,res,next)=>{
  const prodId = req.params.productId;
  console.log(prodId);

  Product.findById(prodId , (theProduct)=>{
    res.render('shop/product-detail', {
      pageTitle: theProduct.title,
      path: '/products',
      product : theProduct
    });
  });
}

exports.getIndex = (req,res,next)=>{
    Product.fetchAll((products) => {
        res.render("shop/index", {
          prods: products,
          pageTitle: "Shop",
          path: "/"
        });
      });
}


exports.getCart = (req,res,next)=>{
    res.render("shop/cart",{
        pageTitle: "Your Cart",
        path: "/cart"
    });
}

exports.postCart =(req,res,next)=>{
  const prodId = req.body.productId;
  console.log(prodId);
  res.redirect('/');
}

exports.getOrders = (req,res,next)=>{
    res.render('shop/orders',{
        pageTitle: 'Your Orders',
        path: 'orders'
    });
}

exports.getCheckout = (req,res,next )=>{
    res.render("shop/checkout",{
        pageTitle: "CheckOut Here",
        path: "/checkout"
    })
}