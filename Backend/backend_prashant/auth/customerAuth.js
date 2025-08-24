const customerauthSchemaData = require('../models/customerauthModel') ///auth model for customer signup and login
const Counter = require('../models/counter');
const multerSetup = require('../middlewares/uploadData');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
//message 91 service 
const { sendOtpViaMsg91, verifyOtpViaMsg91, resendOtpViaMsg91 } = require('../utils/msg91Utils')
//multer middleware
const upload = multerSetup(['image/jpeg', 'image/png'], 2 * 1024 * 1024);
const { OAuth2Client } = require('google-auth-library');
///customer signup 
// Save phone number and verify OTP. IMP+++OTP message service pending
//in this if a customer come if exist user this will helps in login and if not this will create a new user/customer


const customerphoneVerification = async (req, res) => {
  const { phone } = req.body;

  console.log("Received request for phone:", phone); // Debug log

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    let user = await customerauthSchemaData.findOne({ phone });

    let isNewUser = false;

    if (!user) {
      const counter = await Counter.findOneAndUpdate(
        { id: "customerId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const customerId = `Cust-${String(counter.seq).padStart(3, "0")}`;

      user = new customerauthSchemaData({
        customerId,
        phone,
        isPhoneVerified: false,
      });
      await user.save();

      isNewUser = true;
      console.log("New user created:", user.customerId);
    } else {
      user.isPhoneVerified = false;
      await user.save();
      console.log("Existing user found, verification reset:", user.customerId);
    }

    // Send OTP using MSG91
    try {
      await sendOtpViaMsg91(phone);
      console.log("OTP sent via MSG91 to:", phone);
    } catch (otpError) {
      console.error("MSG91 OTP send error:", otpError.response?.data || otpError.message);
      return res.status(500).json({
        message: 'Failed to send OTP via MSG91',
        error: otpError.response?.data || otpError.message,
        status: 500,
      });
    }

    return res.status(200).json({
      message: isNewUser
        ? 'OTP sent successfully. Please verify your phone number.'
        : 'OTP sent successfully. Please login.',
      userId: user._id,
      isNewUser,
      status: 200,
    });

  } catch (error) {
    console.error("Error in phone verification:", error);
    return res.status(500).json({
      message: 'Internal server error while processing request',
      error: error.message,
      status: 500,
    });
  }
};

// const customerphoneVerification = async (req, res) => {
//   const { phone } = req.body;

//   if (!phone) {
//     return res.status(400).json({ message: 'Phone number is required' });
//   }

//   try {
//     // Utility function to generate a 6-digit OTP
//     const generateOtp = () => Math.floor(100000 + Math.random() * 900000);
//     const otp = generateOtp();

//     // Sequence value for customerId
//     const counter = await Counter.findOneAndUpdate(
//       { id: "customerId" },
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true }
//     );

//     const customerId = `Cust-${String(counter.seq).padStart(3, "0")}`;

//     // Find user by phone
//     let user = await customerauthSchemaData.findOne({ phone });

//     if (!user) {
//       // If user doesn't exist, create a new one
//       user = new customerauthSchemaData({
//         customerId,
//         phone,
//         otp,
//         isPhoneVerified: false,
//       });
//       await user.save();

//       return res.status(200).json({
//         message: 'OTP sent successfully. Please verify your phone number.',
//         otp, 
//         userId: user._id,
//         status: 200,
//       });
//     }

//     // User exists, update OTP and reset phone verification status
//     user.otp = otp;
//     user.isPhoneVerified = false; // Reset verification status
//     await user.save();

//     return res.status(200).json({
//       message: 'OTP sent successfully. Please login.',
//       otp,
//       userId: user._id,
//       status: 200,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: 'Error processing request',
//       error: error.message,
//       status: 500,
//     });
//   }
// };

