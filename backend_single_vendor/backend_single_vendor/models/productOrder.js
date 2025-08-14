const mongoose = require("mongoose");

const productOrderSchema = new mongoose.Schema(
  {
    // Razorpay Transaction Details
    orderId: { type: String }, // Razorpay Order ID
    transactionId: { type: String }, // Razorpay Payment ID

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "customerInfo" },
    itemQuantity: { type: Number },
    placedon: { type: Date, default: Date.now },
    slot: { type: String},
    productAmount: { type: Number  },
    totalAmount: { type: Number },
    paidAmount:{type: Number},
    remainingAmount:{type: Number },
    paymentMode: {
      type: String
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Processing", "Paid", "Failed", "Refunded","Cash"],
      default: "Pending",
    },

    status: {
      type: String,
      enum: ["confirmed", "completed", "cancelled", "in-transit"],
      default: "confirmed",
    },
    isActive: { type: Boolean, default: true },

    decoratorAddress: {
      name: { type: String },
      contact: { type: String },
      trackingId: { type: String }, 
      address: { type: String },
    },

    productId: { type: mongoose.Schema.Types.ObjectId, ref: "NewProductData"},
    productName: { type: String},
    productDescription: { type: String },
    prodimages: [{ type: String }],

    productcustomizeDetails: [
      {
        name: { type: String },
        price: { type: Number },
        customimages: { type: String, trim: true },
        quantity:{type:Number,default:1}
      },
    ],


    deliveryAddress: {
      houseNo: { type: String },
      street: { type: String },
      landmark: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: Number },
    },

    cancellationDetails: {
      reason: { type: String },
      comment: { type: String },
    },

    aboutX: { type: String },
    occasion: { type: String },
    altContact: { type: String }, 
    messageBoard: { type: String },
    customerRequirement: { type: String },
    ageColour:{type:String},
    ballonsName: [
      {
        name: { type: String },
        id: { type: Number },
      },
    ],

    customerage: { type: Number },
    decorationLocation: { type: String },
    customerName: { type: String }, 
    custom_Name:{type:String}
  },
  { timestamps: true }
);

const productOrder = mongoose.model("productOrder", productOrderSchema);
module.exports = productOrder;
