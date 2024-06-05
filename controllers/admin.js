const Product = require("../models/product");

const { validationResult } = require("express-validator");

exports.getAddProducts = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add-Product Admin",
    formLabel: "Book Title",
    path: "/admin/add-product",
    edit: "false",
    hasError: false,
    errorMessage: [],
    validationErrors: [],
  });
};

exports.postAddProducts = (req, res, next) => {
  // products.push({title: req.body.product});
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const descriptioin = req.body.descriptioin;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).render("admin/edit-product", {
      pageTitle: "Add Product",
      formLabel: "Book Title",
      path: "/admin/add-product",
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: descriptioin,
      },
      validationErrors: errors.array(),
      errorMessage: errors.array()[0].msg,
      edit: false,
    });
  }

  const product = new Product({
    title: title,
    price: price,
    description: descriptioin,
    imageUrl: imageUrl,
    userId: req.user,
  });

  product
    .save()
    .then((result) => {
      console.log(`product uplooaded successfully`);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(`error while adding a new product : ${err}`);
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  // Product.findAll()
  Product.find({ userId: req.user._id })
    // Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(`error logged : ${err}`);
      return next(error);
    });
};

exports.getEditProducts = (req, res, next) => {
  const prodId = req.params.productId;
  let editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit-Product Admin",
        formLabel: "Book Title",
        path: "/admin/edit-product",
        product: product,
        hasError: false,
        errorMessage: [],
        validationErrors: [],
        edit: editMode,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(`error logged : ${err}`);
      return next(error);
    });
};

exports.postEditProducts = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.descriptioin;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).render("admin/edit-product", {
      pageTitle: "Edit Product",
      formLabel: "Book Title",
      path: "/admin/add-product",
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDescription,
        _id: prodId,
      },
      validationErrors: errors.array(),
      errorMessage: errors.array()[0].msg,
      edit: "true",
    });
  }

  Product.findById(prodId)
    .then((product) => {
      console.log("product mila : " + product);
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageUrl;
      return product.save().then((result) => {
        console.log(` Product has been Updated to this`);
        res.redirect("/admin/products");
      });
    })

    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(`error logged : ${err}`);
      return next(error);
    });
};

exports.postDeleteProducts = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then((result) => {
      console.log(`deleted a product successfully`);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(`error logged : ${err}`);
      return next(error);
    });
};
