const customerModel=require('../models/customerauthModel');
const categoryModel=require('../models/adminCategoryModel');
const productOrderModel=require('../models/productOrder');
const productModel=require('../models/newproductaddModel')

///////////////////count for dashboard part////////////////
const dashboardData=async(req,res)=>{
    try {
        const totalUsers = await customerModel.countDocuments();
        const totalCategories = await categoryModel.countDocuments();
        const totalListedProducts = await productModel.countDocuments();
        const totalOrders = await productOrderModel.countDocuments();
        const totalConfirmedBookings = await productOrderModel.countDocuments({ substatus: "confirmed" });
        const totalCancelledBookings = await productOrderModel.countDocuments({ status: "cancelled" });
        const totalCompletedBookings = await productOrderModel.countDocuments({ status: "completed" });
        
        //  best-selling product count
        let bestSellingProducts = await productOrderModel.aggregate([
            { $group: { _id: "$productId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]);
        const bestSellingProductCount = bestSellingProducts.length > 0 ? bestSellingProducts.length : 0;
        
        res.status(200).json({
            message: "Overall Statistics",
            data: {
                totalUsers,
                totalCategories,
                totalListedProducts,
                totalOrders,
                totalConfirmedBookings,
                totalCancelledBookings,
                totalCompletedBookings,
                bestSellingProducts: bestSellingProductCount
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics', error: error.message });
    }
}

module.exports={dashboardData}