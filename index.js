
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');

const adminRouter = require('./routes/admin');
const shopRoutes = require(`./routes/shop`);

const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');

const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')


const Order = require('./models/order')
const OrderItem = require('./models/order-item')


const errorController = require('./controllers/errorControllers');
const { Association, Sequelize } = require('sequelize');

const app = express();

//setting templating engines
app.set('view engine','ejs'); //setting what to use 
app.set('views','views'); //where will be the templating engine files


//making a middleware to store user in a requset object so that we can use it in the app

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      // console.log(req.user)
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use(bodyparser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,'public')))
app.use('/admin',adminRouter);
app.use(shopRoutes);


//error page
app.use(errorController.getError404)

// {Associations Of Sequelize}
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through : CartItem});
Product.belongsToMany(Cart, {through : CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem});

const port = 8000;
sequelize
  .sync({force:true})
  .then((result) => {
    return User.findByPk(1);
  }).then((user)=>{
    if(!user){
      return  User.create({name: 'Burhan', email: 'test@node.com'})
    }
    return user;
  }).then((user)=>{
    // console.log(user);
      return user.createCart()
    
  }).then((cart)=>{
    app.listen(port, () => {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log(`Error while sync Sequelize err ${err}`);
  });


