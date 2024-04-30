const fs = require('fs');
const path = require('path');
const p = path.join(path.dirname(process.mainModule.filename), 'data' , 'cart.json');

module.exports = class Cart {
    static postCart(prodId , prodPrice){
        let product = [];
        fs.readFile(p , (err, fileContent)=>{
            if (err) {
                product.totalPrice = 0;
                product.push({id: prodId, qty: 1});
            }
        });
        fs.writeFile(p , JSON.stringify(product), (err)=>{
            if (!err) {
                console.log(`error in writing to JSON : ${err}` )
            }else{
                console.log(`no error`);
            }
        });
    }
}