const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customerInfo",
      
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewProductData",
    
    },
    productName: { type: String },
    productDescription:{type:String},
    quantity: { type: Number },
    price: { type: Number},
    dateAdded: { type: String },
    slot: { type: String },
    productImage: { type: String },
    productcustomizeDetails: [
      {
        name: { type: String },
        price: { type: Number },
        customimages: { type: String },
        quantity:{type:Number,default:1}
      },
    ],
    isNotified: { type: Boolean, default: false, enum: [true, false] },
    isCheckedOut: { type: Boolean, default: false },
    totalAmount:{type:Number}
  },

  {
    timestamps: true,
  }
);

const cartSchemaData = mongoose.model("cartInfo", cartSchema);

module.exports = cartSchemaData;

// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "customerInfo" },
//      items:
//       {
//         productId: { type: mongoose.Schema.Types.ObjectId, ref: "NewProductData" },
//         productName:{type: String, required: true},
//         quantity: { type: Number, required: true },
//         price: { type: Number, required: true },
//         dateAdded:{type:Date},
//         slot:{type:String},
//         productImage:{type:String,required: true},
//         productcustomizeDetails: [
//           {
//               name: { type: String },
//               price: { type: Number },
//               customimages: { type: String }
//           }
//       ],
//       },
//       isNotified:{type:Boolean,default:false,enum:[true,false]},
//       isCheckedOut: { type: Boolean, default: false },
//     // lastUpdated: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// const cartSchemaData=mongoose.model("cartInfo", cartSchema);

// module.exports = cartSchemaData;
