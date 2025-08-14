const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const aboutusSchema= new Schema({
    details:{type:String,required:true}
},
{timestamps:true}
)

const aboutusSchemaData= mongoose.model('aboutusInfo',aboutusSchema);
module.exports= aboutusSchemaData