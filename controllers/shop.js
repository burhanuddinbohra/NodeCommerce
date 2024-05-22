const Product = require("../models/product");
// const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((theProduct) => {
      res.render("shop/product-detail", {
        pageTitle: theProduct.title,
        path: "/products",
        product: theProduct,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.users
    .getCart()
    .then((product) => {
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: product,
        // totalPrice: totalCartPrice
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.users.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
      console.log("ho gaya add" + result);
    });
};

exports.postCartItemDelete = (req, res, next) => {
  const prodId = req.body.productId;
  req.users
    .deleteCartItem(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  req.users
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  req.users
    .addOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

// exports.getCheckout = (req,res,next )=>{
//     res.render("shop/checkout",{
//         pageTitle: "CheckOut Here",
//         path: "/checkout"
//     });
// }
