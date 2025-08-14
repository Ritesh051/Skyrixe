// const mongoose=require('mongoose');
// const AddressSchema = new mongoose.Schema(
//   {
//     houseNo: { type: String },
//     street: { type: String },
//     landmark: { type: String },
//     city: { type: String },
//     state: { type: String },
//     pincode: { type: String },
//   },
//   { _id: true }
// );

// const UserSchema = new mongoose.Schema(
//   {
//     customerId: { type: String },
//     fcmToken: { type: String },
//     otp: { type: Number },
//     phone: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     alternatePhone: {
//       type: String
//     },
//     isPhoneVerified: {
//       type: Boolean,
//       default: false,
//     },
//     isActive: {
//       type: Boolean,
//       default: false,
//       enum: [true, false],
//     },
//     personalInfo: {
//       name: { type: String },
//       email: { type: String, unique: true },
//       gender: { type: String, enum: ['Male', 'Female', 'Other'] },
//       dob: { type: Date },
//       photo: { type: String },
//     },
//     homeAddresses: {
//       type: [AddressSchema], 
//       default: [],
//     },
//     officeAddresses: {
//       type: [AddressSchema], 
//       default: [],
//     },
//   },
//   { timestamps: true }
// );
// const User = mongoose.model('customerInfo', UserSchema);

// module.exports = User;


const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema(
  {
    houseNo: { type: String },
    street: { type: String },
    landmark: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    addresstype: { type: String, enum: ['home', 'office'], required: true }, 
  },
  { _id: true }
);

const UserSchema = new mongoose.Schema(
  {
    customerId: { type: String },
    fcmToken: { type: String },
    otp: { type: Number },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    alternatePhone: { type: String },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      enum: [true, false],
    },
    personalInfo: {
      name: { type: String },
      email: { type: String },
      gender: { type: String, enum: ['Male', 'Female', 'Other'] },
      dob: { type: Date },
      photo: { type: String },
    },
    Addresses: {
      type: [AddressSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model('customerInfo', UserSchema);

module.exports = User;
