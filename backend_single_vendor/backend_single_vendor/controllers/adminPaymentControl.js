const paymentCheck=require('../models/productOrder');

//////////////////////admin to view paymnet info of customers//////////////////////////////////////

///list view of payments in payment module

const paymentList = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const search = req.query.search || "";
      const fromDate = req.query.fromDate;
      const toDate = req.query.toDate;
  
      const matchStage = {};
  
      if (search) {
        matchStage.$or = [
          { customerName: { $regex: search, $options: "i" } },
          { orderId: { $regex: search, $options: "i" } },
          { transactionId: { $regex: search, $options: "i" } }
        ];
      }
  
      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999); // include end of day
        matchStage.createdAt = { $gte: from, $lte: to };
      } else if (fromDate) {
        const from = new Date(fromDate);
        from.setHours(0, 0, 0, 0);
        const to = new Date(fromDate);
        to.setHours(23, 59, 59, 999);
        matchStage.createdAt = { $gte: from, $lte: to };
      }
  
      const pipeline = [
        { $match: matchStage },
        {
          $lookup: {
            from: "customerinfos",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            orderId: 1,
            transactionId: 1,
            paidAmount: 1,
            totalAmount:1,
            remainingAmount:1,
            paymentStatus: 1,
            status: 1,
            createdAt: 1,
            paymentMode: 1,
            customerName: "$user.personalInfo.name",
            customerId:"$user.customerId",
            customerContact:"$user.phone"
          }
        },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            data: [{ $skip: skip }, { $limit: limit }],
            totalCount: [{ $count: "count" }]
          }
        }
      ];
  
      const result = await paymentCheck.aggregate(pipeline);
      const payment = result[0]?.data || [];
      const totalCount = result[0]?.totalCount[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);
  
      return res.status(200).json({
        message: payment.length ? "Payments retrieved successfully" : "No data found",
        status: true,
        data: {
          payment,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: totalCount,
            perPage: limit
          }
        }
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong", status: false });
    }
  };
  
//// search bar
const paymentSearching=async(req,res)=>{
  try {
      const { search, fromDate, toDate } = req.query;

      // Build query object
      const query = {};
      ///searching options
      if (search) {
          query.$or = [
              { customerId: { $regex: search, $options: 'i' } },
              { customerName: { $regex: search, $options: 'i' } }
          ];
      }
      ///date wise search 
      if (fromDate || toDate) {
          query.createdAt = {};
          if (fromDate) query.createdAt.$gte = new Date(fromDate);
          if (toDate) query.createdAt.$lte = new Date(toDate);
      }
      ///returning data 
      const paymentData = await NewProductData.find(query).sort({ createdAt: -1 });
      return res.status(200).json({message:"Data retrieve successfully",data:paymentData});
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error:error.message});
  }
};


module.exports={
    paymentList,paymentSearching
}