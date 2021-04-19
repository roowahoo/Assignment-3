
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const session = require('express-session');
const flash = require('connect-flash');
const csrf = require('csurf');
const FileStore = require('session-file-store')(session)
const cors=require('cors')

// create an instance of express app
let app = express();

// set the view engine
app.set('view engine', 'hbs');

app.use(cors())

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
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
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

//session data
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    next();
})

//csurf
// app.use(csrf())
const csurfInstance = csrf();
app.use(function(req,res,next){
    if(req.url==='/checkout/process_payment' || req.url.slice(0,5)=='/api/'||req.url==='/products/applyPromo'){
        return next()
    }
    csurfInstance(req,res,next)
})

app.use(function (req, res, next) {
    if (req.csrfToken){
        res.locals.csrfToken = req.csrfToken();
    }
    next();
})


const landingRoutes = require('./routes/landing')
const productsRoutes = require('./routes/products')
const vendorsRoutes = require('./routes/vendors')
const ordersRoutes = require('./routes/orders')

const api={
    products:require('./routes/api/products'),
    shoppers:require('./routes/api/shoppers'),
    shoppingBag:require('./routes/api/shoppingBag'),
    order:require('./routes/api/order'),
    checkout:require('./routes/api/checkout')
}

async function main() {
    app.use('/', landingRoutes);
    app.use('/products', productsRoutes)
    app.use('/vendors', vendorsRoutes)
    app.use('/orders',ordersRoutes)
    app.use('/api/products',express.json(),api.products)
    app.use('/api/shoppers',express.json(),api.shoppers)
    app.use('/api/bag',express.json(),api.shoppingBag)
    app.use('/api/order',express.json(),api.order)
    app.use('/api/checkout',api.checkout)
}

main();

app.listen(3000, () => {
    console.log('Server has started');
});