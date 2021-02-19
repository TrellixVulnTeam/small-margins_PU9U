const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const Product = require('./models/product');

const products = require('./routes/products');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/small-margins', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database Connected")
})

const app = express();

// Middleware
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + "/public")));
app.use(methodOverride('_method'));

// Set up session cookie
const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // Milliseconds in a week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
// app.use(flash());

// app.use((req, res, next) => {
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// })

app.use('/products', products);
app.use('/products/:id/reviews', reviews);

// CRUD functionality
app.get('/', async (req, res) => {
    const products = await Product.find({});
    res.render('home', { products });
})

app.post('/', async (req, res) => {
    const product = new Product(req.body.product);
    await product.save();
    req.flash('success', 'You have successfully created a new product.');
    res.redirect(`/products/${product._id}`);
})

app.listen(3000, () => {
    console.log("Listening on Port 3000");
})
