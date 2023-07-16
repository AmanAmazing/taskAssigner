const express = require("express")
require('dotenv').config()
const mongoose = require("mongoose")
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require("passport-local-mongoose")

const PORT  = process.env.PORT || 3000 
const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set("view engine","ejs")
app.set(express.static("views"))

// sessions init
app.use(session({
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:false,
}));

app.use(passport.initialize())
app.use(passport.session())

// database
mongoose.connect(process.env.DATABASE_URI).then(()=>{
    console.log("connected to the database")
}).catch((err)=>{
    console.log("An error occurred connecting to the database")
})
const {Employee,Group,Organisation} = require("./models.js")
passport.use(Organisation.createStrategy())
passport.serializeUser(Organisation.serializeUser())
passport.deserializeUser(Organisation.deserializeUser())
// end of database code 



app.get("/",(req,res)=>{
    res.send('<h1> Welcome ot the app!</h1>')
})

app.get("/login",(req,res)=>{
    res.render("public/login")
})
app.post("/login",(req,res)=>{
    const organisation = new Organisation({
        name: req.body.organisation,
        email: req.body.email,
        password: req.body.password,
    })
    req.login(organisation,function(err){
        if (err){
            console.log(err)
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets")
            })
        }
    })
})

app.get("/register",(req,res)=>{
    res.render("public/register")
})

app.post("/registerUser",(req,res)=>{   
    Organisation.register({name:req.body.organisation,email:req.body.email},req.body.password,function(err,user){
        if (err){
            console.log(err)
            res.redirect("/register")
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets")
            })
        }
    })

})
app.get("/logout",(req,res)=>{
    req.logout()
    res.redirect("/login")
})

// currently working on 
app.get("/dashboard",(req,res)=>{
    if (req.isAuthenticated()){
        res.render("/public/dashboard")
    }else{
        res.redirect("/login")
    }
})


app.get("/secrets",(req,res)=>{
    if (req.isAuthenticated()){
        res.send("<h1> YOu are logged in </h1>")
    }else{
        res.redirect("/login")
    }
})


async function checkUser(email, password){
    try {
        const user = await Organisation.findOne({email:email})
        if (Object.is(user,null)){
            console.log("null user found")
        }
        console.log(user.name)
        if (user.password === password){
            console.log("password matched")
        }
    }catch (e){
        console.log(e.message)
    }

}

app.listen(PORT,()=>{
    console.log(`App started on port: ${PORT}`)
})
