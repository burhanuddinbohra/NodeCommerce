
const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');

const adminRouter = require('./routes/admin');
const shopRoutes = require(`./routes/shop`);

const errorController = require('./controllers/errorControllers');

const app = express();

//setting templating engines
app.set('view engine','ejs'); //setting what to use 
app.set('views','views'); //where will be the templating engine files

app.use(bodyparser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname,'public')))
app.use('/admin',adminRouter);
app.use(shopRoutes);

//error page
app.use(errorController.getError404)

const port = 8000;
app.listen(8000,()=>{console.log('server started');})
