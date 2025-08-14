const productOrderModel=require('../models/productOrder');
const customerModel=require('../models/customerauthModel')

/////admin to view booked-products list
///in this admin can see the confirmed booking orders and in trasit orders completed orders cancelled orders
const viewcustomerOrders = async (req, res) => {
  try {
    const { status } = req.params;
    const { search, fromDate, toDate } = req.query;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const matchQuery = {};

    // Status filter
    if (status) {
      matchQuery.status = status;
    }

    // Date filter
    if (fromDate || toDate) {
      let from = fromDate ? new Date(fromDate) : null;
      let to = toDate ? new Date(toDate) : null;

      if (from && isNaN(from.getTime())) {
        return res.status(400).json({ message: "Invalid fromDate format", status: false });
      }
      if (to && isNaN(to.getTime())) {
        return res.status(400).json({ message: "Invalid toDate format", status: false });
      }

      matchQuery.updatedAt = {};
      if (from) matchQuery.updatedAt.$gte = new Date(from.setHours(0, 0, 0, 0));
      if (to) matchQuery.updatedAt.$lte = new Date(to.setHours(23, 59, 59, 999));
    }

    const pipeline = [
      // Stage 1: Match by status/date
      { $match: matchQuery },

      // Stage 2: Lookup customer details
      {
        $lookup: {
          from: 'customerinfos',
          localField: 'userId',
          foreignField: '_id',
          as: 'customerDetails'
        }
      },

      // Stage 3: Unwind customer details
      {
        $unwind: {
          path: '$customerDetails',
          preserveNullAndEmptyArrays: true
        }
      },

      // Stage 4: Search by customer name (AFTER unwind)
      ...(search ? [{
        $match: {
          'customerDetails.personalInfo.name': { $regex: search, $options: 'i' }
        }
      }] : []),

      // Stage 5: Project fields
      {
        $project: {
          bookingId: 1,
          orderId: 1,
          transactionId: 1,
          userId: 1,
          itemQuantity: 1,
          placedon: 1,
          slot: 1,
          productAmount: 1,
          totalAmount: 1,
          paidAmount: 1,
          remainingAmount: 1,
          paymentMode: 1,
          paymentStatus: 1,
          status: 1,
          isActive: 1,
          decoratorAddress: 1,
          productId: 1,
          productName: 1,
          productDescription: 1,
          prodimages: 1,
          productcustomizeDetails: 1,
          deliveryAddress: 1,
          cancellationDetails: 1,
          aboutX: 1,
          occasion: 1,
          altContact: 1,
          messageBoard: 1,
          customerRequirement: 1,
          ballonsName: 1,
          customerage: 1,
          decorationLocation: 1,
          customerName: 1,
          updatedAt: 1,
          createdAt: 1,
          customerContactNumber: '$customerDetails.phone',
          customerFullName: '$customerDetails.personalInfo.name'
        }
      },

      // Stage 6: Sort by createdAt descending
      { $sort: { createdAt: -1 } },

      // Stage 7: Pagination + count
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: 'count' }],
        }
      }
    ];

    const ordersData = await productOrderModel.aggregate(pipeline);

    const totalOrders = ordersData[0]?.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalOrders / limit);

    return res.status(200).json({
      message: 'Retrieve done',
      data: ordersData[0]?.data || [],
      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        limit,
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};



//////admin to update status of orders wether confirmed or in transit 
const updateSubStatus=async(req,res)=>{
    try {
        const{id}=req.params;
        const{status}=req.body;
        const updateObj={
            status:status
        }
        const updatingQuery= await productOrderModel.findByIdAndUpdate(
            id,
            {$set:updateObj},
            {new:true}
        );
        ///check if failed 
        if(!updatingQuery){
            return res.status(400).json({message:"failed to update"});
        }
        ///returning data 
        return res.status(200).json({message:"Updated Successfully",data:updatingQuery,status:200});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
}

///admin to update decorator partner details

const updateDecoratorDetails=async(req,res)=>{
    try {
        const {id}=req.params;
        const{name,contact,trackingId}=req.body;

        const updateData = {
            "decoratorAddress.name": name,
            "decoratorAddress.contact": contact,
            "decoratorAddress.trackingId": trackingId
        };
        const updatingData= await productOrderModel.findByIdAndUpdate(
            id,
            {$set:updateData},
            {new:true}
        );
        if(!updatingData){
            return res.status(200).json({message:"Failed to update"})
        }
        return res.status(200).json({message:"Updation Successfuly",data:updatingData})
        
    } catch (error) {
     console.log(error);
     return res.status(500).json({Message:"Something wrong",error:error.message})   
    }
};

////admin to cancelled customer order
const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params; // Order ID
        const { status, cancellationReason, cancellationComment } = req.body; // Inputs from request body

        if (status !== "cancelled") {
            return res.status(400).json({
                message: "Invalid status. To cancel an order, the status must be 'cancelled'.",
                status: false
            });
        }

        // Update the order with status and cancellation details
        const updateOrder = await productOrderModel.findByIdAndUpdate(
            id,
            {
                status: status,
                isActive: false,
                "cancellationDetails.reason": cancellationReason,
                "cancellationDetails.comment": cancellationComment
            },
            { new: true, runValidators: true } // Use `runValidators` to validate nested fields
        );

        if (!updateOrder) {
            return res.status(400).json({
                message: "Failed to update order. Order not found.",
                status: false
            });
        }

        return res.status(200).json({
            message: "Order cancelled successfully.",
            data: updateOrder,
            status: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong.",
            error: error.message,
            status: false
        });
    }
};
//view booking details on eye button click of completed booking
//in this admin can see the booking details of customer

