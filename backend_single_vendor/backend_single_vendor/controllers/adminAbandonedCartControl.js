const cartModel=require('../models/cartModel');
const abandonedNotificationModel=require('../models/abndonedNotification');
const customerModel=require('../models/customerauthModel');
const admin = require("firebase-admin");
const serviceAccount = require("../firebase-admin/firebase-adminsdk.json");
/////service account starting 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
////////////////////////////////admin abandoned cart managemnet//////////////////////////////////////////
//in this admin can list view of customers who have added products and didn't checkout also admin can send push notification to such users

const cartcustomerList = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const { search, fromDate, toDate } = req.query;
      
      let matchQuery = { isCheckedOut: false };

      // Search functionality
      if (search) {
          matchQuery.$or = [
              { productName: { $regex: search, $options: "i" } },
              { productDescription: { $regex: search, $options: "i" } }
          ];
      }

      // Date filtering
      if (fromDate || toDate) {
          let from = fromDate ? new Date(fromDate) : null;
          let to = toDate ? new Date(toDate) : null;

          if (from && isNaN(from.getTime())) {
              return res.status(400).json({ message: "Invalid fromDate format", status: false });
          }
          if (to && isNaN(to.getTime())) {
              return res.status(400).json({ message: "Invalid toDate format", status: false });
          }

          if (from && to) {
              matchQuery.createdAt = {
                  $gte: new Date(from.setHours(0, 0, 0, 0)),
                  $lte: new Date(to.setHours(23, 59, 59, 999))
              };
          } else if (from) {
              matchQuery.createdAt = { $gte: new Date(from.setHours(0, 0, 0, 0)) };
          } else if (to) {
              matchQuery.createdAt = { $lte: new Date(to.setHours(23, 59, 59, 999)) };
          }
      }

      const pipeline = [
          { $match: matchQuery },
          { $sort: { createdAt: -1 } },
          {
              $lookup: {
                  from: "customerinfos",
                  localField: "userId",
                  foreignField: "_id",
                  as: "customerDetails"
              }
          },
          {
              $unwind: {
                  path: "$customerDetails",
                  preserveNullAndEmptyArrays: true
              }
          },
          {
            $project: {
                "_id": 1,  
                "customerDetails.customerId": 1,
                "customerDetails.phone": 1,
                "customerDetails.personalInfo.name": 1,
                "userId": 1,
                "productId": 1,
                "productName": 1,
                "productDescription": 1,
                "quantity": 1,
                "price": 1,
                "dateAdded": 1,
                "slot": 1,
                "productImage": 1,
                "productcustomizeDetails": 1,
                "isNotified": 1,
                "isCheckedOut": 1,
                "totalAmount": 1,
                "createdAt": 1,
                "updatedAt": 1
            }
        },
          {
              $facet: {
                  data: [
                      { $skip: skip },
                      { $limit: limit }
                  ],
                  totalCount: [
                      { $count: "count" }
                  ]
              }
          }
      ];

      // Executing pipeline
      const result = await cartModel.aggregate(pipeline);

      // Extract data and count
      const cart = result[0]?.data || [];
      const totalCount = result[0]?.totalCount[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);

      // Check if no data found
      if (cart.length === 0) {
          return res.status(200).json({
              message: "No data found",
              status: 200,
              data: {
                  cart: [],
                  pagination: {
                      currentPage: page,
                      totalPages,
                      totalItems: totalCount,
                      perPage: limit
                  }
              }
          });
      }

      // Returning documents
      return res.status(200).json({
          message: "Retrieved successfully",
          status: 200,
          data: {
              cart,
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
      return res.status(500).json({ message: "Something went wrong", error: error.message, status: false });
  }
};

/////cart eye button product info
////in this a detail view of cart added items

const viewAddedCartItem=async(req,res)=>{
  try {
    const{id}=req.params;
    //checking data from db
    const addedItems= await cartModel.findById(id);
    //check
    if(!addedItems){
      return res.status(200).json({message:"Failed to retreieve dataa"});
    }
    ////returning data 
    return res.status(200).json({message:"Data retreive successfully",data:addedItems,status:true});
  } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something wrong",error:error.message,status:false});
  }
}

// const viewAddedCartItem= aysnc(req,res)=>{
//   try {
//     const{id}=req.params;
//     const pipeline=[{
//       $match:
//       {id:_id}
//     },{
//       $lookup:{
//         from:"productorders",
//         localField:"productId",
//         foreignField:"id",
//         as:"data"
//       }
//     },
//     {
//       $unwind:"$data"
//     },{
//       $project:{
//         _id:0,
//         "data."
//       }
//     }
//   ]
//   } 
//   catch (error) {
//     console.log(error);
//     return res.status(500).json({message:"Something wrong",error:error.message})
//   }
// }

///searchbar api 

