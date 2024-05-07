
const Product = require('../models/product');
const Cart  = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(products => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  }).catch(err =>{
    console.log(err);
  });
};

exports.getProduct = (req,res,next)=>{
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

}

exports.getIndex = (req,res,next)=>{
  Product.fetchAll().then(products => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/"
    });
  }).catch(err =>{
    console.log(err);
  });

   
}


// exports.getCart = (req, res, next) => {

//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart.getProducts().then(product =>{
//         res.render("shop/cart", {
//                 pageTitle: "Your Cart",
//                 path: "/cart",
//                 products: product,
//                 // totalPrice: totalCartPrice
//               });
//       }).catch(err => console.log(err))
//     })
//     .catch((err) => console.log(err));
 
// };

// exports.postCart = (req, res, next) => {
//   const prodId = req.body.productId;
//   let fetchedCart;
//   let newQuantity = 1;
//   req.user
//     .getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts({ where: { id: prodId } });
//     })
//     .then((products) => {
//       let product;
//       if (products.length > 0) {
//         product = products[0];
//       }
      
//       if (product) {
//         const oldQuantity = product.cartItem.quantity;
//         newQuantity = oldQuantity + 1;
//         return product;
//       } 
//         return Product.findByPk(prodId)
      
//     }).then( product =>{
//       return fetchedCart.addProduct(product, {
//         through: { quantity: newQuantity },
//       });
//     })
//     .then(() => {
//       res.redirect("/cart");
//     })
//     .catch((err) => console.log(err));
// };

// exports.postCartItemDelete = (req, res, next) => {
//   const prodId = req.body.productId;
//   req.user
//     .getCart()
//     .then((cart) => {
//       return cart.getProducts({ where: { id: prodId } });
//     })
//     .then((product) => {
//       const productFetched = product[0];
//       return productFetched.cartItem.destroy();
//     })
//     .then(() => {
//       res.redirect("/cart");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.getOrders = (req, res, next) => {
//   req.user
//     .getOrders({include: ['products']})
//     .then((orders) => {
//       res.render("shop/orders", {
//         pageTitle: "Your Orders",
//         path: "orders",
//         orders: orders
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.postOrder = (req,res,next)=>{
//   let fetchedCart ;
//   req.user
//     .getCart()
//     .then(cart =>{
//       fetchedCart = cart;
//       return cart.getProducts();
//     }).then(products =>{
//       return req.user
//         .createOrder()
//         .then(order =>{
//          return order.addProduct(products.map(product =>{
//             product.orderItem = {quantity: product.cartItem.quantity};
//             return product;
//           }))
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }).then(result =>{
//       return fetchedCart.setProducts(null)
//     }).then((result)=>{
//       res.redirect('/orders');
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

// exports.getCheckout = (req,res,next )=>{
//     res.render("shop/checkout",{
//         pageTitle: "CheckOut Here",
//         path: "/checkout"
//     });
// }