const productOrder=require('../models/productOrder');
const Counter=require('../models/counter');
const cartModel=require('../models/cartModel')
const mongoose=require('mongoose')
///////////////////////////////customer product Booking part////////////////////////////////
/// from this a customer can create a order,cancel their order and can view their previous orders

////from this customer can create their desired orders
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      itemQuantity,
      placedon,
      slot,
      productAmount,
      totalAmount,
      paidAmount,
      remainingAmount,
      productId,
      prodimages,
      deliveryAddress,
      aboutX,
      occasion,
      altContact,
      messageBoard,
      productDescription,
      ballonsName = [],
      customerage,
      ageColour,
      productName,
      customerName,
      productcustomizeDetails = [],
      custom_Name
    } = req.body;
    console.log(req.body)
    const { orderId } = req.params;

    // Validate balloons format
    if (!Array.isArray(ballonsName) || !ballonsName.every(b => b.name && typeof b.id === 'number')) {
      return res.status(400).json({ message: "Invalid ballonsName format. Expected array of { name, id }" });
    }

    // Check for existing Razorpay order
    const existingOrder = await productOrder.findOne({ orderId });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found with provided Razorpay orderId" });
    }

    // Generate bookingId only if not already set
    let bookingId = existingOrder.bookingId;
    if (!bookingId) {
      const counter = await Counter.findOneAndUpdate(
        { id: "bookingId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      bookingId = `book-${String(counter.seq).padStart(3, "0")}`;
    }

    // Map customization details
    const customizationPart = productcustomizeDetails.map(details => ({
      name: details.name,
      price: details.price,
      customimages: details.customimages,
      quantity:details.qty
    }));

    // Update the existing order
    existingOrder.set({
      bookingId,
      userId,
      itemQuantity,
      placedon,
      slot,
      productAmount,
      totalAmount,
      paidAmount,
      remainingAmount,
      productId,
      prodimages,
      deliveryAddress,
      aboutX,
      occasion,
      altContact,
      messageBoard,
      productDescription,
      ballonsName,
      customerage,
      ageColour,
      productName,
      customerName,
      productcustomizeDetails: customizationPart,
      custom_Name
    });

    const updatedOrder = await existingOrder.save();

    // Update cart status
    await cartModel.updateMany(
      { userId, productId, isCheckedOut: false },
      { $set: { isCheckedOut: true } }
    );

    return res.status(200).json({
      message: "Order updated successfully",
      data: updatedOrder,
      status: 200,
    });

  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

///cod order api 
const createCODOrder = async (req, res) => {
  try {
    const {
      userId,
      itemQuantity,
      placedon,
      slot,
      productAmount,
      totalAmount,
      paidAmount,
      remainingAmount,
      productId,
      prodimages,
      deliveryAddress,
      aboutX,
      occasion,
      altContact,
      messageBoard,
      productDescription,
      ballonsName = [],
      customerage,
      ageColour,
      productName,
      customerName,
      productcustomizeDetails = [],
      custom_Name
    } = req.body;

    // Validate balloons format
    if (!Array.isArray(ballonsName) || !ballonsName.every(b => b.name && typeof b.id === 'number')) {
      return res.status(400).json({ message: "Invalid ballonsName format. Expected array of { name, id }" });
    }

    // Generate bookingId
    const counter = await Counter.findOneAndUpdate(
      { id: "orderId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const orderId = `order_${String(counter.seq).padStart(3, "0")}`;

    // Map customization details
    const customizationPart = productcustomizeDetails.map(details => ({
      name: details.name,
      price: details.price,
      customimages: details.customimages,
      quantity: details.qty
    }));

    // Create new COD order
    const newOrder = await productOrder.create({
      orderId,
      userId,
      itemQuantity,
      placedon,
      slot,
      productAmount,
      totalAmount,
      paidAmount,
      remainingAmount,
      productId,
      prodimages,
      deliveryAddress,
      aboutX,
      occasion,
      altContact,
      messageBoard,
      productDescription,
      ballonsName,
      customerage,
      ageColour,
      productName,
      customerName,
      productcustomizeDetails: customizationPart,
      paymentMode: "COD",
      paymentStatus: "Cash", 
      custom_Name
    });

    // Update cart status
    await cartModel.updateMany(
      { userId, productId, isCheckedOut: false },
      { $set: { isCheckedOut: true } }
    );

    return res.status(201).json({
      message: "COD Order created successfully",
      data: newOrder,
      status: 201,
    });
  } catch (error) {
    console.error("Error creating COD order:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

/////////previous order placed by customer 
///in this i am going to show previous placed orders by customer whether they are completed or cancelled

const previousOrder = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', startDate, endDate } = req.query;
    const {userId} = req.params;

    const skip = (page - 1) * limit;

    let matchQuery = {
      userId: new mongoose.Types.ObjectId(userId),
      isActive: true,
      status: { $in: ["completed", "cancelled"] }
    };

    if (search) {
      matchQuery.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
        { paymentStatus: { $regex: search, $options: 'i' } }
      ];
    }

    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const ordersData = await productOrder.aggregate([
      { $match: matchQuery },
      { $sort: { updatedAt: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'customerinfos',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $addFields: {
          phone: { $arrayElemAt: ['$userDetails.phone', 0] }
        }
      },
      {
        $project: {
          userDetails: 0 // exclude full user info object
        }
      }
    ]);

    const totalOrders = await productOrder.countDocuments(matchQuery);
    const totalPages = Math.ceil(totalOrders / limit);

    return res.status(200).json({
      message: 'Retrieve done',
      data: ordersData,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

////to show the upcoming booking on website
///from this i am going to retrieve the data for the confirmed bookings

const upcomingBooking=async(req,res)=>{
  try {
    const {userId}=req.params;

    const upcomingData= await productOrder.find({
      userId:userId,
      status: { $in: ["confirmed","in-transit"] },
      paymentStatus:{ $in: ["Paid","Pending"] }
    })
    .sort({updatedAt:-1});
    ///check if no data
    if(!upcomingData){
      return res.status(404).json({message:"No upcoming Bookings found",status:404});
    }

    ////returning data
    return res.status(200).json({message:"data retrieve successfully",status:200,data:upcomingData})

    
  } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error",status:500,error:error.message});
  }
}

//////booking cancel
///from this a customer can cancel their order 

const cancelBooking = async (req, res) => {
  try {
    const { id, reason,status } = req.body; 

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID", status: 400 });
    }

    // Find the order
    const existingOrder = await productOrderSchemaData.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found", status: 404 });
    }

    // Check if order is already cancelled
    if (existingOrder.status === "cancelled") {
      return res.status(400).json({ message: "Order is already cancelled", status: 400 });
    }

    // Prepare update object
    const updateData = {
      status: status,
      cancellationDetails: {
        reason: reason || "No reason provided",
      },
    };

    // Update order status
    const cancelData = await productOrderSchemaData.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    // If update fails
    if (!cancelData) {
      return res.status(400).json({ message: "Failed to update order", status: 400 });
    }

    // Return success response
    return res.status(200).json({
      message: "Order cancelled successfully",
      data: cancelData,
      status: 200,
    });

  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: 500,
      error: error.message,
    });
  }
};



module.exports={createOrder,previousOrder,upcomingBooking,cancelBooking,createCODOrder}