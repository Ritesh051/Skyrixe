const categoryModel=require('../models/adminCategoryModel');
//// deal banner model import
const dealbannerModel=require('../models/adminDealBanners');
///banner model import
const bannerModel= require('../models/adminBannerModel');

//////////////////////////apis for deal banner, banner and category list to show in website////////

////category list
///in this customer can see list of added categories on website

const categoryList=async(req,res)=>{
    try {
        const categoryData= await categoryModel.find({});
        ///check
        if(!categoryData){
            return res.status(404).json({message:"Failed to get data",status:404});
        }
        ///returning data
        return res.status(200).json({message:"Category List Retrived Successfully",data:categoryData,status:200})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something Went Wrong",error:error.message,status:500})
    }
};

////deal banner list
///in this customers can see deal banners on website

const dealbannerList=async(req,res)=>{
    try {
        const dealData= await dealbannerModel.find({});
        //check
        if(!dealData){
            return res.status(404).json({message:"Failed to get Data",status:404});
        }
        ///returning data
        return res.status(200).json({message:"Deal Banner Data Retrived successfully",data:dealData,status:200})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something Went Wrong",error:error.message,status:500})
    }
};

///banner list 
////in this customrs see banner images on landing page of wesite
const bannerList=async(req,res)=>{
    try {
        const bannerData= await bannerModel.find({});
        //check
        if(!bannerData){
            return res.status(404).json({message:"Failed to get data",status:404});
        }
        ///return data 
        return res.status(200).json({message:"Banneers Data Retrived Successfully",data:bannerData,status:200});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something Went Wrong",error:error.message,status:500})
    }
};

///list of category along with its sub-category 
//this list is for showing info in big-dropdown of navbar in website customer can see list of categories along with sub categpr

const catsubcatList = async (req, res) => {
    try {
        const pipeline = [
            {
                $lookup: {
                    from: "subcategoryinfos",
                    localField: "_id",
                    foreignField: "catId",
                    as: "data"
                }
            },
            {
                $unwind: "$data"
            },
            {
                $group: {
                    _id: {
                        _id: "$_id",
                        categoryName: "$categoryName"
                    },
                    subcategories: {
                        $push: "$data.subcategoryName"
                    }
                }
            },
            {
                $project: {
                    _id: "$_id._id",
                    categoryName: "$_id.categoryName",
                    subcategories: 1
                }
            }
        ];

        // Executing pipeline
        const result = await categoryModel.aggregate(pipeline);

        if (!result || result.length === 0) {
            return res.status(404).json({ message: "Failed to get data", data: result, status: 404 });
        }

        // Returning data
        return res.status(200).json({ 
            message: "List of categories and subcategories", 
            data: result, 
            status: 200 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
            status: 500
        });
    }
};

module.exports={categoryList,bannerList,dealbannerList,catsubcatList}