////otp verification logic
const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required', status: 400 });
  }

  try {
    const user = await customerauthSchemaData.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: 'User not found', status: 404 });
    }

    // Verify OTP using MSG91 API
    const result = await verifyOtpViaMsg91(phone, otp);

    if (result && result.message === 'OTP verified success') {
      user.isPhoneVerified = true;
      user.otpResendAt = null;
      await user.save();

      const token = jwt.sign(
        { userId: user._id, phone: user.phone },
        process.env.JWT_SECRET
      );

      const personalInfo = user.personalInfo;
      const isPersonalInfoComplete =
        personalInfo &&
        personalInfo.name?.trim() &&
        personalInfo.gender?.trim() &&
        personalInfo.dob;

      if (isPersonalInfoComplete) {
        return res.status(200).json({
          message: 'Phone verified. Login successful.',
          status: 200,
          userId: user._id,
          data: user,
          token,
        });
      } else {
        return res.status(200).json({
          message: 'Phone verified. Please complete your profile.',
          status: 200,
          userId: user._id,
          data: user
        });
      }
    } else {
      return res.status(400).json({
        message: result?.message || 'OTP verification failed',
        status: 400,
      });
    }

  } catch (error) {
    return res.status(500).json({
      message: 'Error verifying OTP',
      status: 500,
      error: error.message,
    });
  }
};

///resned otp api
const resendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required', status: 400 });
  }

  try {

    const user = await customerauthSchemaData.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: 'Phone number not registered', status: 404 });
    }


    await resendOtpViaMsg91(phone);

    return res.status(200).json({
      message: 'OTP resent successfully.',
      userId: user._id,
      status: 200,
    });
  } catch (error) {
    console.error("Resend OTP Failed:", error.message);
    return res.status(500).json({
      message: 'Failed to resend OTP',
      error: error.message,
      status: 500,
    });
  }
};

// const verifyOtp = async (req, res) => {
//   const { phone, otp } = req.body;

//   if (!phone || !otp) {
//     return res.status(400).json({ message: 'Phone number and OTP are required', status: 400 });
//   }

//   try {
//     // Find user by phone number
//     const user = await customerauthSchemaData.findOne({ phone });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found', status: 404 });
//     }

//     // Validate OTP
//     if (!user.otp || user.otp !== otp) {
//       return res.status(400).json({ message: 'Invalid or expired OTP', status: 400 });
//     }

//     // Mark phone as verified
//     user.isPhoneVerified = true;
//     user.otp = null;
//     await user.save();

//     ///token genarte 
//     const token = jwt.sign(
//       { userId: user._id, phone: user.phone },
//       process.env.JWT_SECRET
//     );
//     // Check if `personalInfo` is completely filled
//     const personalInfo = user.personalInfo;
//     const isPersonalInfoComplete =
//       personalInfo &&
//       personalInfo.name?.trim() &&
//       personalInfo.gender?.trim() &&
//       personalInfo.dob 


//     if (isPersonalInfoComplete) {
//       return res.status(200).json({
//         message: 'Phone number verified successfully and Login Successful',
//         status: 200,
//         userId: user._id,
//         data: user,
//         token
//       });
//     } else {
//       return res.status(200).json({
//         message: 'Phone number verified successfully. Please complete your registration.',
//         status: 200,
//         userId: user._id,
//         data: user,
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       message: 'Error verifying OTP',
//       status: 500,
//       error: error.message,
//     });
//   }
// };

//  Save personal information
//in this i am saving user perosnal information

// Save customer personal information and photo
const customerPersonalData = async (req, res) => {
  const { userId } = req.params;
  const { name, email, gender, dob, alternatePhone } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required', status: 400 });
  }

  try {
    const user = await customerauthSchemaData.findById(userId);

    if (!user || !user.isPhoneVerified) {
      return res.status(400).json({ message: 'Invalid or unverified user', status: 400 });
    }


    let photoPath = user.personalInfo.photo;
    if (req.file) {
      photoPath = req.file.location;
    }
    // Update personal info    
    user.personalInfo = { name, email, gender, dob, photo: photoPath, alternatePhone };
    const savingData = await user.save();
    ///token generation
    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET

    );


    //returning data
    return res.status(200).json({
      message: 'Personal information saved successfully. Login Successful.',
      data: savingData,
      token,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error saving personal information',
      error: error.message,
      status: 500
    });
  }
};

