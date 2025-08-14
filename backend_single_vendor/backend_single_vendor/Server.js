require('dotenv').config()
const express= require('express')
const app= express()
const mongoose= require('mongoose')
const cors= require('cors')
const helmet= require('helmet')
// const path=require("path")


////custoemr routing import
const customerData= require('./routes/customerRoutes')
//admin routing import
const adminData=require('./routes/adminRoutes')

// app.use(express.static(path.join(__dirname,"build")))

//basic middlewaRES
app.use(express.json());
app.use(cors());
app.use(helmet())
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next()
  
});


//db connection
mongoose.connect(process.env.MONGO_URI)
.then((res)=>{console.log("connected successfully")})
.catch((err)=>{console.log("error in conenction")})

//app listen
app.listen(process.env.PORT,()=>{
    console.log(`running on port ${process.env.PORT}`)
})

//api call for both customer and seller/admin

app.use('/api/v1/admin',adminData)
app.use('/api/v1/customer',customerData)
// app.get("*",(req,resp)=>{
//   resp.sendFile(path.join(__dirname,"build","index.html"))
// })