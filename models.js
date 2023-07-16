const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

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
    contacts: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Employee"
    }]
})

const organisationSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        unique:true,
        lowercase: true
    }, 
    email: {
        type:String,
        required:true,
        lowercase:true,
        unique:true
    }, 
    password: String,
    groups: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Group"
    }],
    createdAt: {
        type: Date,
        immutable: true,
        default: Date.now
    },
    updatedAt: {
        type:Date,
        default:Date.now
    }
})

organisationSchema.plugin(passportLocalMongoose, {usernameField:'email'}); // used for hashing, salting, saving users

organisationSchema.pre('save',function(next){
    this.updatedAt = Date.now()
    next()
})

const Organisation = new mongoose.model("Organisation",organisationSchema)
const Group = new mongoose.model("Group",groupSchema)
const Employee = new mongoose.model("Employee",employeeSchema)

// end of database code 
module.exports = { Employee, Group, Organisation}


