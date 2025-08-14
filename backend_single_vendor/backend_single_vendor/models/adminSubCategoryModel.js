const mongoose=require('mongoose');

const subcategorySchema= new mongoose.Schema({
    catId:{type:mongoose.Schema.Types.ObjectId,ref:"categoryInfo"},
    subcatId:{type:String,required:true},
    subcategoryImage:{type:String,required:true},
    subcategoryName:{type:String,required:true},
    status:{type:String,default:'active',enum:['active','inactive']},
    isActive:{type:Boolean,default:true,enum:[true,false]}
},
{timestamps:true}
);

const subcategorySchemaData= mongoose.model('subcategoryInfo',subcategorySchema);
module.exports= subcategorySchemaData