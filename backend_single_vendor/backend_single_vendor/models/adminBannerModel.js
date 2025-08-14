const mongoose= require('mongoose');

const bannerSchema= new mongoose.Schema({
    bannerId:{type:String,required:true},
    bannerTitle:{type:String,required:true},
    bannerImage:{type:String,required:true},
    bannerDescription:{type:String,required:true}
},
{
    timestamps:true
});

const bannerSchemaData= mongoose.model('bannerInfo',bannerSchema);
module.exports=bannerSchemaData