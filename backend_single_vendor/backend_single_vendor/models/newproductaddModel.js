const mongoose = require('mongoose');

const newproductaddSchema = new mongoose.Schema({
    productid:{type:String,required:true},
    productDetails: {
        productcategory: { type: String, required: true, trim: true },
        productsubcategory: { type: String, trim: true },
        productname: { type: String, required: true, trim: true },
        producttitledescription: { type: String, trim: true },
        estimatedecorativetime: { type: Number, trim: true }
    },
    priceDetails: {
        price: { type: Number, required: true, min: 0 },
        gstslab: { type: String, enum: ['5%', '12%', '18%', '28%'], trim: true },
        discountedPrice:{type:Number}
    },
    productdescription: { 
        inclusion: { type: [String], trim: true },
        aboutexperience: { type: String, trim: true },
        need: { type: String, trim: true },
        cancellation: { type: String, trim: true }
    },
    productimages:
        { type: [String], trim: true }
    ,
    productcustomizeDetails: [
        {
            name: { type: String },
            price: { type: Number },
            customimages: { type: String },
            description: { type: String },
            customproductId:{type:String}
            
        }
    ],
    availableCities:{
        type:[String]
    }
    
},
{
    timestamps:true
});


const NewProductData = mongoose.model('NewProductData', newproductaddSchema);

module.exports = NewProductData;
