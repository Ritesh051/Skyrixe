const mongoose=require('mongoose');

const cityListSchema= new mongoose.Schema({
    cityName:{type:String},
    pincode:{type:[Number]},
    cityImage:{type:String}
},{
    timestamps:true
})

const cityListSchemaData= mongoose.model('cityInfo',cityListSchema);

module.exports=cityListSchemaData;