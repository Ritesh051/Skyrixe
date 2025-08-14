const mongoose=require('mongoose')

const paymentSchema= new mongoose.Schema({
    customerId:{type:mongoose.Schema.Types.ObjectId,ref: "customerInfo"},
    orderId:{type:mongoose.Schema.Types.ObjectId,ref:"productOrder"},
    paymentId:{type:String},
    amount:{type:Number},
    isSuccess:{type:Boolean,default:false,enum:[true,false]},
    status:{type:String,default:"pending",enum:["pending","success","failed"]}
},
{
    timestamps:true
});

const paymentSchemaData=mongoose.model('paymentInfo',paymentSchema);
module.exports= paymentSchemaData;