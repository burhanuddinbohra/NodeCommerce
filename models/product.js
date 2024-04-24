// const products = [];
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
  constructor(tit,imageUrl,price,descriptioin) {
    this.title = tit;
    this.imageUrl = imageUrl;
    this.price = price;
    this.descriptioin = descriptioin;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile((products) => {
      products.push(this);

      fs.writeFile(p, JSON.stringify(products), (err) => {
        if(!err){
            console.log(`No error while writing the file to JSON`);
        }else{
            console.log(`error while writting file to JSON: ${err}`);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb){
    getProductsFromFile((products) => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};