const cartSearching = async (req, res) => {
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
              { userId: { $regex: search, $options: 'i' } },
              { "items.productName": { $regex: search, $options: 'i' } },
          ];
      }

      // Date-wise search
      if (fromDate || toDate) {
          query.createdAt = {};
          if (fromDate) query.createdAt.$gte = new Date(fromDate);
          if (toDate) query.createdAt.$lte = new Date(toDate);
      }

      // Fetch paginated data
      const cartData = await cartModel
          .find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageSize);

      // Fetch total count for pagination metadata
      const totalCarts = await cartModel.countDocuments(query);

      return res.status(200).json({
          message: "Data retrieved successfully",
          data: cartData,
          meta: {
              total: totalCarts,
              page: pageNumber,
              limit: pageSize,
              totalPages: Math.ceil(totalCarts / pageSize),
          },
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
  }
};

/////////////////notify all users existed in abandoned cart
const notifyAllUsers = async (req, res) => {
  try {
    // Notification title and body
    const title = "Checkout the products";
    const body = "Products are waiting for you";

    // Pipeline to get FCM tokens
    const pipeline = [
      {
        $lookup: {
          from: "customerinfos",
          localField: "userId",
          foreignField: "_id",
          as: "data",
        },
      },
      {
        $project: {
          "data.fcmToken": 1,
          userId: 1, 
        },
      },
    ];

    // Executing the pipeline
    const result = await cartModel.aggregate(pipeline);

    // Extract FCM tokens and map userId for notifications
    const usersWithTokens = result
      .map(item => ({
        userId: item.userId,
        fcmToken: item.data[0]?.fcmToken,
      }))
      .filter(item => item.fcmToken);

    if (usersWithTokens.length === 0) {
      return res.status(404).json({ message: "No FCM tokens found", status: 404 });
    }

    // Construct notification payload
    const payload = {
      notification: {
        title,
        body,
      },
    };

    // Send notifications and track results
    const responses = await Promise.allSettled(
      usersWithTokens.map(user =>
        admin
          .messaging()
          .sendToDevice(user.fcmToken, payload)
          .then(() => user.userId) 
      )
    );

    // Separate successful and failed notifications
    const successes = responses
      .filter(res => res.status === "fulfilled")
      .map(res => res.value); 

    const failures = responses.filter(res => res.status === "rejected");

    // Update `isNotified` field for successful notifications
    if (successes.length > 0) {
      await cartModel.updateMany(
        { userId: { $in: successes } },
        { $set: { isNotified: true } }
      );
    }

    // Return response summary
    return res.status(200).json({
      message: "Notifications sent",
      successCount: successes.length,
      failureCount: failures.length,
      failures: failures.map(failure => ({
        error: failure.reason.message,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      status: 500,
    });
  }
};


// const notifyAllUsers = async (req, res) => {
//   try {
//     // Notification title and body
//     const title = "Checkout the products";
//     const body = "Products are waiting for you";

//     // Pipeline to get FCM tokens
//     const pipeline = [
//       {
//         $lookup: {
//           from: "customerinfos",
//           localField: "userId",
//           foreignField: "_id",
//           as: "data",
//         },
//       },
//       {
//         $project: {
//           "data.fcmToken": 1,
//           "data._id":1
          
//         },
//       },
//     ];

//     // Executing the pipeline
//     const result = await cartModel.aggregate(pipeline);

//     // FCM tokens check 
//     const fcmTokens = result
//       .map(item => item.data[0]?.fcmToken)
//       .filter(token => token); 

//     if (fcmTokens.length === 0) {
//       return res.status(404).json({ message: "No FCM tokens found", status: 404 });
//     }

//     // Construct notification payload
//     const payload = {
//       notification: {
//         title,
//         body,
//       },
//     };

//     // Send notifications to all FCM tokens
//     const responses = await Promise.allSettled(
//       fcmTokens.map(token =>
//         admin.messaging().sendToDevice(token, payload)
//       )
//     );

//     //  successful and failed notifications
//     const successes = responses.filter(res => res.status === "fulfilled");
//     const failures = responses.filter(res => res.status === "rejected");

//     ///if condition become successupdate isNotified key in abandoned cart modelof that particular user in data
//     if(successes){
//       const cartDta= cartModel.find({userId:result._id})
//       cartDta.isNotified=true
//     }

//     return res.status(200).json({
//       message: "Notifications sent",
//       successCount: successes.length,
//       failureCount: failures.length,
//       failures: failures.map(failure => ({
//         error: failure.reason.message,
//       })),
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message,
//       status: 500,
//     });
//   }
// };
// [
//   {
//     $lookup: {
//       from: "customerinfos",
//       localField:"userId",
//       foreignField:"_id",
//       as:"data"
//     }
//   },
//   {
//       $unwind: "$data",
//     },
//   {
//       $match: {
//         $expr: {
//           $eq: ["$userId", "$data._id"],
//         },
//       },
//     },
//   {
//     $project: {
//       "data.fcmToken":1,
//       "data._id":1,
//       userId:1
      
//     }
//   }
//    ]

module.exports={
    cartcustomerList,viewAddedCartItem,cartSearching,notifyAllUsers
}