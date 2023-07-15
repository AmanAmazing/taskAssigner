const express = require("express")
require('dotenv').config()

// database
const mongoose = require("mongoose")
mongoose.connect(process.env.DATABASE_URI)

const employeeSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:true,
    },
    lastName: {
        type:String,
        required:true,
    },
    phoneNumber: {
        type:Number,
        required:true,
    },
    emailAddress:{
        type:String,
        required:true
    }
}) 

const groupSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    contacts: {
        type: [employeeSchema]
    }
})

const organisationSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        unique:true,
        lowercase: true
    }, 
    email: String, 
    password: String,
    groups: [groupSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type:Date,
        default:Date.now
    }
})

const Organisation = new mongoose.model("Organisation",organisationSchema)
const Group = new mongoose.model("Group",groupSchema)
const Employee = new mongoose.model("Employee",employeeSchema)

// end of database code 

const PORT  = process.env.PORT || 3000 
const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set("view engine","ejs")
app.set(express.static("views"))



app.get("/",(req,res)=>{
    res.send('<h1> Welcome ot the app!</h1>')
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
          })
})


app.listen(PORT,()=>{
    console.log(`App started on port: ${PORT}`)
})