const completedOrdersView = async (req, res) => {
    try {
      const { id } = req.params;
  
      // First: find the order
      const orderData = await productOrderModel.findById(id);
  
      if (!orderData) {
        return res.status(404).json({ message: "Order not found", data: null, status: false });
      }
  
      // Second: find the customer details
      const customerData = await customerModel.findById(orderData.userId);
  
      // Prepare response
      const responseData = {
        ...orderData.toObject(), 
        customerName: customerData?.personalInfo?.name || null,
        customerPhone: customerData?.phone || null,
      };
  
      return res.status(200).json({
        message: "Data retrieved Successfully",
        data: responseData,
        status: true,
      });
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong", error: error.message, status: false });
    }
  };  
///admin to see completed orders list
//in this admin will see only completed orderslist

// const completedOrders=async(req,res)=>{
//     try {
//         const{status}=req.params
//         const page = parseInt(req.query.page) || 1; 
//         const limit = parseInt(req.query.limit) || 10; 
//         const skip = (page - 1) * limit;

//         const pipeline=[
//             {
//                 $match:{
//                     status:status
//                 }
//             },
//             {
//                 $sort:{
//                     updatedAt:-1
//                 }
//             },
//             {
//                 $facet:{
//                     data: [
//                         { $skip: skip },
//                         { $limit: limit }
//                     ],
//                     totalCount: [
//                         { $count: "count" }
//                     ]

//                 }
//             }
            
        
//         ]

//         // Execute the aggregation
//         const result = await productOrderModel.aggregate(pipeline);

//         // Extract data and count
//         const completed = result[0]?.data || [];
//         const totalCount = result[0]?.totalCount[0]?.count || 0;
//         const totalPages = Math.ceil(totalCount / limit);

//         if (completed.length === 0) {
//             return res.status(200).json({
//                 message: "No data found",
//                 status: "success",
//                 data: {
//                     completed: [],
//                     pagination: {
//                         currentPage: page,
//                         totalPages: totalPages,
//                         totalItems: totalCount,
//                         perPage: limit
//                     }
//                 }
//             });
//         }

//         return res.status(200).json({
//             message: "Data retrieved successfully",
//             status: "success",
//             data: {
//                 completed: completed,
//                 pagination: {
//                     currentPage: page,
//                     totalPages: totalPages,
//                     totalItems: totalCount,
//                     perPage: limit
//                 }
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({Message:"Something wrong",error:error.message,status:false})
//     }
// }

