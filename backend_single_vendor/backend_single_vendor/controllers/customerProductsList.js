const productModel=require('../models/newproductaddModel');///product model to show list of products 
const cityModel=require('../models/city'); ///city model 
const mongoose=require('mongoose')
/////////////////4 api for showing list of products on landing page on website///////////////////////////

///birthday decoration category api 
const birthdayitemList = async (req, res) => {
    try {
        const { city } = req.params; // Extract city from request parameters

        // Validate if city is provided
        if (!city) {
            return res.status(400).json({ message: "City parameter is required", status: 400 });
        }

        const pipeline = [
            {
                $match: {
                    "productDetails.productcategory": "BIRTHDAY",
                    availableCities: { $regex: new RegExp(`\\b${city}\\b`, 'i') } 
                }
            },
            {
                $sort: { updatedAt: -1  } 
            },
            {
                $limit: 8 
            }
        ];

        // Execute the pipeline
        const result = await productModel.aggregate(pipeline);

        // Check if result is empty
        if (!result || result.length === 0) {
            return res.status(404).json({ message: "No Data Found", status: 404 });
        }

        // Return the fetched data
        return res.status(200).json({
            message: "Birthday Decoration Products Retrieved",
            data: result,
            status: 200
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
            status: 500,
            error: error.message
        });
    }
};

///anniversary decoration products api

const anniversaryitemList=async(req,res)=>{
    try {
        const { city } = req.params; 

        // Validate if city is provided
        if (!city) {
            return res.status(400).json({ message: "City parameter is required", status: 400 });
        }

        const pipeline=[{
            $match:{
                "productDetails.productcategory":"ANNIVERSARY",
                availableCities: { $regex: new RegExp(`\\b${city}\\b`, 'i') }
            }
        },
        {
            $sort:{updatedAt: -1 }
        },
        {
            $limit:8
        }
    ]
    ///execute the pipeline
    const result= await productModel.aggregate(pipeline);
    //check
    if(!result){
        return res.status(404).json({message:"No Data Found",status:404})
    }
    ///returning data
    return res.status(200).json({message:"Anniversary Decoration Products Retrived",data:result,status:200})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something went wrong",status:500,error:error.message})
    }
}
////kids decoartion item  list
const kidsitemList=async(req,res)=>{
    try {
        const { city } = req.params; 

        // Validate if city is provided
        if (!city) {
            return res.status(400).json({ message: "City parameter is required", status: 400 });
        }

        const pipeline=[{
            $match:{
                "productDetails.productcategory":"KID'S PARTY",
                availableCities: { $regex: new RegExp(`\\b${city}\\b`, 'i') }
            }
        },
        {
            $sort:{updatedAt: -1 }
        },
        {
            $limit:8
        }
    ]
    ///execute the pipeline
    const result= await productModel.aggregate(pipeline);
    //check
    if(!result){
        return res.status(404).json({message:"No Data Found",status:404})
    }
    ///returning data
    return res.status(200).json({message:"Kids Decoration Products Retrived",data:result,status:200})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something went wrong",status:500,error:error.message})
    }
}
/////ballons decoration item list
const ballonsitemList=async(req,res)=>{
    try {
        const { city } = req.params; 

        // Validate if city is provided
        if (!city) {
            return res.status(400).json({ message: "City parameter is required", status: 400 });
        }

        const pipeline=[{
            $match:{
                "productDetails.productcategory":"BABY SHOWER",
                // "productDetails.productsubcategory":"Wedding Entry Ballons",
                availableCities: { $regex: new RegExp(`\\b${city}\\b`, 'i') }
            }
        },
        {
            $sort:{updatedAt: -1 }
        },
        {
            $limit:8
        }
    ]
    ///execute the pipeline
    const result= await productModel.aggregate(pipeline);
    //check
    if(!result){
        return res.status(404).json({message:"No Data Found",status:404})
    }
    ///returning data
    return res.status(200).json({message:"Wedding Entry Products Retrived",data:result,status:200})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something went wrong",status:500,error:error.message})
    }
}

///product detailed view
///in this customer will see the detailed view of the product 

const detailedproductView = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await productModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id)
        }
      },
      // Lookup to fetch customization data using customproductId array
      {
        $lookup: {
          from: "customproductsinfos", // actual collection name (auto-pluralized)
          let: { customizeList: "$productcustomizeDetails" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: [
                    "$_id",
                    {
                      $map: {
                        input: "$$customizeList",
                        as: "item",
                        in: {
                          $cond: [
                            { $eq: [{ $type: "$$item.customproductId" }, "string"] },
                            { $toObjectId: "$$item.customproductId" },
                            "$$item.customproductId"
                          ]
                        }
                      }
                    }
                  ]
                }
              }
            }
          ],
          as: "customDetails"
        }
      },
      // Merge matched customization info directly into productcustomizeDetails
      {
        $addFields: {
          productcustomizeDetails: {
            $map: {
              input: "$productcustomizeDetails",
              as: "item",
              in: {
                $mergeObjects: [
                  "$$item",
                  {
                    $let: {
                      vars: {
                        matched: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$customDetails",
                                as: "custom",
                                cond: {
                                  $eq: [
                                    { $toString: "$$custom._id" },
                                    { $toString: "$$item.customproductId" }
                                  ]
                                }
                              }
                            },
                            0
                          ]
                        }
                      },
                      in: {
                        name: "$$matched.name",
                        price: "$$matched.price",
                        customimages: "$$matched.customimage",
                        description: "$$matched.description",
                        quantity: 1
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      
      {
        $project: {
          productid: 1,
          productDetails: 1,
          priceDetails: 1,
          productdescription: 1,
          productimages: 1,
          productcustomizeDetails: 1,
          availableCities: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    // Check if product found
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Product not found", status: 404 });
    }

    const productData = result[0];

    // Fetch similar products from same category
    const similarProducts = await productModel.aggregate([
      {
        $match: {
          "productDetails.productcategory": productData.productDetails.productcategory,
          _id: { $ne: new mongoose.Types.ObjectId(id) }
        }
      },
      {
        $project: {
          productid: 1,
          productDetails: 1,
          priceDetails: 1,
          productimages: 1
        }
      },
      { $sample: { size: 8 } }
    ]);

    return res.status(200).json({
      message: "Data Retrieved Successfully",
      data: {
        product: productData,
        similarProducts: similarProducts
      },
      status: 200
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
      status: 500,
      error: error.message
    });
  }
};

///////////////////////////////////////////location api ////////////////////////////////////////
const cityApi = async (req, res) => {
    try {
        const { search } = req.query;
        let cityList;

        if (search) {
            cityList = await cityModel.find({ cityName: { $regex: search, $options: "i" } }); // Case-insensitive search
        } else {
            cityList = await cityModel.find(); // Get all cities
        }

        if (!cityList || cityList.length === 0) {
            return res.status(404).json({ message: "No city found", status: 404 });
        }

        return res.status(200).json({ message: "City list retrieved", data: cityList, status: 200 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message, status: 500 });
    }
};

module.exports={birthdayitemList,anniversaryitemList,kidsitemList,ballonsitemList,detailedproductView,cityApi}