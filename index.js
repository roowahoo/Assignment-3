const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');

// create an instance of express app
let app = express();

// set the view engine
app.set('view engine', 'hbs');

// static folder
app.use(express.static('public'));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

//sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

//flash messages
app.use(flash())
app.use(function (req, res, next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
});

app.use(function(req,res,next){
    res.locals.user = req.session.user;
    next();
})


const landingRoutes=require ('./routes/landing')
const productsRoutes=require('./routes/products')
const usersRoutes=require('./routes/users')

async function main() {
    app.use('/', landingRoutes);
    app.use('/products',productsRoutes)
    app.use('/users',usersRoutes)

}

main();

app.listen(3000, () => {
  console.log('Server has started');
});