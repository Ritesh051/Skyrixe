const privacyModel=require('../models/privacypolicyModel');
///about us data import
const aboutusModel=require('../models/aboutusModel');
///term and condition import 
const termconditionModel=require('../models/termconditionModel')
///conatct us model
const contactModel=require('../models/contactusModel');
const { findById } = require('../models/newproductaddModel');
///return policy model
const returnpolicyModel=require('../models/returpolicyModel');
////faq model
const faqModel=require('../models/faqModel');

/////////for aboutus part insert,get and update ////////////////////

//aboutus data
const aboutusInsert = async (req, res) => {
    try {
        const { details } = req.body;

        // Validate the input using Joi
        // const { error } = aboutusInsertValidationSchema.validate({ details }, { abortEarly: false });
        // if (error) {
        //     return res.status(400).json({
        //         message: "Validation failed",
        //         errors: error.details.map(err => err.message), // Return detailed validation errors
        //     });
        // }

        // Model import and data entry
        const dataEntry = new aboutusModel({ details: details });

        // Saving data
        const saving = await dataEntry.save();

        // Check if saving was successful
        if (!saving) {
            return res.status(400).json({ message: "Failed to Insert Data" });
        }

        // Return success response
        return res.status(200).json({ message: "Inserted Successfully", data:saving });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
////update the about us data 
const aboutusupdateData = async (req, res) => {
    try {
        const { id } = req.params; 
        const { details } = req.body;

        // Validate the input using Joi
        // const { error } = aboutusUpdateValidationSchema.validate({ details }, { abortEarly: false });
        // if (error) {
        //     return res.status(400).json({
        //         message: "Validation failed",
        //         errors: error.details.map(err => err.message), // Detailed validation errors
        //     });
        // }

        // Update the data
        const updateData = await aboutusModel.findByIdAndUpdate(
            id,
            { details: details },
            { new: true }
        );

        // Check if the update was successful
        if (!updateData) {
            return res.status(200).json({ message: "Failed to Update",status:true });
        }

        // Return success response
        return res.status(200).json({ message: "Updated successfully", data:updateData,status:true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message,status:false });
    }
};
////////get the about us data 
const aboutgetData=async(req,res)=>{
    try {
        //get query
        const getData= await aboutusModel.find({});
        //check
        if(!getData){
            return res.status(200).json({message:"Something went wrong",status:true})
        }
        //retrun data 
        return res.status(200).json({message:"About us Info",data:getData,status:true})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message,status:false})
    }
}

/////////for privacydata part insert,get and update ////////////////////

//privacy data
const privacyInsert = async (req, res) => {
    try {
        const { details } = req.body;

        // Validate the input using Joi
        // const { error } = privacyInsertValidationSchema.validate({ details }, { abortEarly: false });
        // if (error) {
        //     return res.status(400).json({
        //         message: "Validation failed",
        //         errors: error.details.map(err => err.message), // Return detailed validation errors
        //     });
        // }

        // Model import and data entry
        const dataEntry = new privacyModel({ details: details });

        // Saving data
        const saving = await dataEntry.save();

        // Check if saving was successful
        if (!saving) {
            return res.status(200).json({ message: "Failed to Insert Data",status:true });
        }

        // Return success response
        return res.status(200).json({ message: "Inserted Successfully", data:saving,status:true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message,status:false });
    }
};

////update the privacy data 
const privacyupdatData = async (req, res) => {
    try {
        const { id } = req.params; 
        const { details } = req.body;

        // Validate the input using Joi
        // const { error } = privacyUpdateValidationSchema.validate({ details }, { abortEarly: false });
        // if (error) {
        //     return res.status(400).json({
        //         message: "Validation failed",
        //         errors: error.details.map(err => err.message), // Return detailed validation errors
        //     });
        // }

        // Update the data
        const updateData = await privacyModel.findByIdAndUpdate(
            id,
            { details: details },
            { new: true }
        );

        // Check if the update was successful
        if (!updateData) {
            return res.status(200).json({ message: "Failed to Update",status:true });
        }

        // Return success response
        return res.status(200).json({ message: "Updated successfully",data: updateData,status:true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message,status:true });
    }
};
////////get the privacy data 
const privacygetData=async(req,res)=>{
    try {
        //get query
        const getData= await privacyModel.find({});
        //check
        if(!getData){
            return res.status(200).json({message:"Something went wrong",status:true})
        }
        //retrun data 
        return res.status(200).json({message:"Privacy Policy Data",data:getData,status:true})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message,status:false})
    }
}

/////////for term and condition part insert,get and update ////////////////////

//privacy data
const termInsert = async (req, res) => {
    try {
        const { details } = req.body;

        // Validate the input using Joi
        // const { error } = termInsertValidationSchema.validate({ details }, { abortEarly: false });
        // if (error) {
        //     return res.status(400).json({
        //         message: "Validation failed",
        //         errors: error.details.map(err => err.message), // Detailed validation errors
        //     });
        // }

        // Model import and data entry
        const dataEntry = new termconditionModel({ details: details });

        // Save data
        const saving = await dataEntry.save();

        // Check if saving was successful
        if (!saving) {
            return res.status(200).json({ message: "Failed to Insert Data",status:true });
        }

        // Return success response
        return res.status(200).json({ message: "Inserted Successfully", data:saving,status:true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message,status:false });
    }
};

