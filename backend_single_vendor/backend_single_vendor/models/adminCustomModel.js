const mongoose=require('mongoose');

const customSchema= new mongoose.Schema({
    name:{type:String},
    price:{type:Number},
    customimage:{type:String},
    description:{type:String}
    
},
{
    timestamps:true
});

const customSchemaData= mongoose.model('customproductsinfo',customSchema);
module.exports= customSchemaData