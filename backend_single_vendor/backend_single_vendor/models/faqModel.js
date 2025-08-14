const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const faqSchema= new Schema({
    details:{type:String,required:true}
},{
    timestamps:true
})

const faqSchemaData= mongoose.model('faqInfo',faqSchema);
module.exports= faqSchemaData