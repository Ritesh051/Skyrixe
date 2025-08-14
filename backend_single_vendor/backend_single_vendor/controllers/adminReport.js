const customerModel=require('../models/customerauthModel');
const productOrderModel=require('../models/productOrder');

///////////////////////////////total revenue report//////////////////////////////////////////////

const revenueReport = async (req, res) => {
    try {
      const revenueReport = await productOrderModel.aggregate([
        {
          $match: {
            paymentStatus: "Paid",
            isActive: true,
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$paidAmount" },
            totalOrders: { $sum: 1 },
          }
        }
      ]);
  
      const reportArray = revenueReport.length > 0 ? revenueReport : [{
        _id: null,
        totalRevenue: 0,
        totalOrders: 0
      }];
  
      return res.status(200).json({
        message: "Revenue report fetched successfully",
        data: reportArray
      });
    } catch (error) {
      console.error("Error generating revenue report:", error);
      return res.status(500).json({
        message: "Error generating revenue report",
        error: error.message
      });
    }
  };
    
////////////////////////////least selling products and top sellng products and total sales///////////
const topsellingReport = async (req, res) => {
    try {
      const topSellingProduct = await productOrderModel.aggregate([
        {
          $group: {
            _id: "$productId",
            totalSold: { $sum: "$itemQuantity" }, // Sum up the quantity ordered
            productName: { $first: "$productName" },
            productImage: { $first: "$prodimages" },
          },
        },
        { $sort: { totalSold: -1 } }, // Sort by highest sold
        
      ]);
  
      if (!topSellingProduct.length) {
        return res.status(200).json({ message: "No sales data available", data: [], status: true });
      }
  
      return res.status(200).json({
        message: "Top selling product retrieved successfully",
        data: topSellingProduct, // Return as array
        status: true,
      });
    } catch (error) {
      console.error("Error fetching top selling product:", error);
      return res.status(500).json({ message: "Something went wrong", error: error.message, status: false });
    }
  };
  
////least selling product 
const leastsellingReport = async (req, res) => {
    try {
        const leastSellingProduct = await productOrderModel.aggregate([
            {
                $group: {
                    _id: "$productId",
                    totalSold: { $sum: "$itemQuantity" },
                    productName: { $first: "$productName" },
                    productImage: { $first: "$prodimages" },
                },
            },
            { $sort: { totalSold: 1 } }, // Sort by lowest sold
           
        ]);

        return res.status(200).json({
            message: leastSellingProduct.length 
                ? "Least selling product retrieved successfully"
                : "No sales data available",
            data: leastSellingProduct,
            status: true,
        });
    } catch (error) {
        console.error("Error fetching least selling product:", error);
        return res.status(500).json({ 
            message: "Something went wrong", 
            error: error.message, 
            status: false 
        });
    }
};

///total sales report 
const totalsalesReport=async(req,res)=>{
    try {
        const orderSummary = await productOrderModel.aggregate([
            {
                $group: {
                    _id: "$status", 
                    totalOrders: { $sum: 1 }, 
                    totalItemsSold: { $sum: "$itemQuantity" }, 
                    totalRevenue: { $sum: "$totalAmount" } 
                }
            }
        ]);

        return res.status(200).json({
            message: "Order summary retrieved successfully",
            data: orderSummary,
            status: true
        });
    } catch (error) {
        console.error("Error fetching order summary:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message, status: false });
    }
}

//////////////////////////////customer report section///////////////////////////
const userReport = async (req, res) => {
  try {
    const stats = await customerModel.aggregate([
      {
        $facet: {
          totalUsers: [{ $count: "count" }],
          verifiedUsers: [
            { $match: { isPhoneVerified: true } },
            { $count: "count" }
          ],
          unverifiedUsers: [
            { $match: { isPhoneVerified: false } },
            { $count: "count" }
          ],
          activeUsers: [
            { $match: { isActive: true } },
            { $count: "count" }
          ],
          inactiveUsers: [
            { $match: { isActive: false } },
            { $count: "count" }
          ]
        }
      }
    ]);

    const result = stats[0];

    // Convert to array of objects
    const formattedReport = [
      { label: "Total Users", count: result.totalUsers[0]?.count || 0 },
      { label: "Verified Users", count: result.verifiedUsers[0]?.count || 0 },
      { label: "Unverified Users", count: result.unverifiedUsers[0]?.count || 0 },
      { label: "Active Users", count: result.activeUsers[0]?.count || 0 },
      { label: "Inactive Users", count: result.inactiveUsers[0]?.count || 0 },
    ];

    return res.status(200).json({
      message: "User Analytics Report Generated",
      data: formattedReport,
      status: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", status: false });
  }
};

module.exports={userReport,revenueReport,topsellingReport,leastsellingReport,totalsalesReport}