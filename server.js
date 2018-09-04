const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session')
const config = require('./config/config');
const expressValidator = require("express-validator");



// accessing different routes 

const pages = require("./routes/pages");
const adminPages = require("./routes/adminPage");
const category  = require('./routes/category');





const port = 3000;
const app = express();
// connect to mlab mongoose serevr 
mongoose.connect(config.mongodbURI, () => {
    console.log("connected to mongoose serevr ")
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// public directory 
app.use(express.static(path.join(__dirname, "public")));
// set global error variables
app.locals.errors = null;

// bodyparser middleware for parsing data 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// sessions middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
}));

// express validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']'
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// express message middleware 
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

app.use('/', pages);
app.use('/admin/pages', adminPages);
app.use('/admin/category',category);


app.listen(port, () => {
    console.log("server listining on port 3000");
})



