const Product = require('../models/product');

exports.getAddProducts = (req,res,next)=>{
    res.render('admin/edit-product',{pageTitle:'Add-Product Admin',
                            formLabel: 'Book Title',
                        path:'/admin/add-product',
                      edit: 'false'})
}

exports.postAddProducts =(req,res,next)=>{
    // products.push({title: req.body.product});
    const title= req.body.title;
    const imageUrl= req.body.imageUrl;
    const price= req.body.price;
    const descriptioin= req.body.descriptioin;

    const prod = new Product(null,title, imageUrl, price, descriptioin);
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

exports.getEditProducts = (req, res, next) => {
  const prodId = req.params.productId;
  let editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  Product.findById(prodId, (product) => {
    if (!product) {
      return redirect('/');
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit-Product Admin",
      formLabel: "Book Title",
      path: "/admin/edit-product",
      product: product,
      edit: editMode
    });
  });
}

exports.postEditProducts =(req,res, next)=>{
  const prodId =  req.body.productId;
  const id= prodId;
  const title= req.body.title;
  const imageUrl= req.body.imageUrl;
  const price= req.body.price;
  const descriptioin= req.body.descriptioin;

  const updatedProduct = new Product(id,title, imageUrl, price, descriptioin);
  updatedProduct.save();
  res.redirect('/admin/products');
}


exports.postDeleteProducts = (req,res,next)=>{
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
}