const bannerModel= require('../models/adminBannerModel');
const multerSetup= require('../middlewares/uploadData')
const Counter=require('../models/counter');


//multer middleware
const upload = multerSetup(['image/jpeg', 'image/png'], 2 * 1024 * 1024);

//////////////admin to add, view ,update and delete banner information///////////////////////////

///admin add banner information
const bannerAdd = async (req, res) => {
    try {
      const { bannerTitle,bannerImage,bannerDescription } = req.body;
  
      //  sequence value for bannerId
      const counter = await Counter.findOneAndUpdate(
        { id: "bannerId" }, // Identifier for the counter
        { $inc: { seq: 1 } }, // Increment the sequence
        { new: true, upsert: true } // Create the counter if it doesn't exist
      );
  
      // Format the bannerId as "B-001", "B-002", etc.
      const bannerId = `B-${String(counter.seq).padStart(3, "0")}`;

      ///image check
      // if(!req.file){
      //   return res.status(400).json({message:"Please select a image to insert"});
      // }

      // Insert data
      const insertData = new bannerModel({
        bannerId: bannerId,
        bannerTitle: bannerTitle,
        bannerImage: bannerImage,
        bannerDescription:bannerDescription
      });
  
      ///check
      if(!insertData){
        return res.status(400).json({message:"Data not saved "})
      }
      // Save the banner to the database
      await insertData.save();
  
      return res.status(201).json({ message: "Banner inserted successfully.", data: insertData });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  };

 ///admin to edit data
 
 const bannerUpdate = async (req, res) => {
  try {
    const { bannerTitle,bannerImage,bannerDescription } = req.body;
    const { id } = req.params;

    // Create an object to hold the fields to be updated
    const updateFields = {};

    // Conditionally add bannerTitle if provided
    if (bannerTitle) {
      updateFields.bannerTitle = bannerTitle;
    }
    ///if description need to be upate
    if(bannerDescription){
      updateFields.bannerDescription=bannerDescription
    }

    // Conditionally add bannerImage if a file is provided
    if (bannerImage) {
      updateFields.bannerImage = bannerImage;
    }

    // Ensure at least one field is being updated
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Update the banner 
    const updatedData = await bannerModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }  
    );

    if (!updatedData) {
      return res.status(404).json({ message: "Banner not found" });
    }

    return res.status(200).json({ message: "Banner updated successfully", data: updatedData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

///delete banner

const bannerDelete=async(req,res)=>{
    try {
        const{id}=req.params;

        const deleteData= await bannerModel.findByIdAndDelete(id);
        if(!deleteData){
            return res.status(400).json({message:"Banner not found"})
        }
        return res.status(200).json({message:"Deleted Successfully",data:deleteData})

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message})
    }
}


////banner search bar and from-date and to-data filter 
const bannerSearching=async(req,res)=>{
    try {
        const { search, fromDate, toDate } = req.query;

        // Build query object
        const query = {};

        if (search) {
            query.$or = [
                { bannerId: { $regex: search, $options: 'i' } },
                { bannerTitle: { $regex: search, $options: 'i' } }
            ];
        }

        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) query.createdAt.$gte = new Date(fromDate);
            if (toDate) query.createdAt.$lte = new Date(toDate);
        }

        const banners = await bannerModel.find(query).sort({ createdAt: -1 });
        res.status(200).json({message:"Data retrieve successfully",data:banners});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message:"Something went wrong",error:error.message,status:false});
    }
}

/////banner list 
///in this logic banner list will return 

const bannerList=async(req,res)=>{
  try {
     const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const pipeline=[
        {
          $project: {
            _id: 1,
            bannerId: 1,
            bannerTitle: 1,
            bannerImage: 1,
            bannerDescription:1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
        {
          $sort:{createdAt:-1}
        },
          {
            $facet:{
              data:[
                {$skip:skip},
                {$limit:limit}
              ],
              totalCount:[{ $count: "count" }]
            }
          }
      ]

      ////execting pipeline
      const result= await bannerModel.aggregate(pipeline);

      // Extract data and count
      const banners = result[0]?.data || [];
      const totalCount = result[0]?.totalCount[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);
      ///check if no articles
      if (banners.length === 0) {
        return res.status(200).json({
          message: "No data found",
          status: true,
          data: {
            banners: [],
            pagination: {
              currentPage: page,
              totalPages: totalPages,
              totalItems: totalCount,
              perPage: limit,
            },
          },
        });
      }
      ///returning documnets
      return res.status(200).json({
        message: " retrieved successfully",
        status: true,
        data: {
          banners: banners,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalCount,
            perPage: limit,
          },
        },
      });
    
  } catch (error) {
        console.error(error);
        return res.status(500).json({ message:"Something went wrong",error:error.message,status:false});

  }
}


module.exports={
    bannerAdd:[upload.single('bannerImage'), bannerAdd],
    bannerUpdate:[upload.single('bannerImage'),bannerUpdate],
    bannerDelete,bannerSearching,bannerList
}