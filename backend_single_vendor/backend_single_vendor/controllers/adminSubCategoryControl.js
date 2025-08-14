const subcategoryInsertModel = require('../models/adminSubCategoryModel'); //schema import
const multerSetup = require('../middlewares/uploadData');  //multer import
const mongoose=require('mongoose')
const Counter=require('../models/counter');
const categorySchemaData = require('../models/adminCategoryModel');
const upload = multerSetup( ['image/jpeg', 'image/png'], 2 * 1024 * 1024);


///insert categories in db
const subcategoryInsert = async (req, res) => {
    try {
        const {  subcategoryName, catId,subcategoryImage } = req.body;

        ///category id check
        if (!catId) {
            return res.status(400).json({ error: "Category ID (catId) is required." });
        }
        // Sequence value for bannerId
    const counter = await Counter.findOneAndUpdate(
      { id: "subcatId" }, // Identifier for the counter
      { $inc: { seq: 1 } }, // Increment the sequence
      { new: true, upsert: true } // Create the counter if it doesn't exist
    );

    // Format the bannerId as "B-001", "B-002", etc.
    const subcatId = `subcat-${String(counter.seq).padStart(3, "0")}`;


        // Create a new document for the subcategory
        const insertData = new subcategoryInsertModel({
            subcatId:subcatId,
            subcategoryImage: subcategoryImage,
            subcategoryName,
            catId
        });

        // Save the document to the database
        await insertData.save();

        // Populate the `catId` field with its associated data
        const populatedData = await subcategoryInsertModel.findById(insertData._id).populate('catId');

        // Send a success response
        return res.status(201).json({ 
            message: "Subcategory inserted successfully.", 
            data: populatedData 
        });

    } catch (error) {
        // Handle errors and send an appropriate response
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};


///admin sub category delete
const subcategoryDelete=async(req,res)=>{
    try {
        const{id}=req.params;
        const deletingData= await subcategoryInsertModel.findByIdAndDelete(id);
        if(!deletingData){
            return res.status(401).json({message:"Failed to delete"})
        }
        return res.status(200).json({message:"Deleted Successfully",data:deletingData})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

///admin to upadte subcategory
const subcategoryUpdate = async (req, res) => {
    try {
        const { id } = req.params; 
        const { subcatId, subcategoryName, status,subcategoryImage } = req.body;

        //  update fields object
        const updateField = {};
        if (subcatId) updateField.subcatId = subcatId;
        if (subcategoryName) updateField.subcategoryName = subcategoryName;
        if (status) updateField.status = status;
        if(subcategoryImage) updateField.subcategoryImage=subcategoryImage;
        // Update the image only if a new file is provided
        // if (req.file) {
        //     updateField.subcategoryImage = req.file.path;
        // }

        // Find the document by ID and update it
        const updateData = await subcategoryInsertModel.findByIdAndUpdate(
            id,
            { $set: updateField },
            { new: true } 
        );

        if (!updateData) {
            return res.status(404).json({ error: "Sub Category not found." });
        }

        return res.status(200).json({ message: "Sub Category updated successfully.", data: updateData,status:true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

////sub-category view list
//id is category id for whom subcategory will be fetched
// const subcategoryList = async (req, res) => {
//   try {
//     const { id } = req.params; 
//     // const limit = parseInt(req.query.limit) || 10;
//     // const page = parseInt(req.query.page) || 1;
//     // const skip = (page - 1) * limit;

//     const pipeline = [
//       {
//         $match: {
//           catId: new mongoose.Types.ObjectId(id)
         
//         },
//       },
//       {
//         $project: {
//           _id: 1, // Exclude the _id field
//           catId:1,
//           subcatId: 1,
//           subcategoryImage: 1,
//           subcategoryName: 1,
//           isActive: 1,
//           createdAt: 1,
//           status: 1,
//         },
//       },
//       // {
//       //   $facet: {
//       //     data: [{ $skip: skip }, { $limit: limit }],
//       //     totalCount: [{ $count: "count" }],
//       //   },
//       // },
//     ];

//     // Execute the aggregation
//     const result = await subcategoryInsertModel.aggregate(pipeline);

//     // Extract data and count
//     const subcategory = result[0]?.data || [];
//     console.log(subcategory)
//     // const totalCount = result[0]?.totalCount[0]?.count || 0;
//     // const totalPages = Math.ceil(totalCount / limit);

//     if (subcategory.length === 0) {
//       return res.status(200).json({
//         message: "No Sub category found",
//         status: "success",
//         data: {
//           category: [],
//           // pagination: {
//           //   currentPage: page,
//           //   totalPages: totalPages,
//           //   totalItems: totalCount,
//           //   perPage: limit,
//           // },
//         },
//       });
//     }

//     return res.status(200).json({
//       message: "Sub-Category retrieved successfully",
//       status: "success",
//       data: {
//         subcategory: subcategory,
//         // pagination: {
//         //   currentPage: page,
//         //   totalPages: totalPages,
//         //   totalItems: totalCount,
//         //   perPage: limit,
//         // },
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: error.message });
//   }
// };
const subcategoryList = async (req, res) => {
  try {
    const { id } = req.params; 

    const pipeline = [
      {
        $match: {
          catId: new mongoose.Types.ObjectId(id)
        },
      },
      {
        $project: {
          _id: 1,
          catId:1,
          subcatId: 1,
          subcategoryImage: 1,
          subcategoryName: 1,
          isActive: 1,
          createdAt: 1,
          status: 1,
        },
      }
    ];

    // Execute the aggregation
    const result = await subcategoryInsertModel.aggregate(pipeline);

    // Extract data
    const subcategory = result || [];
    

    if (subcategory.length === 0) {
      return res.status(200).json({
        message: "No Sub category found",
        status: "success",
        data: {
          category: []
        },
      });
    }

    return res.status(200).json({
      message: "Sub-Category retrieved successfully",
      status: "success",
      data: {
        subcategory: subcategory
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};


///sub-category searching 
////search bar of sub category page 
const subcategorySearching=async(req,res)=>{
  try {
      const { search, fromDate, toDate } = req.query;

      // Build query object
      const query = {};

      if (search) {
          query.$or = [
              { subcatId: { $regex: search, $options: 'i' } },
              { subcatTitle: { $regex: search, $options: 'i' } }
          ];
      }

      if (fromDate || toDate) {
          query.createdAt = {};
          if (fromDate) query.createdAt.$gte = new Date(fromDate);
          if (toDate) query.createdAt.$lte = new Date(toDate);
      }

      const subcategoryData = await subcategoryInsertModel.find(query).sort({ createdAt: -1 });
      return res.status(200).json({message:"Data retrieve successfully",data:subcategoryData});
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error:error.message});
  }
};

//////category list for dropdown 
////in this admin will see a list of categories available in the db
const categoriesDrop=async(req,res)=>{
  try {
    const pipeline=[{
      $project:{
        subcategoryName:1
      }
    }];

    ///execting pipeline
    const result= await categorySchemaData.aggregate(pipeline);
    //check
    if(!result){
      return res.status(200).json({message:"Failed to get data",status:true});
    }
    //returning data
    return res.status(200).json({message:"Category list for Drop down",data:result,status:true});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"Something Wrong",status:false})
  }
}

module.exports ={
    subcategoryInsert: [upload.single('subcategoryImage'), subcategoryInsert],subcategoryDelete,subcategoryUpdate:[upload.single('subcategoryImage'),subcategoryUpdate],
    subcategoryList,subcategorySearching,categoriesDrop
};