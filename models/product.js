// const products = [];
const Cart = require('../models/cart');
const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(process.mainModule.filename), 'data' , 'products.json');

const getProductsFromFile = (cb)=>{
    fs.readFile(p , (err,fileContent)=>{
        if(err){
            cb([]);
        }else{
            cb(JSON.parse(fileContent));
        }
    })
}

module.exports = class Products {
  constructor(id, tit, imageUrl, price, descriptioin) {
    this.id = id;
    this.title = tit;
    this.imageUrl = imageUrl;
    this.price = price;
    this.descriptioin = descriptioin;
  }

  save() {
    getProductsFromFile((products) => {
      
      if (this.id) {
        const existingProdIndex = products.findIndex(
          (prod) => prod.id == this.id
        );
        let updatedProduct = [...products];
        updatedProduct[existingProdIndex] = this;

        fs.writeFile(p, JSON.stringify(updatedProduct), (err) => {
          if (!err) {
            console.log(`No error while writing and updating the file to JSON`);
          } else {
            console.log(`error while writting and updating file to JSON: ${err}`);
          }
        });

      } else {
        this.id = Math.random().toString();
        products.push(this);

        fs.writeFile(p, JSON.stringify(products), (err) => {
          if (!err) {
            console.log(`No error while writing the file to JSON`);
          } else {
            console.log(`error while writting file to JSON: ${err}`);
          }
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }

  static deleteById (id){
    getProductsFromFile((products) => {
      const product = products.find(prod => prod.id === id);
      const updatedProduct = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProduct), (err)=>{
        if (!err) {
          Cart.deleteProduct(id, product.price);
          console.log(`successfully deleted a product with id : ${id}`);
        }else{
          console.log(`you have some error in deleting a product.`);
        }
      });
    });
  }
};