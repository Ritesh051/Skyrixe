const mongoose= require('mongoose');

const abandonedNotificationSchema=new mongoose.Schema({
    title:{type:String},
    body:{type:String},
    fcmTokens:{type:[String]},
    isNotified:{type:Boolean,default:false,enum:[true,false]}
},{
    timestamps:true
});

const abandonedNotificationSchemaData= mongoose.model('abandonedNotificationInfo',abandonedNotificationSchema);
module.exports=abandonedNotificationSchemaData;