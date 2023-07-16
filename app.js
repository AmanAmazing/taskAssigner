const express = require("express")
require('dotenv').config()

const PORT  = process.env.PORT || 3000 
const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set("view engine","ejs")
app.set(express.static("views"))

// database
const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URI).then(()=>{
    console.log("connected to the database")
}).catch((err)=>{
    console.log("An error occurred connecting to the database")
})
const {Employee,Group,Organisation} = require("./models.js")
// end of database code 



app.get("/",(req,res)=>{
    res.send('<h1> Welcome ot the app!</h1>')
})

app.get("/login",(req,res)=>{
    res.render("public/login")
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

app.post("/loginUser",(req,res)=>{
    const email  = req.body.email
    const password = req.body.password

    checkUser(email, password)
})

app.get("/register",(req,res)=>{
    res.render("public/register")
})

app.post("/registerUser",(req,res)=>{
    


    const newOrg = new Organisation({
        name: req.body.organisation,
        email: req.body.email,
        password: req.body.password
    });
    newOrg.save()
          .then(()=>{
              res.redirect("/");
          })
          .catch((err)=>{
              res.send(err);
          });
})


app.listen(PORT,()=>{
    console.log(`App started on port: ${PORT}`)
})
