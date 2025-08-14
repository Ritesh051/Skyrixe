const notificationModel=require('../models/notification');
const customerModel=require('../models/customerauthModel');
const admin = require("firebase-admin");
// const serviceAccount = require("../firebase-admin/firebase-adminsdk.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

/////////////////////////Notification Management module///////////////////////////////////////////
///in this part sending notification will be done for all users 

const creatingNotification = async (req, res) => {
    try {
        const { title, body, userType } = req.body;

        //  FCM tokens of active customers only
        const customerData = await customerModel.find({ isActive: true }, { fcmToken: 1 });

        // Collecting all FCM tokens into an array
        const fcmTokens = customerData.map(customer => customer.fcmToken);

        // Preparing notification data
        const notificationData = {
            title: title,
            body: body,
            userType: userType,
            userNumbers: fcmTokens.length.toString(),
            fcmTokens: fcmTokens,
        };

        // Saving the notification 
        const savedNotification = await notificationModel.create(notificationData);

        // Check if saving failed
        if (!savedNotification) {
            return res.status(400).json({ message: "Failed to create notification", status: 400 });
        }

        // Returning saved data
        return res.status(200).json({ message: "Created Successfully", data: savedNotification, status: 200 });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", status: 500 });
    }
};


////get list of created notification

const getNotificationList = async (req, res) => {
    try {
      // Extracting query parameters with default values
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;
  
      //  pipeline
      const pipeline = [
        {
          $match: {}, 
        },
        {
          $sort: { updatedAt: -1 }, 
        },
        {
          $facet: {
            data: [
              { $skip: skip }, 
              { $limit: limit }, 
            ],
            totalCount: [
              { $count: "count" }, 
            ],
          },
        },
      ];
  
      // Executing the pipeline
      const result = await notificationModel.aggregate(pipeline);
  
      //  data and count
      const notification = result[0]?.data || [];
      const totalCount = result[0]?.totalCount[0]?.count || 0;
      const totalPages = Math.ceil(totalCount / limit);
  
      // Check if no notifications found
      if (notification.length === 0) {
        return res.status(200).json({
          message: "No notifications found",
          status: 200,
          data: {
            notification: [],
            pagination: {
              currentPage: page,
              totalPages: totalPages,
              totalItems: totalCount,
              perPage: limit,
            },
          },
        });
      }
  
      // Returning documents with pagination
      return res.status(200).json({
        message: "Notifications retrieved successfully",
        status: 200,
        data: {
          notification: notification,
          pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalItems: totalCount,
            perPage: limit,
          },
        },
      });
    } catch (error) {
      console.error( error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", status: 500 });
    }
  };

  
///////edit notification part
const editNotification=async(req,res)=>{
    try {
        const{id}=req.params;
        const{title,body}=req.body;
        ////update object
        const updateObj={};

        ///check if title need to update
        if(title){
            updateObj.title=title;
        }
        ///check if body needs update only
        if(body){
            updateObj.body=body;
        }

        ////update query
        const updateSet=await notificationModel.findByIdAndUpdate(
            id,
            {$set:updateObj},
            {new:true}
        );

        ///check if failed
        if(!updateSet){
            return res.status(400).json({message:"failed to update",status:400});
        }
        ///check if successs
        return res.status(200).json({message:"updated successfully",data:updateSet,status:200});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", status: 500 });

    }
}

/////delete notification part
const deleteNotification=async(req,res)=>{
    try {
        const{id}=req.params;

        const deleteQuery=await notificationModel.findByIdAndDelete(id);
        ///check if failed
        if(!deleteQuery){
            return res.status(400).json({message:"Failed to Delete",status:400});
        }
        ///returning dta
        return res.status(200).json({message:"Deleted Successfully",status:200})
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error", status: 500 });
    }
}


/////sending notification to all users
const sendNotification = async (req, res) => {
    try {
      // Fetch all notifications 
      const notifications = await notificationModel.find({ isNotified: false });
        ///checking the ntoification data if available
      if (notifications.length === 0) {
        return res.status(404).json({ message: "No new notifications to send", status: 404 });
      }
  
      // maaping data
      const results = await Promise.all(
        notifications.map(async (notification) => {
          const message = {
            notification: {
              title: notification.title,
              body: notification.body,
            },
            token: notification.fcmTokens, 
          };
  
          try {
            // Send push notification 
            const response = await admin.messaging().send(message);
  
            // Update the notification as sent
            await notificationModel.findByIdAndUpdate(notification._id, { isNotified: true });
  
            return { success: true, notificationId: notification._id, response };
          } catch (error) {
            console.error("Failed to send notification:", error.message);
            return { success: false, notificationId: notification._id, error: error.message };
          }
        })
      );
  
      // Return the result of all push notifications
      return res.status(200).json({
        message: "Notifications processed",
        data: results,
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error", status: 500 });
    }
};
// const admin = require("firebase-admin");
// const notificationSchemaData = require("./path-to-notification-model"); // Import your model

// // Initialize Firebase Admin SDK
// const serviceAccount = require("./path-to-firebase-service-account.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const sendPushNotification = async (req, res) => {
//   try {
//     // Fetch all notifications where `isNotified` is false
//     const notifications = await notificationSchemaData.find({ isNotified: false });

//     if (notifications.length === 0) {
//       return res.status(404).json({ message: "No new notifications to send", status: 404 });
//     }

//     // Iterate over notifications and send push notification
//     const results = await Promise.all(
//       notifications.map(async (notification) => {
//         const message = {
//           notification: {
//             title: notification.title,
//             body: notification.body,
//           },
//           token: notification.fcmToken, // Target user's FCM token
//         };

//         try {
//           // Send push notification using Firebase Admin SDK
//           const response = await admin.messaging().send(message);

//           // Update the notification as sent
//           await notificationSchemaData.findByIdAndUpdate(notification._id, { isNotified: true });

//           return { success: true, notificationId: notification._id, response };
//         } catch (error) {
//           console.error("Failed to send notification:", error.message);
//           return { success: false, notificationId: notification._id, error: error.message };
//         }
//       })
//     );

//     // Return the result of all push notifications
//     return res.status(200).json({
//       message: "Notifications processed",
//       data: results,
//       status: 200,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error", status: 500 });
//   }
// };

// module.exports = { sendPushNotification };


module.exports={creatingNotification,getNotificationList,editNotification,sendNotification,deleteNotification}