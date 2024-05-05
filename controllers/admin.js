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

  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: descriptioin
    })
    .then((result) => {
      // console.log(result);
      console.log(`product uplooaded successfully`);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(`error while adding a new product : ${err}`);
    });
}

exports.getProducts = (req, res, next) => {
  // Product.findAll()
  req.user.getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getEditProducts = (req, res, next) => {
  const prodId = req.params.productId;
  let editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  req.user.getProducts({where : {id : prodId}})
    .then((products) => {
      const product = products[0];
      if (!product) {
        return redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit-Product Admin",
        formLabel: "Book Title",
        path: "/admin/edit-product",
        product: product,
        edit: editMode,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProducts = (req, res, next) => {
  const prodId = req.body.productId;
  const id = prodId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.descriptioin;

  Product.findByPk(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDescription;
      return product.save();
    })
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};


exports.postDeleteProducts = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => {
      console.log(`deleted a product successfully`);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};