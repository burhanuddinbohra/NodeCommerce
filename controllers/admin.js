const Product = require("../models/product");
const fileHelper = require("../util/file");

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
  const image = req.file;
  const price = req.body.price;
  const descriptioin = req.body.descriptioin;

  if (!image) {
    return res.status(404).render("admin/edit-product", {
      pageTitle: "Add Product",
      formLabel: "Book Title",
      path: "/admin/add-product",
      hasError: true,
      edit: false,
      product: {
        title: title,
        price: price,
        description: descriptioin,
      },
      errorMessage: "Attached file is not an image.!",
      validationErrors: [],
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).render("admin/edit-product", {
      pageTitle: "Add Product",
      formLabel: "Book Title",
      path: "/admin/add-product",
      hasError: true,
      product: {
        title: title,
        price: price,
        description: descriptioin,
      },
      validationErrors: errors.array(),
      errorMessage: errors.array()[0].msg,
      edit: false,
    });
  }

  const imageUrl = image.path;
  console.log("imageUrl Path : " + imageUrl);

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
      const methodName = arguments.callee.name;
      console.log(`Error in ${methodName}: ${err.message}`);
      const error = new Error(err);
      error.httpStatusCode = 500;
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
      const methodName = "getEditProducts";
      console.log(`Error in ${methodName}: ${err.message}`);
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(`error logged : ${err}`);
      return next(error);
    });
};

exports.postEditProducts = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const image = req.file;
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
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = image.path;
      }
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

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((prod) => {
      if (!prod) {
        return next(new Error("product not found while deleting"));
      }
      fileHelper.deleteFile(prod.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then((result) => {
      console.log(`deleted a product successfully`);
      res.status(200).json({
        message: "Success!",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "deleting product failed!",
      });
    });
};