// const customerPersonalData = async (req, res) => {
//   const { userId } = req.params;
//   const { name, email, gender, dob,alternatePhone } = req.body;

//   if (!userId) {
//     return res.status(200).json({ message: 'User ID is required' });
//   }

//   try {
//     const user = await customerauthSchemaData.findById(userId); 

//     if (!user || !user.isPhoneVerified) {
//       return res.status(400).json({ message: 'Invalid or unverified user' });
//     }

//     // If file is uploaded, update the photo path
//     let photoPath = user.personalInfo.photo; 
//     if (req.file) {
//       photoPath = req.file.location;
//     }
//     // console.log(photoPath)

//     // Update personal info
//     user.personalInfo = { name, email, gender, dob, photo: photoPath,alternatePhone };
//     const savingData = await user.save(); 

//     return res.status(200).json({
//       message: 'Personal information saved successfully',
//       data: savingData,
//       status:200
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Error saving personal information', error: error.message,status:500 });
//   }
// };
///////////customer home address
const customerhomeaddressData = async (req, res) => {
  const { userId } = req.params;
  const { houseNo, street, city, state, landmark, pincode } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required', status: 400 });
  }

  try {
    const user = await customerauthSchemaData.findById(userId);

    if (!user || !user.isPhoneVerified) {
      return res.status(400).json({ message: 'Invalid or unverified user', status: 400 });
    }

    // Append new address instead of overwriting
    user.homeAddresses.push({ houseNo, street, city, state, landmark, pincode });

    const savedUser = await user.save();

    return res.status(200).json({
      message: 'Home address added successfully',
      data: savedUser.homeAddresses,
      status: 200
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving home address', error, status: 500 });
  }
};
////////////office address
const customerofficeaddressData = async (req, res) => {
  const { userId } = req.params;
  const { houseNo, street, city, state, landmark, pincode } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required', status: 400 });
  }

  try {
    const user = await customerauthSchemaData.findById(userId);

    if (!user || !user.isPhoneVerified) {
      return res.status(400).json({ message: 'Invalid or unverified user', status: 400 });
    }

    // Append new address instead of overwriting
    user.officeAddresses.push({ houseNo, street, city, state, landmark, pincode });

    const savedUser = await user.save();

    return res.status(200).json({
      message: 'Office address added successfully',
      data: savedUser.officeAddresses,
      status: 200
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving office address', error, status: 500 });
  }
};



//  Save customer address
//in this i am saving customer home address
// const customerhomeaddressData= async (req, res) => {
//     const { userId } = req.params;
//   const {  houseNo,street, city, state, landmark, pincode } = req.body;
//   //checking userid existence
//   if (!userId) {
//     return res.status(400).json({ message: 'User ID is required',status:400 });
//   }

//   try {
//     const user = await customerauthSchemaData.findById(userId);  

//     if (!user || !user.isPhoneVerified) {
//       return res.status(400).json({ message: 'Invalid or unverified user',status:400 });
//     }

//     user.homeAddress = {houseNo, street, city, state, landmark, pincode };  //saving data 
//     const savinghomeAddress= await user.save();  //save condiotn
//     if(!savinghomeAddress){s
//         return res.status(401).json({message:"Error in address insertion",status:401})
//     }
//    return  res.status(200).json({ message: 'Account created successfully',data:savinghomeAddress,status:200 });
//   } catch (error) {
//     return res.status(500).json({ message: 'Error saving address', error ,status:500});
//   }
// };

// ///save customer office address
// //in this customer saves its office address
// const customerofficeaddressData= async (req, res) => {
//   const { userId } = req.params;
// const {  houseNo,street, city, state, landmark, pincode } = req.body;
// //checking userid existence
// if (!userId) {
//   return res.status(400).json({ message: 'User ID is required',status:400 });
// }

// try {
//   const user = await customerauthSchemaData.findById(userId);  //finding user based on provided userid and it is mongoid

//   if (!user || !user.isPhoneVerified) {
//     return res.status(400).json({ message:'Invalid or unverified user',status:400 });
//   }

//   user.officeAddress = {houseNo, street, city, state, landmark, pincode };  //saving data 
//   const savingofficeAddress= await user.save();  //save condiotn
//   if(!savingAddress){
//       return res.status(401).json({message:"Error in address insertion",status:401})
//   }
//   ///returning dtaa
//  return  res.status(200).json({ message: 'Account created successfully',data:savingofficeAddress,status:200 });
// } catch (error) {
//   return res.status(500).json({ message: 'Error saving address', error,status:500});
// }
// };

// const express = require('express');
// const User = require('../models/User'); // Import your User model
// const router = express.Router();

// // Update Addresses API
// router.put('/update-address/:userId', async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { type, address, addressId } = req.body; 
//     // type = 'home' or 'office'
//     // addressId = optional (used for updating/deleting existing address)

//     let updateQuery = {};
//     let user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     if (type === 'home') {
//       if (addressId) {
//         // Update or delete existing home address
//         user.homeAddresses = user.homeAddresses.map(addr =>
//           addr._id.toString() === addressId ? { ...addr.toObject(), ...address } : addr
//         ).filter(addr => addr._id.toString() !== addressId || Object.keys(address).length > 0);
//       } else {
//         // Add new home address
//         user.homeAddresses.push(address);
//       }
//     } else if (type === 'office') {
//       if (addressId) {
//         // Update or delete existing office address
//         user.officeAddresses = user.officeAddresses.map(addr =>
//           addr._id.toString() === addressId ? { ...addr.toObject(), ...address } : addr
//         ).filter(addr => addr._id.toString() !== addressId || Object.keys(address).length > 0);
//       } else {
//         // Add new office address
//         user.officeAddresses.push(address);
//       }
//     } else {
//       return res.status(400).json({ message: 'Invalid address type' });
//     }

//     await user.save();
//     res.status(200).json({ message: 'Address updated successfully', user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// module.exports = router;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const customerGoogleLogin = async (req, res) => {
  const { googleToken } = req.body;

  if (!googleToken) {
    return res.status(400).json({ message: 'Google token is required', status: 400 });
  }

  try {
    // Verify Google token
    let ticket;
    let payload;

    try {
      ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();

      console.log("Google token verified:", payload);
    } catch (tokenError) {
      return res.status(401).json({
        message: 'Invalid Google token',
        status: 401,
        error: tokenError.message,
      });
    }
    // console.log(payload)
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists by Google ID or email
    let user = await customerauthSchemaData.findOne({
      $or: [
        { googleID: googleId },
        { 'personalInfo.email': email }
      ]
    });

    let isNewUser = false;

    if (!user) {
      // Create new user
      const counter = await Counter.findOneAndUpdate(
        { id: "customerId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      const customerId = `Cust-${String(counter.seq).padStart(3, "0")}`;


      user = new customerauthSchemaData({
        customerId,
        googleID: googleId,
        phone: googleId,
        isPhoneVerified: false,
        isActive: true,
        personalInfo: {
          name: name || '',
          email: email || '',
          gender: "Male" || "Female" || "Other",
          dob: null,
        },
        addresses: [],
        googleId,
        profilePicture: picture,
        isEmailVerified: true,
        isGoogleAuth: true,
        authProvider: 'google',
      });
      await user.save();

      // console.log("New Google user created:", user.customerId);
      isNewUser = true;
    } else {
      // Update existing user with Google info if not already set
      let updateData = {};

      if (!user.googleId) updateData.googleId = googleId;
      if (!user.personalInfo?.name && name) {
        updateData['personalInfo.name'] = name;
      }
      if (!user.personalInfo?.email && email) {
        updateData['personalInfo.email'] = email;
      }
      if (!user.profilePicture && picture) updateData.profilePicture = picture;
      if (!user.isEmailVerified) updateData.isEmailVerified = true;
      if (!user.isGoogleAuth) updateData.isGoogleAuth = true;
      if (!user.authProvider) updateData.authProvider = 'google';
      if (!user.isActive) updateData.isActive = true;

      if (Object.keys(updateData).length > 0) {
        user = await customerauthSchemaData.findByIdAndUpdate(user._id, updateData, { new: true });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        phone: user.phone // Keep consistent with OTP login
      },
      process.env.JWT_SECRET
    );

    // Check if personal info is complete (same logic as OTP verification)
    const personalInfo = user.personalInfo;
    const isPersonalInfoComplete =
      personalInfo &&
      personalInfo.name?.trim() &&
      personalInfo.gender?.trim() &&
      personalInfo.dob;

    if (isPersonalInfoComplete) {
      return res.status(200).json({
        message: isNewUser
          ? 'Google login successful.'
          : 'Google login successful.',
        status: 200,
        userId: user._id,
        data: user,
        token,
      });
    } else {
      return res.status(200).json({
        message: isNewUser
          ? 'Google login successful. Please complete your profile.'
          : 'Google login successful. Please complete your profile.',
        status: 200,
        userId: user._id,
        data: user
      });
    }

  } catch (error) {
    return res.status(500).json({
      message: 'Error during Google login',
      status: 500,
      error: error.message,
    });
  }
};

const customerEmailSignup = async (req, res) => {
  const { email, password, cnfPassword, name, phone } = req.body;

  if (!email || !password || !name || !cnfPassword || !phone) {
    return res.status(400).json({ message: "All fields are required", status: 400 });
  }

  if (password !== cnfPassword) {
    return res.status(400).json({ message: "Passwords do not match", status: 400 });
  }

  try {
    // Check if email already exists
    const existingUser = await customerauthSchemaData.findOne({ 'personalInfo.email': email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered", status: 409 });
    }


    // check if phone is already register or not
    const existingPhoneUser = await customerauthSchemaData.findOne({ phone: phone });
    if (existingPhoneUser) {
      return res.status(409).json({ message: "Phone number already registered", status: 409 });
    }
    

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Generate Customer ID
    const counter = await Counter.findOneAndUpdate(
      { id: "customerId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const customerId = `Cust-${String(counter.seq).padStart(3, "0")}`;

    // Create new user
    const newUser = new customerauthSchemaData({
      customerId,
      phone: phone,
      isPhoneVerified: false,
      isActive: true,
      password: hashedPassword,
      personalInfo: {
        name: name,
        email: email,
        gender: "",
        dob: null,
      },
      addresses: [],
      isEmailVerified: true,
      isGoogleAuth: false,
      authProvider: 'email',
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, phone: newUser.phone },
      process.env.JWT_SECRET
    );

    return res.status(201).json({
      message: "Signup successful",
      status: 201,
      userId: newUser._id,
      data: newUser,
      token,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Error during signup",
      status: 500,
      error: error.message,
    });
  }
};

const customerEmailLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required", status: 400 });
  }

  try {
    // Find user by email
    const user = await customerauthSchemaData.findOne({ 'personalInfo.email': email });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials", status: 401 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials", status: 401 });
    }

    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET
    );

    // Check if personal info is complete
    const personalInfo = user.personalInfo;
    const isPersonalInfoComplete =
      personalInfo &&
      personalInfo.name?.trim() &&
      personalInfo.gender?.trim() &&
      personalInfo.dob;

    if (isPersonalInfoComplete) {
      return res.status(200).json({
        message: "Login successful",
        status: 200,
        userId: user._id,
        data: user,
        token,
      });
    } else {
      return res.status(200).json({
        message: "Login successful. Please complete your profile.",
        status: 200,
        userId: user._id,
        data: user,
        token,
      });
    }

  } catch (error) {
    return res.status(500).json({
      message: "Error during login",
      status: 500,
      error: error.message,
    });
  }
};




module.exports = {
  customerhomeaddressData, customerphoneVerification, verifyOtp, customerGoogleLogin, customerEmailLogin, customerEmailSignup,
  customerPersonalData: [upload.single('photo'), customerPersonalData], customerhomeaddressData, customerofficeaddressData, resendOtp
}


