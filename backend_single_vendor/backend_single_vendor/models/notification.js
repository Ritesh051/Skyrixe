const mongoose=require('mongoose');

const notificationSchema=new mongoose.Schema({
    title:{type:String},
    body:{type:String},
    userType:{type:String},
    userNumbers:{type:String},
    fcmTokens:{type:[String]}
    // isNotified:{type:Boolean,default:false,enum:[true,false]}
},
{
    timestamps:true
})

const notificationSchemaData= mongoose.model('notificationInfo',notificationSchema);
module.exports=notificationSchemaData