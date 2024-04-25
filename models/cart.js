const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);
module.exports = class Cart {
  //Fetch the existing cart
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let cart = {
        products: [],
        totalPrice: 0
      };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      //Analyise if you have the product in the cart or not
      const existingProductIndex =  cart.products.findIndex(prod => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      //if there is the product then increment its quantity / else ADD new product to cart
      if (existingProduct) {
        updatedProduct = {...existingProduct};
        updatedProduct.qty =  updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct
      }else{
        updatedProduct = { id : id , qty : 1};
        cart.products = [...cart.products , updatedProduct]
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
     fs.writeFile(p, JSON.stringify(cart), (err)=>{
        console.log(err);
     });
     
    });
  }
};
