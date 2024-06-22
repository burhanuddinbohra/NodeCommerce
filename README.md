# NodeCommerce: Your Node.js E-commerce Solution

Welcome to NodeCommerce, a comprehensive e-commerce website built with Node.js, Express, EJS, HTML, and CSS. This project serves as an educational template for developers and learners interested in building scalable e-commerce platforms using Node.js technology. Please note that while functional, some practices used in this project might not be considered ideal for production environments and are intended for educational purposes.

## Features

- **Shop:** Browse through various products available on the platform.
- **Product Details:** View detailed information about each individual product.
- **User Authentication:**
  - **Signup:** Create a user profile. Email notifications are sent using SendGrid.
  - **Login:** Authenticate users with email and password.
  - **Forgot Password:** Reset password via email.
- **User Roles:**  By default, any user who logs in has admin rights. Modify the logic as needed.
- **Admin Features:**
  - **Add Products:** Admins can add new products to the platform.
  - **Manage Products:** Admins can edit or delete products they have added.
- **Shopping Cart:**
  - **Add to Cart:** Users can add products to their shopping cart.
  - **View Cart:** See all items currently in the shopping cart.
- **Orders:**
  - **Place Order:** Users can place orders from their cart.
  - **Order History:** View previous and current orders.
  - **Invoice:** Download an invoice for each order.
- **Form Validation:** Server-side validation using `express-validator`.
- **Authentication and Authorization:** Fully authenticated and authorized routes for each user.

## Installation

To run this project locally, follow these steps:

1. **Clone Repository:**
   git clone https://github.com/burhanuddinbohra/NodeCommerce.git
   cd <project_directory>

2. **Install Dependencies:**
   npm install

3. **Set Environment Variables:**
   There's a `creds.env` file in the root directory with the following variables:
   Make sure to edit them as per your system's / account's{sendGrid} configuration

PORT=8000
MONGO_URI= <mongodb_connection_string>
SESSION_SECRET=\_SOME_secret@key
SENDGRID_API_KEY=<your-api-key-here>

5. **Access the Application:**
   Open your browser and visit [http://localhost:8000/](http://localhost:8000/)

## Technologies Used

- Node.js
- Express.js
- EJS (Embedded JavaScript)
- HTML/CSS
- SendGrid (for email services)

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvement, please create a GitHub issue or submit a pull request.
