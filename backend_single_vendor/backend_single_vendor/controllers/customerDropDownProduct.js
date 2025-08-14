const productModel= require('../models/newproductaddModel');
const subcatModel=require('../models/adminSubCategoryModel');
const categoryModel=require('../models/adminCategoryModel');
const moment = require('moment-timezone');
///////////////////////////////product listing category and sub-category wise/////////////////////////
const productListing = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      city,
      productName,
      minPrice,
      maxPrice,
      discount,
      sameDay
    } = req.body;

    const matchStage = {};

    // Category filter
    if (category) {
      matchStage["productDetails.productcategory"] = category;
    }

    // Subcategory filter
    if (subcategory) {
      matchStage["productDetails.productsubcategory"] = subcategory;
    }

    // City filter (case-insensitive)
    if (city) {
      matchStage["availableCities"] = { $regex: new RegExp(city, 'i') };
    }

    // Product name exact match (case-insensitive)
    if (productName) {
      matchStage["productDetails.productname"] = { $regex: new RegExp(`^${productName}$`, 'i') };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      matchStage["priceDetails.price"] = {};
      if (minPrice) matchStage["priceDetails.price"].$gte = parseFloat(minPrice);
      if (maxPrice) matchStage["priceDetails.price"].$lte = parseFloat(maxPrice);
    }

    // Discounted products filter
    if (discount === true) {
      matchStage["priceDetails.discountedPrice"] = { $exists: true, $gt: 0 };
    }

    console.log("🔍 Match Stage:", JSON.stringify(matchStage, null, 2));

    // Aggregation pipeline
    const pipeline = [
      { $match: matchStage },
      { $sort: { createdAt: -1 } }
    ];

    let products = await productModel.aggregate(pipeline);
    console.log("🧩 Products after match:", products.length);

    // Same day logic
    if (sameDay === true) {
      const now = moment().tz("Asia/Kolkata");
      const todayStart = moment.tz(now.format('YYYY-MM-DD') + ' 07:00', "Asia/Kolkata");
      const todayEnd = moment.tz(now.format('YYYY-MM-DD') + ' 22:00', "Asia/Kolkata");

      // Only filter if within time window
      if (now.isBetween(todayStart, todayEnd)) {
        products = products.filter(p => {
          const estimateHours = p?.productDetails?.estimatedecorativetime || 0;
          const estimatedCompletion = now.clone().add(estimateHours, 'hours');
          return estimatedCompletion.isSameOrBefore(todayEnd);
        });
      } else {
        products = [];
      }
    }

    console.log("📦 Products after sameDay filter:", products.length);

    // Handle no products case
    if (!products.length) {
      return res.status(404).json({ message: "No Data Found", status: 404 });
    }

    // Price range for filters
    const prices = products.map(p => p.priceDetails?.price || 0);
    const minFetchedPrice = Math.min(...prices);
    const maxFetchedPrice = Math.max(...prices);

    // Subcategory list for UI
    const categoryList = await categoryModel.findOne({ categoryName: category });
    const subcat = categoryList ? await subcatModel.find({ catId: categoryList._id }) : [];

    return res.status(200).json({
      message: "Data Retrieved Successfully",
      data: products,
      subcategory: subcat,
      minPrice: minFetchedPrice,
      maxPrice: maxFetchedPrice,
      status: 200
    });

  } catch (error) {
    console.error("❌ Error in productListing:", error);
    return res.status(500).json({ message: "Internal Server Error", status: 500 });
  }
};

// const productListing = async (req, res) => {
//     try {
//         // const page = parseInt(req.query.page) || 1;
//         // const limit = parseInt(req.query.limit) || 10;
//         // const skip = (page - 1) * limit;
//         const { category, subcategory, city, productName, minPrice, maxPrice, discount } = req.body;
       
//         const matchStage = {};
        
//         if (category) {
//             matchStage["productDetails.productcategory"] = category;
//         }
//         if (subcategory) {
//             matchStage["productDetails.productsubcategory"] = subcategory;
//         }
//         if (city) {
//             matchStage["availableCities"] = { $regex: new RegExp(city, 'i') };
//         }
//         if (productName) {
//             matchStage["productDetails.productname"] = { $regex: new RegExp(`^${productName}$`, 'i') }; 
//         }
//         if (minPrice || maxPrice) {
//             matchStage["priceDetails.price"] = {};
//             if (minPrice) matchStage["priceDetails.price"].$gte = parseFloat(minPrice);
//             if (maxPrice) matchStage["priceDetails.price"].$lte = parseFloat(maxPrice);
//         }
//         if(discount===true){
//             matchStage['priceDetails.discountedPrice']=discountedPrice
//         }
//         const pipeline = [
//             { $match: matchStage },
//             { $sort: { createdAt: -1 } },
//             // { $sort: { updatedAt: -1 } },
//             // { $skip: skip },
//             // { $limit: limit }
//         ];

//         ////executing pipeline
//         const products = await productModel.aggregate(pipeline);
//         // const totalProducts = await productModel.countDocuments(matchStage);
        
//         ///minimum and maximum price return 
//         const prices = products.map(p => p.priceDetails.price);
//         const minFetchedPrice = Math.min(...prices);
//         const maxFetchedPrice = Math.max(...prices);

//         ///category and subcategory listing 
//         const categoryList = await categoryModel.findOne({ categoryName: category });
//         ///subcat check
//         const subcat = categoryList ? await subcatModel.find({ catId: categoryList._id }) : [];
        
//         ///failed check
//         if (!products.length) {
//             return res.status(404).json({ message: "No Data Found", status: 404 });
//         }
//         ///success 
//         return res.status(200).json({
//             message: "Data Retrieved Successfully",
//             data: products,
//             subcategory: subcat,
//             minPrice:minFetchedPrice,
//             maxPrice:maxFetchedPrice,
//             // totalProducts,
//             // currentPage: page,
//             // totalPages: Math.ceil(totalProducts / limit),
//             status: 200
//         });
        
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: "Internal Server Error", status: 500 });
//     }
// };

// const productListing=async(req,res)=>{
//     try {
//         const{category,subcategory,city,productName}=req.body;
       
//         const pipeline=[
//             {
//                 $match:{
//                     "productDetails.productcategory":category,
//                     "productDetails.productsubcategory":subcategory,
//                     availableCities: { $regex: new RegExp(`\\b${city}\\b`, 'i') },
//                     "productDetails.productname": { $regex: new RegExp(`\\b${productName}\\b`, 'i') }
//                 }
//             }
//         ];

//         ////executing pipeline
//         const result=await productModel.aggregate(pipeline);
        
//         ///categry and subcategroy listing 
//         const categoryList= await categoryModel.findOne({categoryName:category});
//         ///subcat check
//         const subcat= await subcatModel.find({catId:categoryList._id})
        
//         ///failed check
//         if(!result){
//             return res.status(404).json({message:"No Data Found"})
//         }
//         ///success 
//         return res.status(200).json({message:"Data Retreived Successfully",data:result,subcategory:subcat,status:200})
        
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({message:"Internal Server Error",status:500})
//     }
// }

module.exports={productListing}
