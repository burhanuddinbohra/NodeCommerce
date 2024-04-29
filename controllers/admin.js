const Product = require('../models/product');

exports.getAddProducts = (req,res,next)=>{
    res.render('admin/edit-product',{pageTitle:'Add-Product Admin',
                            formLabel: 'Book Title',
                        path:'/admin/add-product'})
}

exports.postAddProducts =(req,res,next)=>{
    // products.push({title: req.body.product});
    const title= req.body.title;
    const imageUrl= req.body.imageUrl;
    const price= req.body.price;
    const descriptioin= req.body.descriptioin;

    const prod = new Product(title, imageUrl, price, descriptioin);
    prod.save();
    res.redirect('/');
}

exports.getProducts = (req,res,next)=>{
    Product.fetchAll((products) => {
        res.render("admin/products", {
          prods: products,
          pageTitle: "Admin Products",
          path: "/admin/products"
        });
      });
}
