const NewProductData = require('../models/newproductaddModel'); 
const multerSetup= require('../middlewares/uploadData');
///categpory model
// const categorySchemaData=require('../models/adminCategoryModel')
// ///sub category model
// const subcategoryModel=require('../models/adminSubCategoryModel')
const Counter=require('../models/counter');


const upload = multerSetup(
    ["image/jpeg", "image/png"], // Allowed MIME types
    2 * 1024 * 1024 // Max file size (2MB)
  );

////////////////////////////new product add,update,view and delete///////////////////////////////////////

////////adding new product
const addnewProduct = async (req, res) => {
    try {
        // Generate a sequence value for productId
        const counter = await Counter.findOneAndUpdate(
            { id: "productid" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const productId = `product-${String(counter.seq).padStart(3, "0")}`;

        //  JSON fields from req.body
        const productDetails = JSON.parse(req.body.productDetails); 
        const priceDetails = JSON.parse(req.body.priceDetails); 
        const productDescription = JSON.parse(req.body.productdescription); 
        const productCustomizeDetails = JSON.parse(req.body.productcustomizeDetails); 
        const productImages = req.body.productimages; 

        //  custom images with customization details
        const customizedDetailsWithImages = productCustomizeDetails.map((custom) => ({
            name: custom.name,
            price: parseFloat(custom.price), 
            customimages: custom.customImages, 
            description: custom.description,
            customproductId:custom.customproductId
        }));

        //  product images 
        // Handle product images conditionally
        let prodImages = [];
        if (Array.isArray(productImages)) {
            prodImages = productImages.map((image) => image); 
        } else if (typeof productImages === "string") {
            prodImages = [productImages]; // Convert single image to an array
        }
        // Create a new product document
        const newProduct = new NewProductData({
            productid: productId,
            productDetails: {
                productcategory: productDetails.productcategory,
                productsubcategory: productDetails.productsubcategory,
                productname: productDetails.productname,
                producttitledescription: productDetails.producttitledescription,
                estimatedecorativetime: productDetails.estimatedecorativetime,
            },
            priceDetails: {
                price: parseFloat(priceDetails.price), 
                gstslab: priceDetails.gstslab,
                discountedPrice:priceDetails.discountedPrice
            },
            productdescription: {
                inclusion: productDescription.inclusion,
                aboutexperience: productDescription.aboutexperience,
                need: productDescription.need,
                cancellation: productDescription.cancellation,
            },
            productimages: prodImages,
            productcustomizeDetails: customizedDetailsWithImages,
            availableCities: req.body.availableCities || []
        });

        // Save the document to the database
        const savedProduct = await newProduct.save();

        if (!savedProduct) {
            return res.status(200).json({ message: "Failed to add", status: 200 });
        }

        // Product added successfully
        return res.status(201).json({ message: 'Product added successfully', data: savedProduct });
    } catch (error) {
        console.error('Error adding product:', error.message);
        return res.status(500).json({ error: error.message });
    }
};


// const addnewProduct = async (req, res) => {
//     try {
//         // Generate a sequence value for productId
//         const counter = await Counter.findOneAndUpdate(
//             { id: "productid" },
//             { $inc: { seq: 1 } },
//             { new: true, upsert: true }
//         );
//         const productId = `product-${String(counter.seq).padStart(3, "0")}`;

//         // Parse JSON fields safely from req.body
//         const productDetails = req.body.productDetails
//             ? JSON.parse(req.body.productDetails)
//             : {};
//         const priceDetails = req.body.priceDetails
//             ? JSON.parse(req.body.priceDetails)
//             : {};
//         const productdescription = req.body.productdescription
//             ? JSON.parse(req.body.productdescription)
//             : {};
//         const productcustomizeDetails = req.body.productcustomizeDetails
//             ? JSON.parse(req.body.productcustomizeDetails)
//             : [];
//         const productImages = req.body.productImages
//             ? JSON.parse(req.body.productImages)
//             : [];
//         const customImages = req.body.customImages
//             ? JSON.parse(req.body.customImages)
//             : [];

//         // Validate: Ensure each customization detail has exactly one image
//         if (productcustomizeDetails.length !== customImages.length) {
//             return res.status(400).json({
//                 message: "Mismatch between customization details and images.",
//                 status: 400,
//             });
//         }

//         const customizedDetailsWithImages = productcustomizeDetails.map((custom, index) => ({
//             name: custom.name,
//             price: custom.price,
//             customimages: customImages[index] // Only one image per customization
//         }));

//         // Create a new product document
//         const newProduct = new NewProductData({
//             productid: productId,
//             productDetails: {
//                 productcategory: productDetails.productcategory || "",
//                 productsubcategory: productDetails.productsubcategory || "",
//                 productname: productDetails.productname || "",
//                 producttitledescription: productDetails.producttitledescription || "",
//                 estimatedecorativetime: productDetails.estimatedecorativetime || "",
//             },
//             priceDetails: {
//                 price: priceDetails.price || 0,
//                 gstslab: priceDetails.gstslab || "5%", // Default GST slab
//             },
//             productdescription: {
//                 inclusion: productdescription.inclusion || [],
//                 aboutexperience: productdescription.aboutexperience || "",
//                 need: productdescription.need || "",
//                 cancellation: productdescription.cancellation || "",
//             },
//             productimages: productImages,
//             productcustomizeDetails: customizedDetailsWithImages,
//             availableCities: req.body.availableCities || [],
//         });

//         // Save the document to the database
//         const savedProduct = await newProduct.save();

//         if (!savedProduct) {
//             return res.status(200).json({ message: "Failed to add", status: 200 });
//         }

//         return res.status(201).json({ message: "Product added successfully", data: savedProduct });
//     } catch (error) {
//         console.error("Error adding product:", error.message);
//         return res.status(500).json({ error: error.message });
//     }
// };

// const addnewProduct = async (req, res) => {
//     try {
//         // console.log("==>",req.body);
//         // Generate a sequence value for productId
//         const counter = await Counter.findOneAndUpdate(
//             { id: "productid" },
//             { $inc: { seq: 1 } },
//             { new: true, upsert: true }
//         );
//         const productId = `product-${String(counter.seq).padStart(3, "0")}`;

//         // Extract file paths (S3 URLs) for images
//         // const productImages = req.files['productimages']?.map((file) => file.location) || [];
//         // const customImages = req.files['customimages']?.map((file) => file.location) || [];

//         // Parse JSON fields from req.body
//         // console.log("PRODUCTDETAILS",req.body.productDetails)
//         const productDetails = JSON.parse(req.body.productDetails)
//         const priceDetails = JSON.parse(req.body.priceDetails)
//         const productdescription = JSON.parse(req.body.productDescription)
//         const productcustomizeDetails = JSON.parse(req.body.productCustomizeDetails)
//         const productImages= Json.parse(req.body.productImages)
//         // console.log('productImages',productImages)
//         // console.log("CUS",productcustomizeDetails)
        

//         // Combine custom images with customization details
//         const customizedDetailsWithImages = productcustomizeDetails.map((custom) => ({
//             name: custom.name,
//             price: custom.price,
//             customimages: custom.customimages 
//         }));
//         /////combine parsed product images
//         const prodImages= productImages.map((images)=>({
//             productimages:images.productimages
//         })); 
//         console.log('prodimage',prodImages)
//         // Create a new product document
//         const newProduct = new NewProductData({
//             productid: productId,
//             productDetails: {
//                 productcategory: productDetails.productcategory,
//                 productsubcategory: productDetails.productsubcategory,
//                 productname: productDetails.productname,
//                 producttitledescription: productDetails.producttitledescription,
//                 estimatedecorativetime: productDetails.estimatedecorativetime,
//             },
//             priceDetails: {
//                 price: priceDetails.price,
//                 gstslab: priceDetails.gstslab,
//             },
//             productdescription: {
//                 inclusion: productdescription.inclusion,
//                 aboutexperience: productdescription.aboutexperience,
//                 need: productdescription.need,
//                 cancellation: productdescription.cancellation,
//             },
//             productimages: prodImages,
//             productcustomizeDetails: customizedDetailsWithImages,
//             availableCities: req.body.availableCities || []
//         });

//         // console.log("==>NEW",newProduct)

//         // Save the document to the database
//         const savedProduct = await newProduct.save();
//         ///check if product not added 
//         if(!savedProduct){
//             return res.status(200).json({message:"Failed to add",status:200})
//         }
//         ///created check
//         return res.status(201).json({ message: 'Product added successfully', data: savedProduct });
//     } catch (error) {
//         console.error('Error adding product:', error.message);
//         return res.status(500).json({ error: error.message });
//     }
// };

// Get all products
// const getallProducts=async (req, res) => {
//     try {
//         const limit = parseInt(req.query.limit) || 10;
//         const page = parseInt(req.query.page) || 1;
//         const skip = (page - 1) * limit;

//         const pipeline = [
            
//             // {
//             //     $lookup: {
//             //         from: "productorders", 
//             //         localField: "_id", 
//             //         foreignField: "itemDetails.productId", 
//             //         as: "orderDetails"
//             //     }
//             // },
            
//             // { $unwind: "$orderDetails" },
            
//             // {
//             //     $match: {
//             //         "orderDetails.status": "completed" 
//             //     }
//             // },
        
//             // {
//             //     $group: {
//             //         _id: "$_id", 
//             //         productName: { $first: "$productDetails.productname" }, 
//             //         totalSales: { $sum: "$orderDetails.amount" }, 
//             //         completedOrders: { $sum: 1 }
//             //     }
//             // },
            
//             {
//                 $project: {
//                     _id: 1,
//                     productid:1,
//                     "productDetails.productname": 1,
//                     // totalSales: 1,
//                     // completedOrders: 1,
//                     createdAt:1,
//                     "productDetails.productcategory":1,
//                     "priceDetails.price":1
//                 }
//             },
            
//             {
//                 $sort: { totalSales: -1 }
//             },
            
//             {
//                 $facet: {
//                     data: [{ $skip: skip }, { $limit: limit }],
//                     totalCount: [{ $count: "count" }]
//                 }
//             }
//         ];
        

//         // Execute the aggregation
//     const result = await NewProductData.aggregate(pipeline);

//     // Extract data and count
//     const product = result[0]?.data || [];
//     const totalCount = result[0]?.totalCount[0]?.count || 0;
//     const totalPages = Math.ceil(totalCount / limit);

//     if (product.length === 0) {
//       return res.status(200).json({
//         message: "No Product found",
//         status: "success",
//         data: {
//           product: [],
//           pagination: {
//             currentPage: page,
//             totalPages: totalPages,
//             totalItems: totalCount,
//             perPage: limit,
//           },
//         },
//       });
//     }

//     return res.status(200).json({
//       message: "Product retrieved successfully",
//       status: "success",
//       data: {
//         product: product,
//         pagination: {
//           currentPage: page,
//           totalPages: totalPages,
//           totalItems: totalCount,
//           perPage: limit,
//         },
//       },
//     });


//         // const products = await NewProductData.find();
//         // return res.status(200).json(products);
//     } catch (error) {
//         console.error('Error fetching products:', error.message);
//         return res.status(500).json({ error: error.message });
//     }
// };
const getallProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
        const { search, fromDate, toDate } = req.query;

        const matchQuery = {};

        if (search) {
            matchQuery.$or = [
                { productid: { $regex: search, $options: 'i' } },
                { "productDetails.productname": { $regex: search, $options: 'i' } }
            ];
        }

        if (fromDate || toDate) {
            matchQuery.createdAt = {};

            if (fromDate) {
                const startOfDay = new Date(fromDate);
                startOfDay.setUTCHours(0, 0, 0, 0);
                matchQuery.createdAt.$gte = startOfDay;
            }

            if (toDate) {
                const endOfDay = new Date(toDate);
                endOfDay.setUTCHours(23, 59, 59, 999);
                matchQuery.createdAt.$lte = endOfDay;
            }
        }

        const pipeline = [
            { $match: matchQuery },
            {
                $project: {
                    _id: 1,
                    productid: 1,
                    "productDetails.productname": 1,
                    createdAt: 1,
                    "productDetails.productcategory": 1,
                    "priceDetails.price": 1
                }
            },
            {
                $sort:{createdAt:-1}
            },
            {
                $facet: {
                    data: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }]
                }
            }
        ];

        const result = await NewProductData.aggregate(pipeline);
        const product = result[0]?.data || [];
        const totalCount = result[0]?.totalCount[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / limit);

        if (product.length === 0) {
            return res.status(200).json({
                message: "No Product found",
                status: "success",
                data: {
                    product: [],
                    meta: {
                        currentPage: page,
                        totalPages: totalPages,
                        totalItems: totalCount,
                        perPage: limit,
                    },
                },
            });
        }

        return res.status(200).json({
            message: "Product retrieved successfully",
            status: "success",
            data: {
                product: product,
                meta: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalItems: totalCount,
                    perPage: limit,
                },
            },
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        return res.status(500).json({ error: error.message });
    }
};


