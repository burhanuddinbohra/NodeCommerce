
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');

const adminRouter = require('./routes/admin');
const shopRoutes = require(`./routes/shop`);


const errorController = require('./controllers/errorControllers');

const mongoConnect = require('./util/database').mongoConnect;

const app = express();

//setting templating engines
app.set('view engine','ejs'); //setting what to use 
app.set('views','views'); //where will be the templating engine files


//making a middleware to store user in a requset object so that we can use it in the app

app.use((req, res, next) => {
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user;
  //     // console.log(req.user)
  //     next();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  next();
});

app.use(bodyparser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,'public')))
app.use('/admin',adminRouter);
app.use(shopRoutes);


//error page
app.use(errorController.getError404)



mongoConnect(()=>{
  app.listen(8000);
})