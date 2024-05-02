// const products = [];
const Cart = require('../models/cart');
const db = require('../util/database');



module.exports = class Products {
  constructor(id, tit, imageUrl, price, descriptioin) {
    this.id = id;
    this.title = tit;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = descriptioin;
  }

   save() {
    return  db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
      [this.title,this.price,this.description,this.imageUrl])
  }

  static fetchAll() {
    //this will return a promise
   return db.execute('SELECT * FROM `node-proj`.products;')
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE id = ?',[id])
  }

  static deleteById (id){
    
  }
};