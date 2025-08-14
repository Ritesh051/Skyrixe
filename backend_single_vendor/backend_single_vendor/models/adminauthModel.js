const mongoose= require('mongoose')
const Schema= mongoose.Schema;
const adminSchema= new Schema({
    phone:{type:Number,required:true},
    password:{type:String,required:true},
    name:{type:String},
    address:{type:String},
    email:{type:String},
    profileImage:{type:String},
    contactNo:{type:String}
},
{timestamps: true }
)

const adminSchemaData= mongoose.model('adminInfo',adminSchema);
module.exports= adminSchemaData