require('dotenv').config()
const Razorpay = require("razorpay");
const crypto = require("crypto");
const productOrder = require("../models/productOrder"); 
const customerModel=require('../models/customerauthModel')
// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.keyId,
  key_secret: process.env.keySecret
});

// Create Razorpay Order
const createPaymentOrder = async (req, res) => {
  try {
    const { userId, totalAmount } = req.body;

    // Validate inputs
    if (!userId || !totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid userId or totalAmount" });
    }

    // Check if user exists
    const userExists = await customerModel.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Create Razorpay Order
    const options = {
      amount: totalAmount * 100, // Convert to paisa
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save Order in DB
    const newOrder = new productOrder({
      userId,
      totalAmount,
      paidAmount: totalAmount,
      remainingAmount: 0,
      orderId: razorpayOrder.id,
      paymentMode: "Razorpay",
      paymentStatus: "Pending", 
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      message: "Razorpay order created",
      orderId: razorpayOrder.id,
      amount: totalAmount,
      currency: "INR",
    });

  } catch (error) {
    console.error("Error creating payment order:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// const createPaymentOrder = async (req, res) => {
//     try {
//       const { totalAmount } = req.body;
  
//       // Validate totalAmount
//       if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
//         return res.status(400).json({ message: "Invalid totalAmount" });
//       }
  
//       // Determine payment split
//       // let paidAmount = partialPayment ? Math.round(totalAmount * 0.4) : totalAmount;
//       // let remainingAmount = totalAmount - paidAmount;
//       // let paymentStatus = partialPayment ? "Processing" : "Pending";
  
//       // Check if user exists
//       const userExists = await customerModel.findById(userId);
//       if (!userExists) {
//         return res.status(404).json({ message: "User Not Found" });
//       }
  
//       // Create Razorpay Order
//       const options = {
//         amount: paidAmount * 100, // Convert to paisa
//         currency: "INR",
//         receipt: `order_rcptid_${Date.now()}`,
//       };
  
//       const razorpayOrder = await razorpay.orders.create(options);
  
//       // Save Order in DB
//       const newOrder = new productOrder({
//         userId,
//         totalAmount,
//         paidAmount,
//         remainingAmount,
//         orderId: razorpayOrder.id, 
//         paymentMode: paymentMode || "Razorpay",
//         paymentStatus,
//       });
  
//       await newOrder.save();
  
//       res.status(200).json({
//         success: true,
//         message: "Order Created",
//         orderId: razorpayOrder.id,
//         amount: paidAmount,
//         remainingAmount,
//         currency: "INR",
//       });
  
//     } catch (error) {
//       console.error("Error creating payment order:", error);
//       res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//     }
//   };
///////////////////////////////////////payment verification api from webhook///////////////////////////
const handleWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Signature mismatch");
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    console.log("🔵 Webhook Event Received:", event);
    console.log("🟠 Full Payload:", JSON.stringify(payload, null, 2));

    if (event === "payment.captured") {
      const paymentId = payload.payment.entity.id;
      const razorpayOrderId = payload.payment.entity.order_id;
      const amount = payload.payment.entity.amount / 100; // Convert from paisa to rupees
      const method = payload.payment.entity.method;

      console.log(`✅ Payment Captured: paymentId=${paymentId}, orderId=${razorpayOrderId}, amount=${amount}, method=${method}`);

      const order = await productOrder.findOne({ orderId: razorpayOrderId });

      if (order) {
        console.log("✅ Matching order found in database:", order._id);
        order.paymentStatus = "Paid";
        order.paidAmount = amount;
        order.remainingAmount = 0;
        order.transactionId = paymentId; 
        order.paymentMode = method;
        await order.save();
        console.log("✅ Order updated successfully with Payment Captured data.");
      } else {
        console.warn("⚠️ No matching order found for Razorpay orderId:", razorpayOrderId);
      }

    } else if (event === "payment.failed") {
      const paymentId = payload.payment.entity.id;
      const razorpayOrderId = payload.payment.entity.order_id;
      const errorReason = payload.payment.entity.error_reason || "Unknown";

      console.log(`❌ Payment Failed: paymentId=${paymentId}, orderId=${razorpayOrderId}, reason=${errorReason}`);

      const order = await productOrder.findOne({ orderId: razorpayOrderId });

      if (order) {
        console.log("⚠️ Matching order found in database:", order._id);
        order.paymentStatus = "Failed";
        order.transactionId = paymentId; 
        await order.save();
        console.log("⚠️ Order updated with Payment Failed status.");
      } else {
        console.warn("⚠️ No matching order found for Razorpay orderId:", razorpayOrderId);
      }
    } else {
      console.warn("⚠️ Received unsupported event type:", event);
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("🔥 Webhook error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// const verifyPayment = async (req, res) => {
//   try {
//     const { orderId, paymentId, signature, paymentMode } = req.body;

//     // Validate request
//     if (!orderId || !paymentId || !signature) {
//       return res.status(400).json({ message: "Invalid payment details" });
//     }

//     // Fetch order from DB
//     const order = await productOrder.findOne({ orderId });
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Verify Razorpay signature
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.keySecret)
//       .update(orderId + "|" + paymentId)
//       .digest("hex");

//     if (generatedSignature !== signature) {
//       return res.status(400).json({ message: "Invalid payment signature" });
//     }

//     // Update order with payment success
//     order.paymentStatus = "Paid";
//     order.paidAmount = order.totalAmount;
//     order.remainingAmount = 0;
//     order.transactionId = paymentId;
//     order.paymentSignature = signature;
//     order.paymentMode = paymentMode || "Razorpay";

//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Payment verified successfully",
//       paidAmount: order.paidAmount,
//       remainingAmount: 0,
//     });

//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

// const verifyPayment = async (req, res) => {
//     try {
//       const { orderId, paymentId, signature, paymentMode } = req.body;
  
//       if (!orderId || !paymentId || !signature) {
//         return res.status(400).json({ message: "Invalid payment details" });
//       }
  
//       // Fetch order from DB
//       const order = await productOrder.findOne({ orderId });
//       if (!order) {
//         return res.status(404).json({ message: "Order not found" });
//       }
  
//       // Verify Payment Signature
//       const generatedSignature = crypto
//         .createHmac("sha256", process.env.keySecret)
//         .update(orderId + "|" + paymentId)
//         .digest("hex");
  
//       if (generatedSignature !== signature) {
//         return res.status(400).json({ message: "Invalid payment signature" });
//       }
  
//       // Update paidAmount if customer is paying remaining balance
//       let newPaidAmount = order.paidAmount + order.remainingAmount;
//       let newRemainingAmount = 0;
//       let newPaymentStatus = "Paid";
  
//       if (order.remainingAmount > 0) {
//         newPaidAmount = order.paidAmount + order.remainingAmount;
//         newRemainingAmount = 0; // No remaining balance
//         newPaymentStatus = "Paid";
//       }
  
//       // Update order with payment success
//       order.paymentStatus = newPaymentStatus;
//       order.paidAmount = newPaidAmount;
//       order.remainingAmount = newRemainingAmount;
//       order.transactionId = paymentId;
//       order.paymentSignature = signature;
//       order.paymentMode = paymentMode || "Razorpay";
  
//       await order.save();
  
//       res.status(200).json({ success: true, message: "Payment verified", paidAmount: newPaidAmount, remainingAmount: newRemainingAmount });
  
//     } catch (error) {
//       console.error("Error verifying payment:", error);
//       res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
//     }
//   };
    
  

module.exports = { createPaymentOrder,handleWebhook };
