const mongoose= require('mongoose');

const dealbannerSchema= new mongoose.Schema({
    dealbannerId:{type:String,required:true},
    dealbannerTitle:{type:String,required:true},
    dealbannerImage:{type:String,requred:true}
   
},
{
    timestamps:true
});

const dealbannerSchemaData= mongoose.model('dealbannerInfo',dealbannerSchema);
module.exports= dealbannerSchemaData;