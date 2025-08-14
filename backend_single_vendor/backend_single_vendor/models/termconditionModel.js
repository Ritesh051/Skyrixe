const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const termsconditionSchema= new Schema({
    details:{type:String,required:true}
},{
    timestamps:true
})

const termsconditionSchemaData= mongoose.model('termconditionInfo',termsconditionSchema);
module.exports= termsconditionSchemaData