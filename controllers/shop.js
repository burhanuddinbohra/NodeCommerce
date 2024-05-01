
const Product = require('../models/product');
const Cart  = require('../models/cart');

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


exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for ( product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            qty: cartProductData.qty,
          });
        }
      }
      const totalCartPrice = cart.totalPrice;
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: cartProducts,
        totalPrice: totalCartPrice
      });
    });
  });
};

exports.postCart =(req,res,next)=>{
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price)
  });
  res.redirect('/cart');
}

exports.postCartItemDelete = (req,res,next)=>{
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
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