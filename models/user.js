const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  token: String, // Token for authentication(optional)
  tokenExpiry: Date, // Expiry date for the token (optional)
  cart: {
    items: [
      {
        // Reference to the product added to cart
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product", // Refers to the Product model
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

// Method to add a product to the user's cart
userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(
    (i) => i.productId.toString() == product._id.toString()
  );
  let newQuantity = 1;
  let updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({ productId: product._id, quantity: newQuantity });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

// Method to remove a product from the user's cart
userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((currrentitem) => {
    return currrentitem.productId.toString() !== productId.toString();
  });

  this.cart.items = updatedCartItems;
  return this.save();
};

// Method to clear all items from the user's cart
userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("Users", userSchema);