// Get a product by ID
// router.get('/:id', 
const getsingleProduct=async (req, res) => {
    try {
        const product = await NewProductData.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({data:product});
    } catch (error) {
        console.error('Error fetching product:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

// Update a product
///in this updation can be done on a selected product
const updatesingleProduct = async (req, res) => {
    try {
        console.log('data for updation',req.body)
        const { id } = req.params;

        ////data to be updated
        let updateData = {};
        let { 
            productDetails, 
            priceDetails, 
            productdescription,
            productcustomizeDetails,
            productimages,
            availableCities  
        } = req.body;


        productDetails = JSON.parse(productDetails)
        priceDetails = JSON.parse(priceDetails);
        productdescription = JSON.parse(productdescription);
        productcustomizeDetails=JSON.parse(productcustomizeDetails)
        

        // productDetails update check
        if (productDetails) {
            updateData.productDetails = {
                productcategory: productDetails.productcategory || undefined,
                productsubcategory: productDetails.productsubcategory || undefined,
                productname: productDetails.productname || undefined,
                producttitledescription: productDetails.producttitledescription || undefined,
                estimatedecorativetime: productDetails.estimatedecorativetime || undefined,
            };
        }

        //  priceDetails update check
        if (priceDetails) {
            updateData.priceDetails = {
                price: priceDetails.price || undefined,
                gstslab: priceDetails.gstslab || undefined,
                discountedPrice: priceDetails.discountedPrice || undefined
            };
        }

        //  productdescription update check
        if (productdescription) {
            updateData.productdescription = {
                inclusion: productdescription.inclusion || undefined,
                aboutexperience: productdescription.aboutexperience || undefined,
                need: productdescription.need || undefined,
                cancellation: productdescription.cancellation || undefined,
            };
        }

        //  productimages update check
        if(productimages){
            updateData["productimages"]=productimages
        }

        ///product customization
        if (productcustomizeDetails) {
            updateData.productcustomizeDetails = productcustomizeDetails.map(detail => ({
                name: detail.name || undefined,
                price: detail.price || undefined,
                customimages: detail.customimages || undefined,
                description: detail.description||undefined,
                customproductId:detail.customproductId||undefined
            }));
        }

        ////available cities updation
        if(availableCities){
            updateData.availableCities=availableCities
        }
        // console.log(productcustomizeDetails);
        ///check if new custom image is uploaded 
        // if (productcustomizeDetails.customimages && productcustomizeDetails.customimages.req?.file?.location) {
        //     updateData.productcustomizeDetails.customimages = productcustomizeDetails.customimages.req.file.location;
        // }    
        // if(productcustomizeDetails.customimages){[
        //     updateData.productcustomizeDetails.customimages=productcustomizeDetails.customimages
        // ]
        // }
        
        // Remove undefined fields from the update object
        // Object.keys(updateData).forEach(key => {
        //     if (typeof updateData[key] === 'object' && !Array.isArray(updateData[key])) {
        //         updateData[key] = Object.fromEntries(
        //             Object.entries(updateData[key]).filter(([_, value]) => value !== undefined)
        //         );
        //     }
        // });


        //upadtae query 
        const updateQuery = await NewProductData.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!updateQuery) {
            return res.status(400).json({ message: "Failed to update data" });
        }

        return res.status(200).json({ message: "Updated Successfully", data: updateQuery });
    } catch (error) {
        console.error('Error updating product:', error.message);
        return res.status(500).json({ error: 'Internal server error',status:500 });
    }
};

// Delete a product 
const deletesingleProduct=async (req, res) => {
    try {
        const deletedProduct = await NewProductData.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json({ message: 'Product deleted successfully', data: deletedProduct });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

////product page search bar
// const productSearching=async(req,res)=>{
//     try {
//         const { search, fromDate, toDate } = req.query;

//         // Build query object
//         const query = {};
//         ///searching options
//         if (search) {
//             query.$or = [
//                 { productid: { $regex: search, $options: 'i' } },
//                 { "productDetails.productname": { $regex: search, $options: 'i' } }
//             ];
//         }
//         ///date wise search 
//         if (fromDate || toDate) {
//             query.createdAt = {};
//             if (fromDate) query.createdAt.$gte = new Date(fromDate);
//             if (toDate) query.createdAt.$lte = new Date(toDate);
//         }
//         ///returning data 
//         const products = await NewProductData.find(query).sort({ createdAt: -1 });
//         return res.status(200).json({message:"Data retrieve successfully",data:products});
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error:error.message});
//     }
// };

module.exports={deletesingleProduct,getallProducts,getsingleProduct,
    addnewProduct: [upload.fields([
        { name: 'productimages', maxCount: 5 },  
        { name: 'customimages', maxCount: 5 }     
    ]), addnewProduct],
    updatesingleProduct: [upload.fields([
        { name: 'productimages', maxCount: 5 },  
        { name: 'customimages', maxCount: 5 }     
    ]), updatesingleProduct]
    
}