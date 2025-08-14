require("dotenv").config();
const axios = require("axios");

//send otp
const sendOtpViaMsg91 = async (phone) => {
  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp",
      {
        mobile: `91${phone}`,
        template_id: process.env.MSG91_templateId, 
      },
      {
        headers: {
          authkey: process.env.MSG91_AuthKey, 
          "Content-Type": "application/json",
        },
      }
    );

    console.log("MSG91 OTP Sent:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Send OTP Error:", error.response?.data || error.message);
    throw new Error("Failed to send OTP");
  }
};


// Verify OTP
const verifyOtpViaMsg91 = async (phone, otp) => {
  try {
    const response = await axios.get(
      `https://control.msg91.com/api/v5/otp/verify?mobile=91${phone}&otp=${otp}`,
      {
        headers: {
          authkey: process.env.MSG91_AuthKey,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Verify OTP Error:", error.response?.data || error.message);
    throw new Error("Invalid or expired OTP");
  }
};

///resend otp
const resendOtpViaMsg91 = async (phone, retryType = "text") => {
  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp/retry",
      {
        mobile: `91${phone}`,
        retrytype: retryType, 
        template_id: process.env.MSG91_templateId,
      },
      {
        headers: {
          authkey: process.env.MSG91_AuthKey,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("MSG91 Resend OTP:", response.data);
    return response.data;
  } catch (error) {
    console.error("Resend OTP Error:", error.response?.data || error.message);
    throw new Error("Failed to resend OTP");
  }
};

module.exports = { sendOtpViaMsg91, verifyOtpViaMsg91, resendOtpViaMsg91 };
