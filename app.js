const express = require("express")


const PORT  = process.env.PORT || 3000 
const app = express()


app.get("/",(req,res)=>{
    res.send('<h1> Welccome ot the app!</h1>')
})


app.listen(PORT,()=>{
    console.log(`App started on port: ${PORT}`)
})
