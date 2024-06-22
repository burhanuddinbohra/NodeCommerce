const mongoose = require("mongoose");
const product = require("./product");

const Schema = mongoose.Schema;

// Define the order schema
const orderSchema = new Schema({
  // Array of products included in the order
  products: [
    {
      // Each product is stored as an object
      product: { type: Object, required: true },
      // Quantity of each product ordered
      quantity: { type: Number, required: true },
    },
  ],
  // User information associated with the order
  user: {
    email: {
      type: String,
      required: true,
    },
    userId: {
      // Reference to the User model
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users", // Ensures this field is related to the Users collection
    },
  },
});

module.exports = mongoose.model("Order", orderSchema);
