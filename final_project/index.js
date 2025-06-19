const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')


const app = express();

app.use(express.json());

app.use(session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    console.log("Middleware data:", req.session);
    if (req.session?.authorization?.username) {
        next();
    } else {
    return res.status(403).json({ message: "User not authenticated" });
    }
});
 
const PORT =5000;

app.listen(PORT,()=>console.log("Server is running"));
