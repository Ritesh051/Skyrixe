const express= require('express')
const router=express.Router()
// const rateLimit = require('express-rate-limit');

// const slotBookingLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 10, // Limit each IP to 10 requests per windowMs
//   message: { error: 'Too many requests, please try again later.' },
//   headers: true, // Include rate limit info in response headers
// });
///////customer auth import///////////////////
const{customerPersonalData,customerhomeaddressData,customerphoneVerification,customerofficeaddressData, verifyOtp, resendOtp}=require('../auth/customerAuth')
////////////////////custoemr other routes import//
const{customerDataUpdate,customerProfileInfo,getAllCustomerAddresses,deleteCustomerAddress,addCustomerAddress,updateCustomerAddress}=require('../controllers/customerControl')
///customer banner,deal-banner and categories list impirt
const{categoryList,bannerList,dealbannerList,catsubcatList}=require('../controllers/customerCategory&Banner')
////products list import for website
const{birthdayitemList,anniversaryitemList,kidsitemList,ballonsitemList, detailedproductView, cityApi}=require('../controllers/customerProductsList')
///customer review and rating import
const{reviewOrRatingAdd,reviewOrRatingView,productRatingDetails}=require('../controllers/customerReview&RatingControl')
//// static control import
// const{aboutgetData,termgetData, privacygetData,contactGet}=require('../controllers/adminStaticControl')

///cart control in website import
const{addtoCart,deletefromCart,updateCart, getCart,slotList,genratesSlotsWithoutCalculation}=require('../controllers/customerCart')

///prodcut order part controles import
const{createOrder,previousOrder,upcomingBooking, cancelBooking,createCODOrder}=require('../controllers/customerProductOrder')

////category wise product listing 
const{productListing}=require('../controllers/customerDropDownProduct')

///searchbar api for landing page of website 
const{searchProductCategory}=require('../controllers/customerSearchbarCategoryWise')

/////////paymet part api import 
const{ createPaymentOrder,handleWebhook }=require('../controllers/customerPayment');


//////////////////////////////3 routes of customer registration///////////////////////////////////
///for sending phone number 

router.post('/checking-phone',customerphoneVerification);

//for otp verification
router.post('/verifyOtp-phone',verifyOtp)

///resend otp 
router.post('/resendOtp',resendOtp)

//for sending customer personal data 
router.post('/:userId/customerdata',customerPersonalData);

//for sending customer home address info

router.post('/:userId/customeraddress',customerhomeaddressData);


//////////////////////////////////other routes////////////////////////////////////////////////////////


//route for fetching custoemr informtion according to id 

///route for profile detail view
router.get('/userdata/:id',customerProfileInfo);

//route for updation of customer data 
router.patch('/userupdation/:id',customerDataUpdate);

///for saving customer office address info
router.post('/:userId/customerofficeaddress',customerofficeaddressData);

///for checking previous bookings
router.get('/customer-previous',previousOrder);

///for checking upcoming booking
router.get('/customer-upcoming',upcomingBooking);

///for multiple addresss insertion
router.post('/customermultipleaddress/:userId',addCustomerAddress);

///for updation of address
router.put('/updateaddress/:userId/:addressId',updateCustomerAddress);

///for delete of address
router.delete('/deleteparticluaraddress/:userId/:addressId',deleteCustomerAddress)

///for listing of address of users
router.get('/getaddresslisting/:userId',getAllCustomerAddresses);

///////////////////////deal-banner,banner and categories////////////////////////////////////////////

///category list for website
router.get('/categorylist',categoryList);

////deal-banner list for webiste
router.get('/dealbannerlist',dealbannerList);

///banner list for website
router.get('/bannerlist',bannerList)

///category and sub-category list
router.get('/catsubcatlist',catsubcatList);


///////////////////4 categories products item list for webiste api//////////////////////////////////
/////added city list api in these routes 
///birthday decoration products
router.get('/birthdayDecoration/:city',birthdayitemList);

///anniversay decoration products
router.get('/anniversayDecoartion/:city',anniversaryitemList);

///kids decoration products
router.get('/kidsDecoration/:city',kidsitemList);

//ballons decoartion produts
router.get('/ballonsWholesale/:city',ballonsitemList);

////api for product details view
router.get('/detailproductview/:id',detailedproductView);

///api for getting city list
router.get('/citylist',cityApi)


//////////////////////////////customer review and rate part routes/////////////////////////////////

///insert rating or review
router.post('/writeReview',reviewOrRatingAdd);

////get list of ratings or reviews
router.get('/getlistReview',reviewOrRatingView)

//get count of product reviews and rating 
router.get('/getcountData/:id',productRatingDetails)

///////////////////////static control routes//////////////////////////////////////////////

///about us get data
// router.get('/aboutget',aboutgetData);

///privacy get dta 
// router.get('/privacyget',privacygetData);

///term and conditon get
// router.get('/termget',termgetData);

////////////////////////cart control routes for website/////////////////////////////

///add product in cart 
router.post('/addtocart',addtoCart);

//delete product from cart
router.delete('/deletefromcart',deletefromCart);

///update product count of existing product 
router.put('/updateproductCart/:id',updateCart);

///get dta from cart
router.get('/getproduct/:userId',getCart);
///slots list 
router.get('/getslot',slotList)

//slots list without calculation
router.get('/getslotswithoutcalculate',genratesSlotsWithoutCalculation)

//////////////////////////////////product order routes///////////////////////////////////////////

////order creation 
router.post('/createOrder/:orderId',createOrder);

/////cod order creation
router.post('/createcodOrder',createCODOrder)

///order cancel
router.patch('/cancelOrder',cancelBooking);

///previous order list
router.get('/previousordercustomer/:userId',previousOrder);

//upcoming order list
router.get('/upcomingordercustomer/:userId',upcomingBooking)


///////////////////////////////product list according to category and sub-categroy selection//////////
router.post('/getproductListing',productListing)

//////////////////////searchbar api for search of product category wise///////////////////////
router.get('/getproductcategory',searchProductCategory)


////////////////////////////customer payment api///////////////////////////////////////////////////////

///for orderid generation
router.post('/paymentProcess',createPaymentOrder)

///verify order api
router.post('/paymentwebhook',handleWebhook)

module.exports= router