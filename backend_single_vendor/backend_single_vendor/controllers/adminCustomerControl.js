const customerModel=require('../models/customerauthModel');    
const productOrder=require('../models/productOrder');

///////////////////////////////////////admin to see and change customer status//////////////////////////
///admin to see the status of customers 
///from this admin can see the status of customers in a list 

const checklistCustomers = async (req, res) => {
    try {
        const { search, fromDate, toDate, page = 1, limit = 10 } = req.query;

        // Parse pagination parameters
        const pageNumber = parseInt(page, 10) || 1;
        const pageSize = parseInt(limit, 10) || 10;

        // Calculate the number of documents to skip
        const skip = (pageNumber - 1) * pageSize;

        // Build query object
        const query = {};

        // Searching options
        if (search) {
            query.$or = [
                { customerId: { $regex: search, $options: 'i' } },
                { "personalInfo.name": { $regex: search, $options: 'i' } }
            ];
        }

        // Date-wise search
        if (fromDate || toDate) {
            query.createdAt = {};
            if (fromDate) query.createdAt.$gte = new Date(fromDate);
            if (toDate) query.createdAt.$lte = new Date(toDate);
        }

        // Fetch paginated data
        const customersData = await customerModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize);

        // Get total count of documents matching the query
        const totalDocuments = await customerModel.countDocuments(query);

        if (customersData.length === 0) {
            return res.status(404).json({ message: "No Data Found" });
        }

        // Return paginated and filtered results along with metadata
        return res.status(200).json({
            data: customersData,
            meta: {
                totalDocuments,
                totalPages: Math.ceil(totalDocuments / pageSize),
                currentPage: pageNumber,
                limit: pageSize,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};




/////admin to change customer status from active to inactive
///in this i a status change is going on from active to block or inacative on default mongo id basis

const changestatusCustomer=async(req,res)=>{
    try {
        const{id}=req.params;
        const{isActive}=req.body;
        //updating customer status
        const changeStatus= await customerModel.findByIdAndUpdate(
            id,
            {isActive:isActive},
            {new:true}
        )
        //check if done
        if(!changeStatus){
            return res.status(401).json({message:"No customer found on this id"})
        }
        ///return data
        return res.status(200).json({message:"updated successfully",changeStatus})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error:error.message})
    }
};

////admin to see a specific user detail such as personal and address on eye button click
////in this admin see a specific user deatil on admin panel customer managemnet eye button click 

const customerinfoData=async(req,res)=>{
    try {
        const{id}=req.params;
        //customer model import
        const checkData= await customerModel.findById(id);
        ///check
        if(!checkData){
            return res.status(400).json({message:"Failed to get data"})
        }

        //return data 
        return res.status(200).json({message:"CustomerInfo",checkData})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:error.message})
    }
}

////customer page search bar
// const customerSearching = async (req, res) => {
//     try {
//         const { search, fromDate, toDate, page = 1, limit = 10 } = req.query;

//         // Parse pagination parameters
//         const pageNumber = parseInt(page, 10) || 1;
//         const pageSize = parseInt(limit, 10) || 10;

//         // Calculate the number of documents to skip
//         const skip = (pageNumber - 1) * pageSize;

//         // Build query object
//         const query = {};
        
//         // Searching options
//         if (search) {
//             query.$or = [
//                 { customerId: { $regex: search, $options: 'i' } },
//                 { "personalInfo.name": { $regex: search, $options: 'i' } }
//             ];
//         }
        
//         // Date-wise search
//         if (fromDate || toDate) {
//             query.createdAt = {};
//             if (fromDate) query.createdAt.$gte = new Date(fromDate);
//             if (toDate) query.createdAt.$lte = new Date(toDate);
//         }

//         // Fetch paginated data
//         const customersData = await customerModel
//             .find(query)
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(pageSize);

//         // Fetch total count for pagination metadata
//         const totalCustomers = await customerModel.countDocuments(query);

//         return res.status(200).json({
//             message: "Data retrieved successfully",
//             data: customersData,
//             meta: {
//                 totalCustomers: totalCustomers,
//                 page: pageNumber,
//                 limit: pageSize,
//                 totalPages: Math.ceil(totalCustomers / pageSize),
//             },
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: error.message });
//     }
// };


///admin to see a specific user booking details,previous bookings
// const previousBookings = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page, 10) || 1; 
//         const limit = parseInt(req.query.limit, 10) || 10; 
//         const skip = (page - 1) * limit;

//         const { id } = req.params; // Fixed typo here

//         // User existence check
//         const userCheck = await customerModel.findById(id);
//         if (!userCheck) {
//             return res.status(404).json({ message: "User Not Found" });
//         }

//         // Check user booking in product order model
//         const userBookingCheck = await productOrder.findOne({ userId: id }); 

//         if (!userBookingCheck) {
//             return res.status(404).json({ message: "No Previous Orders Found" });
//         }

//         // Aggregation pipeline for pagination
//         const pipeline = [
//             {
//                 $match: { userId: id }
//             },
//             {
//                 $sort: { createdAt: -1 }
//             },
//             {
//                 $facet: {
//                     data: [
//                         { $skip: skip },
//                         { $limit: limit }
//                     ],
//                     totalCount: [{ $count: "count" }]
//                 }
//             }
//         ];

//         // Executing pipeline
//         const result = await productOrder.aggregate(pipeline);

//         // Extract data and count
//         const bookings = result[0]?.data || [];
//         const totalCount = result[0]?.totalCount[0]?.count || 0;
//         const totalPages = Math.ceil(totalCount / limit);

//         // Returning response
//         return res.status(200).json({
//             message: "Bookings retrieved successfully",
//             status: true,
//             data: {
//                 bookings: bookings,
//                 pagination: {
//                     currentPage: page,
//                     totalPages: totalPages,
//                     totalItems: totalCount,
//                     perPage: limit,
//                 },
//             },
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: error.message, message: "Internal Server Error" });
//     }
// };


module.exports= {changestatusCustomer,checklistCustomers,customerinfoData}