const cartModel=require('../models/cartModel');
const customerModel=require('../models/customerauthModel');
const productModel=require('../models/newproductaddModel');
const moment = require('moment-timezone');

/////////////////////////In this module you will find all the cart related api for website part//////
// the logics will be product add to cart delete from cart and so on /////

////product add to cart 
// in this to add a product in cart going to be done 
const addtoCart = async (req, res) => {
  try {
    const { userId, productId, quantity, slot, customization, dateAdded, prodimages, prodname, prodprice, totalAmount, productDescription } = req.body;
    
    // User check
    const userCheck = await customerModel.findById(userId);
    if (!userCheck) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Product check
    const productCheck = await productModel.findById(productId);
    if (!productCheck) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    // Check if customization is purchased
    const customizationDetails = customization.map((details) => ({
      name: details.name,
      price: details.price,
      customimages: details.customimages,
      quantity:details.qty
    }));

    // Replace existing cart item for the user with the new one
    await cartModel.findOneAndDelete({ userId });

    // Data save object
    const savingData = new cartModel({
      userId,
      productId,
      quantity,
      slot,
      dateAdded,
      price: prodprice,
      productName: prodname,
      productImage: prodimages,
      productcustomizeDetails: customizationDetails,
      totalAmount,
      productDescription,
    });

    // Save query
    await savingData.save();

    // Check if failed
    if (!savingData) {
      return res.status(400).json({ message: "Failed to add to cart" });
    }

    // Return success
    return res.status(200).json({ message: "Added Successfully", data: savingData });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


/////delete product from cart 
///in this customer can delete or remove the existing product from the cart 
const deletefromCart=async(req,res)=>{
    try {
        const { id } = req.body;
    
        // Find the user's cart
        const cart = await cartModel.findById(id);
    
        if (!cart) {
          return res.status(404).json({ message:"Cart not found for the user",status:404 });
        }
        ///deleting cart data
        const deletePart= await cartModel.findByIdAndDelete(id) 
        ////returning data
        return res.status(200).json({ message: "Product removed from cart successfully", data:deletePart,status:200 });
      } catch (error) {
        console.error("Error deleting product from cart:", error);
        return res.status(500).json({ message: "Internal server error",status:500 });
      }
    
};
/////update cart products 
//in this if a customer wants to change the customization part

const updateCart = async (req, res) => {
  try {
    const { userId, productId, customization, dateAdded, slot,totalAmount } = req.body;

    // Parse customization if it's a string
    const parsedCustomization =
      customization && typeof customization === "string"
        ? JSON.parse(customization)
        : customization;

    // Find the individual cart item for the user and product
    const cartItem = await cartModel.findOne({ userId });
    console.log(cartItem)
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found", status: 404 });
    }

    // Update fields if they exist in request
    if (parsedCustomization) cartItem.productcustomizeDetails = parsedCustomization;
    if (dateAdded) cartItem.dateAdded = dateAdded;
    if (slot) cartItem.slot = slot;
    if(totalAmount) cartItem.totalAmount=totalAmount;

    // Save updated document
    await cartItem.save();

    return res.status(200).json({
      message: "Cart item updated successfully",
      status: 200,
      cartItem,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ message: "Internal server error", status: 500 });
  }
};


////view added products in cart 
///in this user can see the added products in cart
const getCart=async(req,res)=>{
    try {
        const { userId } = req.params;
    
        // Find the cart for the given userId
        const cart = await cartModel.findOne({ userId:userId,isCheckedOut: false }).sort({ createdAt: -1 })

        //check
        if (!cart) {
          return res.status(404).json({ message: "No Product in Cart",status:404 });
        }
        //returning data 
        return res.status(200).json({ message: "Cart retrieved successfully", data:cart,status:200 });
      } catch (error) {
        console.error("Error retrieving cart:", error);
        return res.status(500).json({ message: "Internal server error",status:500 });
      }
};

////slots api for product booking 

const generateSlots = (startHour, endHour) => {
  const slots = [];
  for (let currentHour = startHour; currentHour + 3 <= endHour; currentHour += 3) {
    slots.push({
      startTime: `${currentHour.toString().padStart(2, '0')}:00`,
      endTime: `${(currentHour + 3).toString().padStart(2, '0')}:00`,
      startHour: currentHour
    });
  }
  return slots;
};

const slotList = async (req, res) => {
  try {
    const { date, productId } = req.query;

    if (!date || !productId) {
      return res.status(400).json({ error: 'Date and Product ID are required' });
    }

    const product = await productModel.findById(productId).select("productDetails.estimatedecorativetime");
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let estimatedTime = parseInt(product.productDetails.estimatedecorativetime);
    if (isNaN(estimatedTime) || estimatedTime <= 0) {
      return res.status(400).json({ error: 'Invalid estimated decoration time' });
    }

    const awsNow = moment().tz("Asia/Kolkata");
    const currentHour = awsNow.hours();
    const currentMinutes = awsNow.minutes();
    const bookingDate = moment(date, "YYYY-MM-DD");

    if (!bookingDate.isValid()) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const isToday = bookingDate.isSame(awsNow, 'day');
    let minStartHour = isToday ? Math.max(currentHour + (currentMinutes > 0 ? 1 : 0), 7) : 7;
    const maxEndHour = 22;

    // Updated 24+ hours case
    if (estimatedTime >= 24) {
      if (!isToday) {
        // User selected a future date — show all slots from 7 to 22 for that date
        const availableSlots = generateSlots(7, maxEndHour);
        return res.json({
          message: 'Available slots for selected future date.',
          date: bookingDate.format("YYYY-MM-DD"),
          productId,
          availableSlots
        });
      }

      // Existing logic for today
      let completionTime = moment(awsNow).add(estimatedTime, 'hours');
      let nextAvailableDay = completionTime.format("YYYY-MM-DD");
      let nextAvailableHour = completionTime.hours();

      if (nextAvailableHour >= maxEndHour) {
        nextAvailableDay = moment(nextAvailableDay).add(1, 'days').format("YYYY-MM-DD");
        nextAvailableHour = 7;
      }

      let availableSlots = generateSlots(nextAvailableHour, maxEndHour);
      return res.json({
        message: 'Booking requires a full day. Here are the available slots for the next available day.',
        date: nextAvailableDay,
        productId,
        availableSlots
      });
    }

    // If estimated time is between 16-23
    if (estimatedTime > (maxEndHour - minStartHour) && estimatedTime < 24) {
      if (!isToday) {
        // ✅ User selected future date — show slots for that date
        const availableSlots = generateSlots(7, maxEndHour);
        return res.json({
          message: 'Available slots for selected date.',
          date: bookingDate.format("YYYY-MM-DD"),
          productId,
          availableSlots
        });
      }

      // 🕓 Today doesn't have enough hours — fallback to next available
      let nextAvailableDay = moment(bookingDate).add(1, 'days');
      let nextAvailableHour = 7;
      let retryCount = 0;
      const maxRetries = 10;

      while (retryCount < maxRetries) {
        let completionTime = moment(nextAvailableDay).add(estimatedTime, 'hours');
        let completionHour = completionTime.hours();

        if (completionHour <= maxEndHour) {
          let availableSlots = generateSlots(nextAvailableHour, maxEndHour);
          return res.json({
            message: 'Not enough time today. Here are the next available slots.',
            date: nextAvailableDay.format("YYYY-MM-DD"),
            productId,
            availableSlots
          });
        }

        nextAvailableDay = nextAvailableDay.add(1, 'days');
        retryCount++;
      }

      return res.status(400).json({ error: 'No available slots for the next 10 days. Please try a different date.' });
    }

    // Handle bookings from 1 to 14 hours
    if (estimatedTime <= 14) {
      let availableSlots;
      if (isToday) {
        availableSlots = generateSlots(minStartHour, maxEndHour);
      } else {
        // For future dates, always show all slots from 7 to 22
        availableSlots = generateSlots(7, maxEndHour);
      }

      if (availableSlots.length === 0) {
        return res.status(400).json({ error: 'No available slots for the selected date.' });
      }

      return res.json({
        message: 'Available slots for selected date.',
        date: bookingDate.format("YYYY-MM-DD"),
        productId,
        availableSlots
      });
    }

    // Default fallback
    return res.status(400).json({ error: 'Could not determine suitable slots.' });

  } catch (error) {
    console.error('Error in slot booking API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// const generateSlots = (startHour, endHour) => {
//   const slots = [];
//   for (let currentHour = startHour; currentHour + 3 <= endHour; currentHour += 3) {
//     slots.push({
//       startTime: `${currentHour.toString().padStart(2, '0')}:00`,
//       endTime: `${(currentHour + 3).toString().padStart(2, '0')}:00`,
//       startHour: currentHour
//     });
//   }
//   return slots;
// };

// const slotList = async (req, res) => {
//   try {
//     const { date, productId } = req.query;

//     if (!date || !productId) {
//       return res.status(400).json({ error: 'Date and Product ID are required' });
//     }

//     const product = await productModel.findById(productId).select("productDetails.estimatedecorativetime");
//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     let estimatedTime = parseInt(product.productDetails.estimatedecorativetime);
//     if (isNaN(estimatedTime) || estimatedTime <= 0) {
//       return res.status(400).json({ error: 'Invalid estimated decoration time' });
//     }

//     const awsNow = moment().tz("Asia/Kolkata");
//     const currentHour = awsNow.hours();
//     const currentMinutes = awsNow.minutes();
//     const bookingDate = moment(date, "YYYY-MM-DD");

//     if (!bookingDate.isValid()) {
//       return res.status(400).json({ error: 'Invalid date format' });
//     }

//     const isToday = bookingDate.isSame(awsNow, 'day');
//     let minStartHour = isToday ? Math.max(currentHour + (currentMinutes > 0 ? 1 : 0), 7) : 7;
//     const maxEndHour = 22;

//     // If Estimated Time is 24 hours or more
//     if (estimatedTime >= 24) {
//       let completionTime = moment(awsNow).add(estimatedTime, 'hours');
//       let nextAvailableDay = completionTime.format("YYYY-MM-DD");
//       let nextAvailableHour = completionTime.hours();

//       if (nextAvailableHour >= maxEndHour) {
//         nextAvailableDay = moment(nextAvailableDay).add(1, 'days').format("YYYY-MM-DD");
//         nextAvailableHour = 7;
//       }

//       let availableSlots = generateSlots(nextAvailableHour, maxEndHour);
//       return res.json({
//         message: 'Booking requires a full day. Here are the available slots for the next available day.',
//         date: nextAvailableDay,
//         productId,
//         availableSlots
//       });
//     }

//     // If estimated time is between 16-23
//     if (estimatedTime > (maxEndHour - minStartHour) && estimatedTime < 24) {
//       if (!isToday) {
//         // ✅ User selected future date — show slots for that date
//         const availableSlots = generateSlots(7, maxEndHour);
//         return res.json({
//           message: 'Available slots for selected date.',
//           date: bookingDate.format("YYYY-MM-DD"),
//           productId,
//           availableSlots
//         });
//       }

//       // 🕓 Today doesn't have enough hours — fallback to next available
//       let nextAvailableDay = moment(bookingDate).add(1, 'days');
//       let nextAvailableHour = 7;
//       let retryCount = 0;
//       const maxRetries = 10;

//       while (retryCount < maxRetries) {
//         let completionTime = moment(nextAvailableDay).add(estimatedTime, 'hours');
//         let completionHour = completionTime.hours();

//         if (completionHour <= maxEndHour) {
//           let availableSlots = generateSlots(nextAvailableHour, maxEndHour);
//           return res.json({
//             message: 'Not enough time today. Here are the next available slots.',
//             date: nextAvailableDay.format("YYYY-MM-DD"),
//             productId,
//             availableSlots
//           });
//         }

//         nextAvailableDay = nextAvailableDay.add(1, 'days');
//         retryCount++;
//       }

//       return res.status(400).json({ error: 'No available slots for the next 10 days. Please try a different date.' });
//     }

//     // Handle bookings from 1 to 14 hours
//     if (estimatedTime <= 14) {
//       let availableSlots;
//       if (isToday) {
//         availableSlots = generateSlots(minStartHour, maxEndHour);
//       } else {
//         // For future dates, always show all slots from 7 to 22
//         availableSlots = generateSlots(7, maxEndHour);
//       }

//       if (availableSlots.length === 0) {
//         return res.status(400).json({ error: 'No available slots for the selected date.' });
//       }

//       return res.json({
//         message: 'Available slots for selected date.',
//         date: bookingDate.format("YYYY-MM-DD"),
//         productId,
//         availableSlots
//       });
//     }

//     // Default fallback
//     return res.status(400).json({ error: 'Could not determine suitable slots.' });

//   } catch (error) {
//     console.error('Error in slot booking API:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };


////////////////genrates slots without calculation logic with functon
// Function to generate slots (Fixed 7:00 AM - 10:00 PM)
const generateSlotswithfixedLogic = () => {
  console.log("Generating slots from 07:00 AM to 10:00 PM...");
  const slots = [];
  let currentHour = 7; // Fixed Start Time: 7:00 AM
  const endHour = 22;  // Fixed End Time: 10:00 PM

  while (currentHour + 3 <= endHour) {
    slots.push({
      startTime: `${currentHour.toString().padStart(2, '0')}:00`,
      endTime: `${(currentHour + 3).toString().padStart(2, '0')}:00`,
      startHour: currentHour
    });
    currentHour += 3;
  }
  return slots;
};
const genratesSlotsWithoutCalculation=async(req,res)=>{
  try {
    const slots = generateSlotswithfixedLogic();
    return res.json({ slots });
  } catch (error) {
    console.error('Error generating slots:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports={addtoCart,deletefromCart,getCart,updateCart,slotList,genratesSlotsWithoutCalculation}