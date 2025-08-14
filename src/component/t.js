// const generateSlots = (startHour, endHour) => {
//     console.log("hello solts")
//     const slots = [];
//     let currentHour = startHour;
  
//     while (currentHour + 3 <= endHour) {
//       slots.push({
//         startTime: `${currentHour.toString().padStart(2, '0')}:00`,
//         endTime: `${(currentHour + 3).toString().padStart(2, '0')}:00`,
//         startHour: currentHour
//       });
//       currentHour += 3;
//     }
//     return slots;
//   };
  
//   const slotList = async (req, res) => {
//     try {
//       const { date, productId } = req.query;
  
//       if (!date || !productId) {
//         return res.status(400).json({ error: 'Date and Product ID are required' });
//       }
  
//       const product = await productModel.findById(productId);
//       if (!product) {
//         return res.status(404).json({ error: 'Product not found' });
//       }
  
//       let estimatedTime = parseInt(product.productDetails.estimatedecorativetime);
//       if (isNaN(estimatedTime) || estimatedTime <= 0) {
//         return res.status(400).json({ error: 'Invalid estimated decoration time' });
//       }
  
//       /* GET CURRENT TIME FROM AWS SERVER & CONVERT TO DESIRED TIMEZONE */
//       const awsNow = moment().tz("Asia/Kolkata");
//       const currentHour = awsNow.hours();
//       const currentMinutes = awsNow.minutes();
//       const bookingDate = moment(date, "YYYY-MM-DD");
  
//       if (!bookingDate.isValid()) {
//         return res.status(400).json({ error: 'Invalid date format' });
//       }
  
//       const isToday = bookingDate.isSame(awsNow, 'day');
//       let minStartHour = isToday ? currentHour + (currentMinutes > 0 ? 1 : 0) : 7;
//       const maxEndHour = 22;
  
//       /* HANDLE MULTI-DAY BOOKINGS WITH CALCULATED TIME */
//       if (estimatedTime >= 24) {
//         let completionTime = moment(awsNow).add(estimatedTime, 'hours');
//         let nextAvailableDay = completionTime.format("YYYY-MM-DD");
//         let nextAvailableHour = completionTime.hours();
//         let availableSlots;
        
//         while (nextAvailableHour >= maxEndHour) {
//           nextAvailableDay = moment(nextAvailableDay).add(1, 'days').format("YYYY-MM-DD");
//           nextAvailableHour = 7;
//         }
//         availableSlots = generateSlots(nextAvailableHour, maxEndHour);
        
//         return res.json({
//           message: 'Booking requires a full day. Here are the available slots for the next available day.',
//           date: nextAvailableDay,
//           productId,
//           availableSlots
//         });
//       }
  
//       /* HANDLE CASE: Not Enough Time Left Today → Move to Next Day */
//       if (estimatedTime > (maxEndHour - minStartHour)) {
//         let nextDay = moment(bookingDate).add(1, 'days');
//         while (estimatedTime > (maxEndHour - 7)) {
//           nextDay = nextDay.add(1, 'days');
//         }
//         const nextDaySlots = generateSlots(7, maxEndHour);
//         return res.json({
//           message: 'Not enough time available today. Here are the available slots for the next available day.',
//           date: nextDay.format("YYYY-MM-DD"),
//           productId,
//           availableSlots: nextDaySlots
//         });
//       }
  
//       /* HANDLE CASE: Calculate Slots AFTER Current Booking */
//       let availableSlots = generateSlots(minStartHour, maxEndHour);
//       availableSlots = availableSlots.filter(slot => slot.startHour >= minStartHour + estimatedTime);
  
//       if (availableSlots.length === 0) {
//         return res.status(400).json({ error: 'No available slots for the selected date.' });
//       }
  
//       return res.json({ date, productId, availableSlots });
  
//     } catch (error) {
//       console.error('Error in slot booking API:', error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//   };


let a="ssss"

console.log(a?.toString()?.trim());
console.log(a.toUpperCase())