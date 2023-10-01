const express = require ('express')
const mongoose= require('mongoose')
const bodyParser = require('body-parser');
const register = require('./src/router/registerRouter')
const login = require('./src/router/loginRouter');
const order = require('./src/router/orderRouter');
const cart = require('./src/router/cartRouter');


const app= express()

app.use(bodyParser())
app.use(express.urlencoded({extended:true}))
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/register',register)
app.use('/login',login)
app.use('/order',order)
app.use('/cart',cart)


const  MONGODB_URL ='mongodb+srv://fathimama104:fathimama@cluster0.4hg9k1c.mongodb.net/cremebrulee?retryWrites=true&w=majority'
mongoose.connect( MONGODB_URL).then(()=>{
    app.listen(4000,()=>{
        console.log("server is running on http://localhost:4000");
    })
})
