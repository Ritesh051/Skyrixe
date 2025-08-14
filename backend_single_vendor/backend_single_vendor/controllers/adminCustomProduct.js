const customModel=require('../models/adminCustomModel');

///////customization products managemnet////////////////////////////////////////

///create customization 
const craeteCustom=async(req,res)=>{
    try {
        const{name,price,customimage,description}=req.body;

        const newCustom = new customModel({
          name:name,
          price:price,
          customimage:customimage,
          description:description,
        });
        const saveCustom= await newCustom.save();

        if(!saveCustom){
            return res.status(400).json({message:"failed to save"})
        }

        //success return 
        return res.status(200).json({message:"Saved Successfully",data:saveCustom});

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server error",status:500,error:error.message})
    }
}

////delete custom 

const deleteCustom=async(req,res)=>{
    try {
        const{id}=req.params;
        //exitence check
        const checkData= await customModel.findById(id);
        if(!checkData){
            return res.status(404).json({message:"Not Found"});
        }

        ///delete query
        const deleteQuery= await customModel.findByIdAndDelete(id);
        
        if(!deleteQuery){
            return res.status(400).json({message:"Failed to delete"});
        }
        return res.status(200).json({message:"Deleted Successfully",data:deleteQuery});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server error",error:error.message})
    }
}

///update custom product 
const updateCustom= async(req,res)=>{
    try {
        const{id}=req.params;
        const{name,price,customimage,description}=req.body;
        ///documnet existece check
        const chekcingData=await customModel.findById(id);
        if(!chekcingData){
            return res.status(404).json({message:"Not Found"})
        }
        ///multiple check for updation 
        const updateObj={};
        ///name check
        if(name){
            updateObj.name=name
        }
        //price check
        if(price){
            updateObj.price=price
        }
        //image cehck
        if(customimage){
            updateObj.customimage=customimage
        }
        //description
        if(description){
            updateObj.description=description
        }

        ///update query 
        const updateSet= await customModel.findByIdAndUpdate(
            id,
            {$set:updateObj},
            {new:true}
        );
        if(!updateSet){
            return res.status(400).json({message:"Failed to Update"})
        }

        ///return success data
        return res.status(200).json({message:"Updated Scucessfuly",data:updateSet})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server error",error:error.message})
    }
}

////listing custom 
const listingCustom=async(req,res)=>{
    try {

        const findCustom = await customModel.find({});
        if(!findCustom){
            return res.status(404).json({message:"No data found"})
        }
        return res.status(200).json({message:"Data retrived Successfully",data:findCustom});
        // const limit = parseInt(req.query.limit) || 10; 
        // const page = parseInt(req.query.page) || 1; 
        // const skip = (page - 1) * limit;
        //pipeline for data fetch
        // const pipeline=[
        //     {
        //         $match:{}
        //     },
        //     {$sort:{createdAt:-1}},
        //     {
        //         $facet: {
        //           data: [{ $skip: skip }, { $limit: limit }],
        //           totalCount: [{ $count: "count" }],
        //         },
        //       }
        // ]

        // ///execute pipeline
        // const result= await customModel.aggregate(pipeline);
        // // Check if no orders found
        // if (result.length === 0) {
        //     return res.status(404).json({ message: "No custom products found" });
        // }

        // // Get total number of orders for pagination info
        // const totalProducts = await customModel.countDocuments({});
        // const totalPages = Math.ceil(totalProducts / limit);

        // // Return data with pagination info
        // return res.status(200).json({
        //     message: "Custom Products Fetch Successfully",
        //     data: result,
        //     pagination: {
        //         totalProducts,
        //         totalPages,
        //         currentPage: page,
        //         limit,
        //     },
        // });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server error",error:error.message})
    }
}

module.exports={craeteCustom,deleteCustom,updateCustom,listingCustom}