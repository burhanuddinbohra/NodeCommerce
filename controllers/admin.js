const Product = require("../models/product");
const fileHelper = require("../util/file");

const { validationResult } = require("express-validator");

// Renders the "Add Product" page
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

// Handles form submission for adding a new product
exports.postAddProducts = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const descriptioin = req.body.descriptioin;

  // Check if an image is uploaded
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

  // Validate input fields
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

   // Get image URL and create a new product
  const imageUrl = image.path;
  const product = new Product({
    title: title,
    price: price,
    description: descriptioin,
    imageUrl: imageUrl,
    userId: req.user,
  });

    // Save the product to the database
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

// Fetches and renders the products associated with the logged-in user
exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
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

// Renders the "Edit Product" page with the product details
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

// Handles form submission for editing an existing product
exports.postEditProducts = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const image = req.file;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.descriptioin;

  // Validate input fields
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

  // Find the product by ID and update its details
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      if (image) {
        fileHelper.deleteFile(product.imageUrl); // Delete the old image
        product.imageUrl = image.path; // Set the new image URL
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

// Handles the deletion of a product
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
