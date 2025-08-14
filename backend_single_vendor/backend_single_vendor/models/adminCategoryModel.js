const mongoose=require('mongoose');

const categorySchema= new mongoose.Schema({
    catId:{type:String,required:true},
    categoryImage:{type:String,required:true},
    categoryName:{type:String,required:true},
    status:{type:String,default:'active',enum:['active','inactive']},
    isActive:{type:Boolean,default:true,enum:[true,false]}
},
{timestamps:true}
);

const categorySchemaData= mongoose.model('categoryInfo',categorySchema);
module.exports= categorySchemaData