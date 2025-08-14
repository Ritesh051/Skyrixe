// // let a="67480646763d4bdb15253baacustomeraddress"
// // console.log(a?.endsWith("customeraddress"))

// var findMaxConsecutiveOnes = function (nums) {
//   let count = 0,
//     temp = 0;

//   // [1,0,1,1,1,3,1,1,1,1,1]
//   for (let i = 0; i < nums.length; i++) {
//     if (nums[i] == 1) {
//       temp += 1;
//     } else {
//       count = temp > count ? temp : count;
//       temp = 0;
//     }
//   }
//   count = temp > count ? temp : count;
//   return count;
// };

// let x = [
//   1, 1, 1, 1, 1, 0, 1, 3, 1, 1, 1, 6, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
// ];

// let len = findMaxConsecutiveOnes(x);

// console.log(len);

// var maxProfit = function (prices) {
//   let minTemp = prices[0];
//   let maxTemp = 0;
//   let tempAddr = 0;
//   for (let i = 0; i < prices.length; i++) {
//     if (minTemp > prices[i]) {
//       minTemp = prices[i];
//       tempAddr = i + 1;
//     }
//   }
//   if (tempAddr == prices?.length) {
//     return 0;
//   } else {
//     for (let j = tempAddr; j < prices?.length; j++) {
//       if (maxTemp < prices[j]) {
//         maxTemp = prices[j];
//       }
//     }
//    return maxTemp-minTemp;
//   }
// };

// let prices = [7, 8, 5, 3, 6, 4, 1];

// let maxNum = maxProfit(prices);

// console.log(maxNum,"maxNum")

// let arr1=[{name:"ram",age:"21"},{name:"rohan",age:"21"}]
// console.log([{ ...arr1?.[0], name: "shyam" }, ...arr1.slice(1)|| []]);



//  function convertTimeFormat(startDate, endDate) {
//     function formatTime(time) {
//       let [hours, minutes] = time.split(":").map(Number);
//       const period = hours >= 12 ? "PM" : "AM";
//       hours = hours % 12 || 12;
//       return `${hours.toString().padStart(2, "0")}:${minutes
//         .toString()
//         .padStart(2, "0")} ${period}`;
//     }
  
//     const startTimeFormatted = formatTime(startDate);
//     const endTimeFormatted = formatTime(endDate);
  
//     return `${startTimeFormatted} - ${endTimeFormatted}`;
//   }


// let availableSlot = [
//     { startTime: "11:00", endTime: "13:00", startHour: 11 },
//     { startTime: "13:00", endTime: "15:00", startHour: 13 },
//     { startTime: "15:00", endTime: "17:00", startHour: 15 },
//     { startTime: "17:00", endTime: "19:00", startHour: 17 },
//     { startTime: "19:00", endTime: "21:00", startHour: 19 }
// ];

// availableSlot?.map((item,i)=>{

// console.log(convertTimeFormat(item?.startTime,item?.endTime))
// })


// let availableSlots = [
//     { startTime: "11:00", endTime: "01:00", startHour: 11 },
//     { startTime: "01:00", endTime: "03:00", startHour: 13 },
//     { startTime: "03:00", endTime: "05:00", startHour: 15 },
//     { startTime: "05:00", endTime: "07:00", startHour: 17 },
//     { startTime: "07:00", endTime: "09:00", startHour: 19 }
// ];


let a=["we","we","wqe","wqe","qwe","we","we","wqe","wqe","qwe"];


a?.map((item,i)=>{
 if(i%2==0){
  console.log(i%2);
 }
})


let arr=[1,2,3]
console.log(arr.includes(3))