////update the privacy data 
const termupdatData = async (req, res) => {
    try {
        const { id } = req.params; // MongoDB document ID
        const { details } = req.body;

        // Validate the input using Joi
        // const { error } = termUpdateValidationSchema.validate({ details }, { abortEarly: false });
        // if (error) {
        //     return res.status(400).json({
        //         message: "Validation failed",
        //         errors: error.details.map(err => err.message), // Return detailed validation errors
        //     });
        // }

        // Update the data
        const updateData = await termconditionModel.findByIdAndUpdate(
            id,
            { details: details },
            { new: true } // Ensure the updated document is returned
        );

        // Check if the update was successful
        if (!updateData) {
            return res.status(200).json({ message: "Failed to Update",status:true });
        }

        // Return success response
        return res.status(200).json({ message: "Updated successfully", data:updateData,status:true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message,status:false });
    }
};

////////get the terms and contion data 
const termgetData=async(req,res)=>{
    try {
        //get query
        const getData= await termconditionModel.find({});
        //check
        if(!getData){
            return res.status(200).json({message:"Something went wrong",status:true})
        }
        //retrun data 
        return res.status(200).json({message:"Term and condition info",data:getData,status:true})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message,status:false})
    }
}

/////////////////////////////////////////contact us part////////////////////////////////////////////////

////contact us insert
const contactInsert=async(req,res)=>{
    try {
        const{details}=req.body;
        const dataInsert=new contactModel({details:details});
        ///saving data 
        const savingData=await dataInsert.save();
        if(!savingData){
            return res.status(400).json({message:"Data not Inserted",status:true})
        }
        return res.status(200).json({message:"Data saved Successfully",data:savingData,status:true})

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message,status:false})
    }
}

//////conatct us update
const contactUpdate=async(req,res)=>{
    try {
        const{id}=req.params;
        const{details}=req.body;

        const updateDta= await contactModel.findByIdAndUpdate(
            id,
            {details:details},
            {new:true}
        )
        if(!updateDta){
            return res.status(400).json({message:"Failed to Update",status:true});
        }
        return res.status(200).json({message:"Updated Successfully",data:updateDta,status:true})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message,status:false})
    }
}

///////contact get api
const contactGet=async(req,res)=>{
    try {
        //get query
        const getData= await contactModel.find({});
        //check
        if(!getData){
            return res.status(200).json({message:"Something went wrong",status:true})
        }
        //retrun data 
        return res.status(200).json({message:"contact info",data:getData,status:true})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message,status:false})
    }
}

///////////////////////////return and cancellation policy part////////////////////////////////////////////////

////policy insert
const policyInsert=async(req,res)=>{
    try {
        const{details}=req.body;
        const dataInsert=new returnpolicyModel({details:details});
        ///saving data 
        const savingData=await dataInsert.save();
        if(!savingData){
            return res.status(400).json({message:"Data not Inserted",status:true})
        }
        return res.status(200).json({message:"Data saved Successfully",data:savingData,status:true})

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message,status:false})
    }
}

//////policy update
const policyUpdate=async(req,res)=>{
    try {
        const{id}=req.params;
        const{details}=req.body;

        const updateDta= await returnpolicyModel.findByIdAndUpdate(
            id,
            {details:details},
            {new:true}
        )
        if(!updateDta){
            return res.status(400).json({message:"Failed to Update",status:true});
        }
        return res.status(200).json({message:"Updated Successfully",data:updateDta,status:true})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message,status:false})
    }
}

///////policy get api
const policyGet=async(req,res)=>{
    try {
        //get query
        const getData= await returnpolicyModel.find({});
        //check
        if(!getData){
            return res.status(200).json({message:"Something went wrong",status:true})
        }
        //retrun data 
        return res.status(200).json({message:"return policy info",data:getData,status:true})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message,status:false})
    }
}
//////////////////////////faq related api//////////////////////////////////

////faq insert
const faqInsert=async(req,res)=>{
    try {
        const{details}=req.body;
        const dataInsert=new faqModel({details:details});
        ///saving data 
        const savingData=await dataInsert.save();
        if(!savingData){
            return res.status(400).json({message:"Data not Inserted",status:true})
        }
        return res.status(200).json({message:"Data saved Successfully",data:savingData,status:true})

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message,status:false})
    }
}

//////faq us update
const faqUpdate=async(req,res)=>{
    try {
        const{id}=req.params;
        const{details}=req.body;

        const updateDta= await faqModel.findByIdAndUpdate(
            id,
            {details:details},
            {new:true}
        )
        if(!updateDta){
            return res.status(400).json({message:"Failed to Update",status:true});
        }
        return res.status(200).json({message:"Updated Successfully",data:updateDta,status:true})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message,status:false})
    }
}

///////faq get api
const faqGet=async(req,res)=>{
    try {
        //get query
        const getData= await faqModel.find({});
        //check
        if(!getData){
            return res.status(200).json({message:"Something went wrong",status:true})
        }
        //retrun data 
        return res.status(200).json({message:"faq info",data:getData,status:true})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message,status:false})
    }
}

module.exports={aboutgetData,aboutusInsert,aboutusupdateData,privacyInsert,privacygetData,privacyupdatData,
    termInsert,termgetData,termupdatData,contactInsert,contactUpdate,contactGet,policyGet,policyInsert,policyUpdate,
    faqGet,faqUpdate,faqInsert
}