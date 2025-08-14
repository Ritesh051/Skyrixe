const categoryInsertModel = require("../models/adminCategoryModel"); //schema import
const multerSetup = require("../middlewares/uploadData"); //multer import
const Counter = require("../models/counter"); ///counter

const upload = multerSetup(
  ["image/jpeg", "image/png"],
  2 * 1024 * 1024
);

///insert categories in db
const categoryInsert = async (req, res) => {
  try {
    const { categoryName,categoryImage } = req.body;

    // Sequence value for bannerId
    const counter = await Counter.findOneAndUpdate(
      { id: "catId" }, // Identifier for the counter
      { $inc: { seq: 1 } }, // Increment the sequence
      { new: true, upsert: true } // Create the counter if it doesn't exist
    );

    // Format the bannerId as "B-001", "B-002", etc.
    const catId = `cat-${String(counter.seq).padStart(3, "0")}`;

    const insertData = new categoryInsertModel({
      catId: catId,
      categoryImage: categoryImage, 
      categoryName: categoryName,
     
    });

    await insertData.save();
    return res
      .status(201)
      .json({ message: "Category inserted successfully.", data: insertData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

///specific category delete
//deleting specific category if not needed by admin on delete button click
const categoryDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletingData = await categoryInsertModel.findByIdAndDelete(id);
    if (!deletingData) {
      return res.status(400).json({ message: "Failed to Delete or wrong Id" });
    }
    return res
      .status(200)
      .json({ message: "Deleted Successfully", data: deletingData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

///admin category update
///update category information

const categoryUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName,categoryImage } = req.body;


    //  update fields
    const updateFields = {};
    //name check
    if (categoryName) {
      updateFields.categoryName = categoryName;
    }
    ///image check
    if (categoryImage) {
      updateFields.categoryImage = categoryImage;
    }

    // Update the category
    const updatedCategory = await categoryInsertModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found or not updated" });
    }

    return res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

///view category list with pagination 
const categoryList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $lookup: {
          from: "newproductdatas", 
          localField: "categoryName",
          foreignField: "productDetails.productcategory",
          as: "products"
        }
      },
      {
        $lookup: {
          from: "subcategoryinfos", 
          localField: "_id",
          foreignField: "catId",
          as: "subcategories"
        }
      },
      {
        $addFields: {
          productCount: { $size: "$products" },
          subcategoryCount: { $size: "$subcategories" }
        }
      },
      {
        $project: {
          _id: 1,
          catId: 1,
          categoryImage: 1,
          categoryName: 1,
          status: 1,
          isActive: 1,
          createdAt: 1,
          productCount: 1,
          subcategoryCount: 1
        }
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }]
        }
      }
    ];

    const result = await categoryInsertModel.aggregate(pipeline);
    const category = result[0]?.data || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      message: category.length ? "Category retrieved successfully" : "No category found",
      status: "success",
      data: {
        category,
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
    return res.status(500).json({ error: error.message });
  }
};

////////////////category list without pagination
const categoryListFull = async (req, res) => {
  try {
    const pipeline = [
      {
        $match: {}
      },
      {
        $project: {
          _id: 1,
          catId: 1,
          categoryImage: 1,
          categoryName: 1,
          status: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $sort: { createdAt: -1 } // Sorting in descending order
      }
    ];

    const categoryListing = await categoryInsertModel.aggregate(pipeline);
    return res.status(200).json({ message: "Category listing", data: categoryListing });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message, message: "Internal Server Error" });
  }
};


////category search bar 
//category serach bar to search data on the basis of input data
const categorySearching=async(req,res)=>{
  try {
      const { search, fromDate, toDate } = req.query;

      // Build query object
      const query = {};

      if (search) {
          query.$or = [
              { catId: { $regex: search, $options: 'i' } },
              { categoryName: { $regex: search, $options: 'i' } }
          ];
      }

      if (fromDate || toDate) {
          query.createdAt = {};
          if (fromDate) query.createdAt.$gte = new Date(fromDate);
          if (toDate) query.createdAt.$lte = new Date(toDate);
      }

      const categoryData = await categoryInsertModel.find(query).sort({ createdAt: -1 });
      return res.status(200).json({message:" categoryData retrieve successfully",data:categoryData});
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error:error.message});
  }
}



module.exports = {
  categoryInsert: [upload.single("categoryImage"), categoryInsert],
  categoryDelete,
  categoryUpdate: [upload.single("categoryImage"), categoryUpdate],
  categoryList,categorySearching,categoryListFull
};
