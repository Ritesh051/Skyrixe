const cityModel= require('../models/city');
const multerSetup=require('../middlewares/uploadData')

//multer middleware
const upload = multerSetup(['image/jpeg', 'image/png'], 2 * 1024 * 1024);

/////////////admin city controller-in this admin can add,view,delete and update city part///////////////


///city list entry
//from this admin can add city

const addCity = async (req, res) => {
  try {
    const { cityName, pincode } = req.body;

    //image check if no image were found
    if (!req.file) {
      return res
        .status(404)
        .json({ message: "Please select a image", status: true });
    }
    //pincode array map
    let pincodeArray = [];

    if (Array.isArray(pincode)) {
      pincodeArray = pincode
        .map((pin) => Number(pin))
        .filter((pin) => !isNaN(pin));
    } else if (typeof pincode === "string") {
      pincodeArray = pincode
        .split(",")
        .map((pin) => Number(pin.trim()))
        .filter((pin) => !isNaN(pin));
    } else {
      pincodeArray = [Number(pincode)].filter((pin) => !isNaN(pin));
    }

    /////saving entry
    const savingData = new cityModel({
      cityName: cityName,
      pincode: pincodeArray,
      cityImage: req.file.location,
    });

    const entry = await savingData.save();
    //CHECK
    if (!entry) {
      return res.status(200).json({ message: "failed to save data" });
    }

    //returning data
    return res
      .status(200)
      .json({ message: "Saved Successfully", data: entry, status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", status: false });
  }
};


////delete city 
//admin can delete a city

const deleteCity=async(req,res)=>{
    try {
        const{id}=req.params;
        ///delete data
        const deleteEntry= await cityModel.findByIdAndDelete(id);

        ///check 
        if(!deleteEntry){
            return res.status(200).json({message:"Failed to Delete",status:true});
        }

        //return data'
        return res.status(200).json({message:"Deleted Successfully",data:deleteEntry,status:true});

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something went wrong",status:false});
    }
}

////view city list 
///admin to view list of city available in db
const viewcityList = async (req, res) => {
    try {
        // Fetch all city data without pagination
        const cityData = await cityModel.find({});

        return res.status(200).json({
            message: cityData.length ? "City list retrieved successfully" : "No data found",
            status: true,
            data: {
                cities: cityData
            },
        });

    } catch (error) {
        console.error("Error fetching city list:", error);
        return res.status(500).json({ message: "Something went wrong", status: false, error: error.message });
    }
};

// const viewcityList=async(req,res)=>{
//     try {
//         const cityData= await cityModel.find({});
//         ///check data
//         if(!cityData){
//             return res.status(200).json({message:"Failed to get data",status:true});
//         }
        
//         ///return data
//         return res.status(200).json({message:"city List",data:cityData,status:true});

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({message:"Something went wrong",status:false});

//     }
// }
// const viewcityList = async (req, res) => {
//     try {
//         const page =  parseInt(req.query.page, 10) || 1; 
//         const limit =  parseInt(req.query.limit, 10) || 10; 
//         const skip = (page - 1) * limit;

//         // Fetch paginated data
//         const cityData = await cityModel.find({}).skip(skip).limit(limit);

//         // Get total count
//         const totalCount = await cityModel.countDocuments();

//         return res.status(200).json({
//             message: cityData.length ? "City list retrieved successfully" : "No data found",
//             status: true,
//             data: {
//                 cities: cityData,
//                 pagination: {
//                     currentPage: page,
//                     totalPages: Math.ceil(totalCount / limit),
//                     totalItems: totalCount,
//                     perPage: limit,
//                 },
//             },
//         });

//     } catch (error) {
//         console.error("Error fetching city list:", error);
//         return res.status(500).json({ message: "Something went wrong", status: false, error: error.message });
//     }
// };

///update city 
//admin to update city data 

const updateCity = async (req, res) => {
    try {
        const { id } = req.params;
        const { cityname, pincode, cityImage } = req.body;

        const updateData = {};

        // Update city name
        if (cityname) {
            updateData.cityName = cityname.trim();
        }

        // Update pincodes
        if (pincode) {
            let pincodeArray = [];

            if (Array.isArray(pincode)) {
                pincodeArray = pincode.map(pin => Number(pin)).filter(pin => !isNaN(pin));
            } else if (typeof pincode === "string") {
                
                pincodeArray = pincode
                    .split(",")
                    .map(pin => Number(pin.trim()))
                    .filter(pin => !isNaN(pin));
            } else {
                const pin = Number(pincode);
                if (!isNaN(pin)) {
                    pincodeArray = [pin];
                }
            }

            if (pincodeArray.length > 0) {
                updateData.pincode = pincodeArray;
            }
        }

        // Update city image
        if (req.file && req.file.location) {
            updateData.cityImage = req.file.location;
        } else if (cityImage) {
            updateData.cityImage = cityImage;
        }

        // Perform update
        const updatedData = await cityModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedData) {
            return res.status(400).json({ message: "Failed to update data", status: false });
        }

        return res.status(200).json({
            message: "Data updated successfully",
            data: updatedData,
            status: true
        });

    } catch (error) {
        console.error("Error in updateCity:", error);
        return res.status(500).json({ message: "Something went wrong", status: false });
    }
};


module.exports={
    viewcityList,deleteCity,addCity:[upload.single('cityImage'),addCity],
    updateCity:[upload.single('cityImage'),updateCity]
}