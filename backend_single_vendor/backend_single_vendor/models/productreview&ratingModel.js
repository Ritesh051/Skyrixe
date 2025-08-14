const mongoose=require('mongoose');

const productreviewSchema=new mongoose.Schema({
    productId:{type:mongoose.Schema.Types.ObjectId,ref:'NewProductData'},
    customerId:{type:mongoose.Schema.Types.ObjectId,ref:'customerInfo'},
    rating:{type:Number},
    review:{type:String},
    image:{type:String}
},{
    timestamps:true
});

const productreviewSchemaData= mongoose.model('reviewInfo',productreviewSchema);
module.exports=productreviewSchemaData