///admin to see cancelled orders list
//in this admin will see only cancelled orderslist

// const cancelledOrders=async(req,res)=>{
//     try {
//         const page = parseInt(req.query.page) || 1; 
//         const limit = parseInt(req.query.limit) || 10; 
//         const skip = (page - 1) * limit;

//         const pipeline=[
//             {
//                 $match:{
//                     status:"cancelled"
//                 }
//             },
//             {
//                 $sort:{
//                     updatedAt:-1
//                 }
//             },
//             {
//                 $facet:{
//                     data: [
//                         { $skip: skip },
//                         { $limit: limit }
//                     ],
//                     totalCount: [
//                         { $count: "count" }
//                     ]

//                 }
//             }
            
        
//         ]

//         // Execute the aggregation
//         const result = await productOrderModel.aggregate(pipeline);

//         // Extract data and count
//         const cancelled = result[0]?.data || [];
//         const totalCount = result[0]?.totalCount[0]?.count || 0;
//         const totalPages = Math.ceil(totalCount / limit);

//         if (cancelled.length === 0) {
//             return res.status(200).json({
//                 message: "No data found",
//                 status: "success",
//                 data: {
//                     cancelled: [],
//                     pagination: {
//                         currentPage: page,
//                         totalPages: totalPages,
//                         totalItems: totalCount,
//                         perPage: limit
//                     }
//                 }
//             });
//         }

//         return res.status(200).json({
//             message: "Data retrieved successfully",
//             status: "success",
//             data: {
//                 cancelled: cancelled,
//                 pagination: {
//                     currentPage: page,
//                     totalPages: totalPages,
//                     totalItems: totalCount,
//                     perPage: limit
//                 }
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({Message:"Something wrong",error:error.message,status:false})
//     }
// }


///view order detail of cancelled orders
///in this admin can view a detail view of products buyed by customer

// const cancelledOrdersView=async(req,res)=>{
//     try {
//         const{id}=req.params;

//         const cancelData= await productOrderModel.findById(id)

//         if(!cancelData){
//             return res.status(200).json({message:"Failed to get Data"})
//         }

//         return res.status(200).json({message:"Data retreived Successfully",data:cancelData,status:true})
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({Message:"Something wrong",error:error.message,status:false})
//     }
// };

////booking page search bar 

// const bookingSearching=async(req,res)=>{
//     try {
//         const { search, fromDate, toDate } = req.query;

//         // Build query object
//         const query = {};
//         ///searching options
//         if (search) {
//             query.$or = [
//                 { customerId: { $regex: search, $options: 'i' } },
//                 { customerName: { $regex: search, $options: 'i' } }
//             ];
//         }
//         ///date wise search 
//         if (fromDate || toDate) {
//             query.createdAt = {};
//             if (fromDate) query.createdAt.$gte = new Date(fromDate);
//             if (toDate) query.createdAt.$lte = new Date(toDate);
//         }
//         ///returning data 
//         const bookingData = await NewProductData.find(query).sort({ createdAt: -1 });
//         return res.status(200).json({message:"Data retrieve successfully",data:bookingData});
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error:error.message});
//     }
// };

/////////////api for insertion of data
const newBooking=async (req, res) => {
    try {
        
        const {
            productInfo,
            bookingId,
            bookingTime,
            itemQuantity,
            amount,
            payment,
            decoratorPartner
        } = req.body;

        // Validate required fields
        if (!productInfo || !bookingId || !bookingTime || !itemQuantity || !amount || !payment) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Create a new booking entry
        const newBooking = new productOrderModel({
            productInfo,
            bookingId,
            bookingTime,
            itemQuantity,
            amount,
            payment,
            decoratorPartner
        });

        // Save the booking to the database
        const savedBooking = await newBooking.save();

        return res.status(201).json({
            message: "Booking created successfully.",
            data: savedBooking
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};


module.exports={viewcustomerOrders,updateDecoratorDetails,cancelOrder,newBooking,updateSubStatus,completedOrdersView
}