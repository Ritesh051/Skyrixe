const customerModel= require('../models/customerauthModel')
const mongoose=require('mongoose')

////customer profile data for a specific user 
///in this fetching customer info on the id basis
const customerProfileInfo=async(req,res)=>{
    try {
        const{id}=req.params
        //get a customer whole information according to the provided id
        const customerData= await customerModel.findById(id);
        ///check user existence
        if(!customerData){
            return res.status(404).json({message:"No customer found",status:404})
        }
        ///returning data 
        return res.status(200).json({message:"customer",data:customerData,status:200})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:error.message,status:500})
    }
}

////customer profile updation 
//in this i am updating customer updation such as personal info and both address and alternate phone 

const customerDataUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if the user exists
        const existingUser = await customerModel.findById(id);
        ///chck user
        if (!existingUser) {
            return res.status(404).json({ message: "User not found",status:404 });
        }


        // Update the user's data of three fields personal and homeaddress,officeaddress and alternatephone
        const allowedUpdates = [
            "personalInfo", 
            "alternatePhone"
        ]; 
        const updates = Object.keys(req.body);

        // Validate that only allowed fields are being updated
        const isValidUpdate = updates.every((key) => allowedUpdates.includes(key));
        if (!isValidUpdate) {
            return res.status(400).json({ message: "Invalid fields in update request",status:400 });
        }

        ///update set
        const updatedData = await customerModel.findByIdAndUpdate(
            id,
            { $set: req.body }, 
            { new: true, runValidators: true } 
        );
        ///if not updated
        if (!updatedData) {
            return res.status(400).json({ message: "Failed to update user data",status:400 });
        }
        ///returning dta
        return res.status(200).json({
            message: "User data updated successfully",
            data: updatedData,
            status:200
        });
    } catch (error) {
        console.error("Error updating user data:", error);
        return res.status(500).json({ error: error.message,status:500 });
    }
};

///multiple address api 
const addCustomerAddress = async (req, res) => {
    try {
        const { userId } = req.params;
        const { address } = req.body; // address should include `addresstype`

        if (!userId || !address || !address.addresstype) {
            return res.status(400).json({ message: "User ID and complete address (including addresstype) are required", status: 400 });
        }

        const user = await customerModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", status: 404 });
        }

        user.Addresses.push(address); 

        const updatedUser = await user.save();

        return res.status(200).json({ message: "Address added successfully", data: updatedUser, status: 200 });
    } catch (error) {
        return res.status(500).json({ message: "Error adding address", error: error.message, status: 500 });
    }
};

/////////update customer address
const updateCustomerAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
        const { address } = req.body; // address should include updated fields

        if (!userId || !addressId || !address) {
            return res.status(400).json({ message: "User ID, address ID, and updated address details are required", status: 400 });
        }

        const user = await customerModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", status: 404 });
        }

        // Find the index of the address
        const addressIndex = user.Addresses.findIndex(addr => addr._id.toString() === addressId);

        if (addressIndex === -1) {
            return res.status(404).json({ message: "Address not found", status: 404 });
        }

        // Update the specific address fields
        user.Addresses[addressIndex] = { ...user.Addresses[addressIndex]._doc, ...address };

        const updatedUser = await user.save();

        return res.status(200).json({ message: "Address updated successfully", data: updatedUser, status: 200 });
    } catch (error) {
        return res.status(500).json({ message: "Error updating address", error: error.message, status: 500 });
    }
};

////delete customer addrsss
const deleteCustomerAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;

        if (!userId || !addressId) {
            return res.status(400).json({ message: "User ID and address ID are required", status: 400 });
        }

        const user = await customerModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", status: 404 });
        }

        // Filter out the address that needs to be deleted
        user.Addresses = user.Addresses.filter(addr => addr._id.toString() !== addressId);

        const updatedUser = await user.save();

        return res.status(200).json({ message: "Address deleted successfully", data: updatedUser, status: 200 });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting address", error: error.message, status: 500 });
    }
};

/////list of address of a particular customer 
const getAllCustomerAddresses = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required", status: 400 });
        }

        // Validate if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID format", status: 400 });
        }

        // Aggregation pipeline to fetch user and project only addresses
        const user = await customerModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } }, // Match user by ID
            { $project: { Addresses: 1, _id: 0 } } // Project only the addresses
        ]);

        if (!user.length) {
            return res.status(404).json({ message: "User not found", status: 404 });
        }

        return res.status(200).json({
            message: "User addresses retrieved successfully",
            data: user[0], // Since aggregation returns an array, access the first element
            status: 200
        });

    } catch (error) {
        return res.status(500).json({ message: "Error fetching addresses", error: error.message, status: 500 });
    }
};

module.exports={customerDataUpdate,customerProfileInfo,getAllCustomerAddresses,deleteCustomerAddress,addCustomerAddress,updateCustomerAddress}