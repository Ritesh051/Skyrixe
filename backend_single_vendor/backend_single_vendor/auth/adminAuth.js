const { json } = require("express");
const adminSchemaData = require("../models/adminauthModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//admin signup
//this is for admin signup
const signup = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newentry = new adminSchemaData({
      phone: phone,
      password: hashedPassword,
    });
    await newentry.save();

    if (!newentry) {
      return res.status(404).json({ message: "Failed to create" });
    }

    return res.status(200).json({ message: "Created Success", data: newentry });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

///////////login api for admin

const adminphoneVerification = async (req, res) => {
  const { phone, password } = req.body;

  try {
    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: "Phone number and password are required" });
    }

    const checkExistence = await adminSchemaData.findOne({ phone });

    if (!checkExistence) {
      return res
        .status(404)
        .json({ message: "User not found. Please sign up" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      checkExistence.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: checkExistence._id,
        phone: checkExistence.phone,
      },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      message: "Login successful",
      status: 200,
      data: {
        id: checkExistence._id,
        phone: checkExistence.phone,
        token,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    try {
      const { id, password, oldPassword } = req.body;

      const userFetch = await adminSchemaData.findById(id);
      if (!userFetch) {
        return res.status(404).json({ message: "User not found" });
      }
      const oldUserPassword = userFetch.password;

      if (!oldUserPassword) {
        return res.status(400).json({ message: "Enter Your Old Password" });
      }

      if (!bcrypt.compareSync(oldPassword, oldUserPassword)) {
        return res.status(403).json({ message: "Old Password is Incorrect" });
      }

      if (bcrypt.compareSync(password, oldUserPassword)) {
        return res.status(403).json({
          message: "This Password Already Exists, Try a New Combination",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const updatedUser = await adminSchemaData.findByIdAndUpdate(
        id,
        { password: hashedPassword, otp: null },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(400).json({ message: "Failed to update password" });
      }

      return res
        .status(200)
        .json({ message: "Password Updated Successfully", data: updatedUser });
    } catch (error) {
      console.error("Error in Password Update:", error.message);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

////admin details here
const adminDetails = async (req, res) => {
  try {
    const { name, contactNo, profileImage, email, address } = req.body;
    const { id } = req.params;
    ///check existence
    const check = await adminSchemaData.findById(id);
    if (!check) {
      return res.status(404).json({ message: "User Not Found" });
    }
    /////checks for details
    const updateObj = {};
    //name check
    if (name) {
      updateObj.name = name;
    }
    //contactNo check
    if (contactNo) {
      updateObj.contactNo = contactNo;
    }
    //profile image check
    if (profileImage) {
      updateObj.profileImage = profileImage;
    }
    //email check
    if (email) {
      updateObj.email = email;
    }
    ///addresss check
    if (address) {
      updateObj.address = address;
    }

    ///updtae query
    const query = await adminSchemaData.findByIdAndUpdate(
      id,
      { $set: updateObj },
      { new: true }
    );
    if (!query) {
      return res.status(400).json({ message: "Details not updated" });
    }
    return res
      .status(200)
      .json({ message: "Details Updated Successfully", data: query });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

///admin profile view 
const profileView = async (req, res) => {
  try {
    const { id } = req.params;
    ///check existenece
    const check = await adminSchemaData.findById(id);
    if (!check) {
      return res.status(404).json({ message: "User Not found" });
    }
    return res
      .status(200)
      .json({ message: "Retrived Successfully", data: check });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};


// const adminphoneVerification = async (req, res) => {
//     const { phone,password } = req.body;

//     try {
//         if (!phone) {
//             return res.status(400).json({ message: 'Phone number is required' });
//           }
//         ///existing check
//         const checkExistence= await adminSchemaData.findOne({phone:phone});

//         if(!checkExistence){
//             return res.status(200).json({message:"User Not Exist, Please signup"})
//         }

//         return res.status(200).json({message:"Login Successfully",data:checkExistence})

//     //   // Generate a 6-digit random OTP
//     //   const generateOtp = () => Math.floor(100000 + Math.random() * 900000); // Ensures a 6-digit number
//     //   const otp = generateOtp();

//     //   // Sequence value for customerId
//     //   const counter = await Counter.findOneAndUpdate(
//     //     { id: "customerId" }, // Identifier for the counter
//     //     { $inc: { seq: 1 } }, // Increment the sequence
//     //     { new: true, upsert: true } // Create the counter if it doesn't exist
//     //   );

//     //   // Format the customerId as "Cust-001", "Cust-002", etc.
//     //   const customerId = `Cust-${String(counter.seq).padStart(3, "0")}`;

//     //   let user = await customerauthSchemaData.findOne({ phone });

//     //   if (!user) {
//     //     // If the user doesn't exist, create a new one
//     //     user = new customerauthSchemaData({
//     //       phone,
//     //       customerId,
//     //       otp, // Save the OTP in the database for verification
//     //       isPhoneVerified: false // Initially set to false
//     //     });
//     //     await user.save();

//     //     return res.status(200).json({
//     //       message: 'OTP sent successfully. Please verify your phone number.',
//     //       otp, // Send the OTP in the response (you might send it via SMS in production)
//     //       userId: user._id
//     //     });
//     //   } else {
//     //     // If user exists, handle different cases
//     //     if (user.isPhoneVerified && user.isActive === true) {
//     //       return res.status(200).json({
//     //         message: 'User logged in successfully',
//     //         userId: user._id
//     //       });
//     //     } else {
//     //       // Update OTP if the phone is not verified
//     //       user.otp = otp; // Generate a new OTP
//     //       user.isPhoneVerified = false; // Reset verification status
//     //       await user.save();

//     //       return res.status(200).json({
//     //         message: 'OTP sent successfully. Please verify your phone number.',
//     //         otp, // Send the OTP in the response (you might send it via SMS in production)
//     //         userId: user._id
//     //       });
//     //     }
//     //   }
//     } catch (error) {
//       res.status(500).json({
//         message: 'Error processing request',
//         error
//       });
//     }
//   };

// const adminSignup = async (req, res) => {
//     try {
//         const { email, name, password } = req.body;

//         // Checking user existence
//         const existingAdmin = await adminSchemaData.findOne({ email: email });
//         if (existingAdmin) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         // Hashing password using bcrypt
//         const hashedPassword = await bcrypt.hash(password, 10); // Await the hashing process

//         // Creating a new admin
//         const savingAdmin = new adminSchemaData({
//             email: email,
//             name: name,
//             password: hashedPassword,
//         });

//         // Saving the new admin to the database
//         const sendingData=await savingAdmin.save();

//         return res.status(200).json({ message: "Created successfully" ,data:sendingData});
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: error.message });
//     }
// };

// const verifyOtp = async (req, res) => {
//     const { phone, otp } = req.body;

//     if (!phone || !otp) {
//       return res.status(400).json({ message: 'Phone number and OTP are required' });
//     }

//     try {
//       // Find the user by phone number
//       const user = await customerauthSchemaData.findOne({ phone });

//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       // Check if the provided OTP matches and is still valid
//       if (user.otp === otp) {
//         // Optionally, you can check if the OTP has expired using a timestamp field

//         // Update user's phone verification status
//         user.isPhoneVerified = true;
//         user.otp = null; // Clear the OTP after successful verification
//         await user.save();

//         return res.status(200).json({
//           message: 'Phone number verified successfully',
//           userId: user._id
//         });
//       } else {
//         return res.status(400).json({ message: 'Invalid or expired OTP' });
//       }
//     } catch (error) {
//       return res.status(500).json({
//         message: 'Error verifying OTP',
//         error
//       });
//     }
//   };

//admin login
//this is for admin login only

// const adminLogin = async (req, res) => {
//     try {
//         const { phone, password } = req.body;

//         // Check if the user exists
//         const userExistence = await adminSchemaData.findOne({ phone: phone });
//         if (userExistence) {
//             // Compare passwords
//             const comparePassword = await bcrypt.compare(password, userExistence.password);
//             if (!comparePassword) {
//                 return res.status(401).json({ message: "Invalid password" });
//             }

//             // Login successful
//             return res.status(200).json({
//                 message: "User login successful",
//                 data: { id: userExistence._id, phone: userExistence.phone },
//             });
//         }

//         // If user does not exist, create a new user
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new adminSchemaData({
//             phone: phone,
//             password: hashedPassword,
//         });

//         const creatingUser = await newUser.save();
//         if (!creatingUser) {
//             return res.status(500).json({ message: "User creation failed" });
//         }

//         // User created successfully
//         return res.status(201).json({
//             message: "User created successfully",
//             data:creatingUser ,
//         });
//     } catch (error) {
//         console.error("Error in adminLogin:", error.message);
//         return res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
// };

module.exports = {
  adminphoneVerification,
  signup,
  adminDetails,
  updatePassword,
  profileView
};
