const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const returnpolicySchema= new Schema({
    details:{type:String,required:true}
},
{timestamps:true}
)

const returnpolicySchemaData= mongoose.model('returnprivacyInfo',returnpolicySchema)
module.exports= returnpolicySchemaData