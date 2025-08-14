const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const privacypolicySchema= new Schema({
    details:{type:String,required:true}
},
{timestamps:true}
)

const privacypolicySchemaData= mongoose.model('privacyInfo',privacypolicySchema)
module.exports= privacypolicySchemaData