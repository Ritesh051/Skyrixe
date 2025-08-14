const express= require('express');
const router = express.Router();
////admin auth data import
const{adminphoneVerification, signup,updatePassword,adminDetails,profileView}=require('../auth/adminAuth');      
/////admin-customer data import
const{changestatusCustomer,checklistCustomers,customerinfoData}=require('../controllers/adminCustomerControl');
///admin category  import
const{categoryInsert,categoryDelete,categoryUpdate,categoryList,categorySearching,categoryListFull}=require('../controllers/adminCategoryControl')
//admin subcategory insrt
const{subcategoryInsert,subcategoryDelete,subcategoryUpdate,subcategoryList,subcategorySearching, categoriesDrop}=require('../controllers/adminSubCategoryControl')
//admin product imort
const{getallProducts,getsingleProduct,addnewProduct,updatesingleProduct,deletesingleProduct,productSearching}=require('../controllers/adminProductControl')

///admin banner model imort
const {bannerAdd, bannerUpdate, bannerDelete, bannerSearching,bannerList}=require('../controllers/adminBannerControl')

///admin deal banner 
const{dealbannerAdd, dealbannerUpdate, dealbannerDelete, dealbannerSearching,dealbannerList}=require('../controllers/adminDealBannerControl')

///admin booking managemnet routes
const{viewcustomerOrders,updateDecoratorDetails,cancelOrder,newBooking,updateSubStatus,completedOrdersView}=require('../controllers/adminBookingControl')

///admin abandoned cart routes import 
const{cartcustomerList,viewAddedCartItem, cartSearching}=require('../controllers/adminAbandonedCartControl')

///admin city managemnet routes import 
const{updateCity,addCity,deleteCity,viewcityList}=require('../controllers/admincityManagementControl')

/////////////admin payment control
const{paymentList, paymentSearching}=require('../controllers/adminPaymentControl')

///////customer previous booking checking
const{previousOrder}=require('../controllers/customerProductOrder')

//////admin notification management part
const{creatingNotification,getNotificationList,editNotification,sendNotification, deleteNotification}=require('../controllers/adminNotification')

///admin dashboard count 
const{dashboardData}=require('../controllers/adminDashboard')

////admin cutsom products api
const{craeteCustom,deleteCustom,updateCustom,listingCustom}=require('../controllers/adminCustomProduct');

///admin report page api
const{userReport,revenueReport,topsellingReport,leastsellingReport,totalsalesReport}=require('../controllers/adminReport')

////admin static control import
const{aboutgetData,aboutusInsert,aboutusupdateData,privacyInsert,privacygetData,privacyupdatData,
    termInsert,termgetData,termupdatData,contactInsert,contactUpdate,contactGet,policyGet,policyInsert,policyUpdate,
    faqInsert,
    faqGet,
    faqUpdate
}=require('../controllers/adminStaticControl');

///token verify 
const verifyToken=require('../middlewares/tokenVerify');

////multer middlewareimort
// const multerSetup = require('../Multer_setup/uploadData'); 

// const upload = multerSetup( ['image/jpeg', 'image/png'], 5 * 1024 * 1024); // 5MB max size

/////////////////////////////////admin login and signup routes//////////////////////////
///admin signup
router.post('/admin-signup',adminphoneVerification)

router.post('/admin',signup)

///admin password update
router.patch('/updatePassword',verifyToken,updatePassword)

///admin details add 
router.patch('/addDetails/:id',verifyToken,adminDetails)

///view profile 
router.get('/viewadmin/:id',verifyToken,profileView)

///verify otp
// router.post('/admin-verifyotp',verifyOtp)

//admin login
// router.post('/admin-login',adminLogin)



/////////////////////////////////////admin customer control/////////////////////////

///admin to check all customers
router.get('/customers-list',verifyToken,checklistCustomers);

///admin to update customer status (isActive field)
router.patch('/customer-update/:id',verifyToken,changestatusCustomer)

///admin to check customer info on id basis
router.get('/customer-info/:id',verifyToken,customerinfoData)

///admin to see previous bookings by customer
router.get('/customer-previous/:userId',verifyToken,previousOrder)


///customer page serach bar
// router.get('/customer-searchbar',customerSearching);


/////////////////////////////////admin product category and sub-category mangemnt routes////////////////////////////////////////////////

///////////////////category////////////////////
//admin category insert 
router.post('/category-insert',verifyToken, categoryInsert);

//admin category delete
router.delete('/category-delete/:id',verifyToken,categoryDelete)

///admin update category
router.patch('/category-update/:id',verifyToken,categoryUpdate)

///admin view category list paginated 
router.get('/category-list',verifyToken,categoryList)

///admin to see category list without paginated in dropdown
router.get('/categorylisting',verifyToken,categoryListFull)

//admin serach bar on category list
router.get('/category-searchbar',verifyToken,categorySearching)

/////////////////////////sub-category////////////////////////
//admin sub category insert
router.post('/subcategory-insert',verifyToken,subcategoryInsert)

//admin sub category delete
router.delete('/subcategory-delete/:id',verifyToken,subcategoryDelete);

//admin sub category update
router.patch('/subcategory-update/:id',verifyToken,subcategoryUpdate)

//admin sub ctaegory list
router.get('/subcategory-list/:id',verifyToken,subcategoryList)

///admin sub-category search
router.get('/subcategory-searchbar',verifyToken,subcategorySearching)

///admin to see category list in dropdown in add sub-category part
router.get('/dropdownlist',verifyToken,categoriesDrop)

//////////////////admin product related routes add,view,update and delete////////////////////////////

////get all products 
router.get('/getall-products',verifyToken,getallProducts)

//get single product by id
router.get('/getsingle-product/:id',verifyToken,getsingleProduct)

//update product details
router.patch('/updatedetils-product/:id',verifyToken,updatesingleProduct)

//add new product 
router.post('/addnew-product',verifyToken,addnewProduct);

//delete product by id 
router.delete('/deleteOne-product/:id',verifyToken,deletesingleProduct)

///search bar 
// router.get('/product-searchbar',verifyToken,productSearching)

//////////////////////////////////admin custom products api//////////////////////////////////////
///create custom 
router.post('/createCustom',verifyToken,craeteCustom);

///delete custom 
router.delete('/deleteCustom/:id',verifyToken,deleteCustom);

//update custom 
router.put('/updateCustom/:id',verifyToken,updateCustom);

//listing custom 
router.get('/listingCustom',verifyToken,listingCustom);

/////////////////////////////////admin add,view,update and delete banner managemnet routes/////////////////

//////////////banner routes////////////////
//add banner 
router.post('/addBanner',verifyToken,bannerAdd)

///update banner
router.put('/updateBanner/:id',verifyToken,bannerUpdate)

///delete banner
router.delete('/deleteBanner/:id',verifyToken,bannerDelete)

///searching banner 
router.get('/banner-searchbar',verifyToken,bannerSearching)

///list bnners
router.get('/bannerlist',verifyToken,bannerList)

//////////////////////deal banner routes///////

//add banner
router.post('/adddealBanner',verifyToken,dealbannerAdd)

//update banner
router.put('/updatedealBanner/:id',verifyToken,dealbannerUpdate)

//delete banner
router.delete('/deletedealBanner/:id',verifyToken,dealbannerDelete)

///searching banner
router.get('/dealbanner-searchbar',verifyToken,dealbannerSearching)

///list deal banner
router.get('/dealbannerlist',verifyToken,dealbannerList);

/////////////////////////////////admin to see ordered products from customer//////////////////////

//get all order list 
router.get('/orderslist/:status',verifyToken,viewcustomerOrders)

////update substatus of product
router.patch('/updateSubStatus/:id',verifyToken,updateSubStatus)

///update a product decorator partner details
router.patch('/updateDecorator/:id',verifyToken,updateDecoratorDetails)

//cancel customer order
router.patch('/cancelOrder/:id',verifyToken,cancelOrder)
///view oder details
router.get('/viewdetails/:id',verifyToken,completedOrdersView)


///view cancelled orders list
// router.get('/cancelledOrders',cancelledOrders)

///view completed orders list
// router.get('/completedOrders',completedOrders)

///boking control search bar 
// router.get('/orders-searchbar',bookingSearching)

//////////////////////////admin abandoned cart control routes/////////////////////////////////////////

///list of customers who added products in cart
router.get('/customerabandonedlist',verifyToken,cartcustomerList);

//detail of customer abandoned order in cart 
router.get('/detailproductsabandoned/:id',verifyToken,viewAddedCartItem)

///cart search bar api
router.get('/cart-searchbar',verifyToken,cartSearching)

///////////////////////////////admin city managemt routes////////////////////////////////////////////////

///view list of city 
router.get('/viewcity',verifyToken,viewcityList);

///add city in db
router.post('/addcity',verifyToken,addCity);

///update city in db
router.patch('/updatecity/:id',verifyToken,updateCity);

///delete city in db
router.delete('/deleteCity/:id',verifyToken,deleteCity)


//////////////////////////////admin paymnet control routes/////////////////////////////////////

///admin payment list
router.get('/paymentList',verifyToken,paymentList);

///search bar api
router.get('/payment-searchbar',verifyToken,paymentSearching);


///////////////////////////////admin static control api/////////////////////////////////////////

//////////////////about us part routes
//about us get data 
router.get('/aboutusget',aboutgetData);

//about us insert
router.post('/aboutinsert',verifyToken,aboutusInsert);

///about update data
router.patch('/aboutupdate/:id',verifyToken,aboutusupdateData);

////////////privacy policy part routtes

///privacy get data
router.get('/privacyget',privacygetData);

///privacy insert
router.post('/privacyinsert',verifyToken,privacyInsert);

//privacy update
router.patch('/privacyupdate/:id',verifyToken,privacyupdatData);

////terms and condition routes///////////////

//term get data
router.get('/termget',termgetData);

///term insert data
router.post('/terminsert',verifyToken,termInsert);

///term update data
router.patch('/termupdate/:id',verifyToken,termupdatData)

/////////////////////conatct us routes 

//conatct get
router.get('/contactdata',contactGet);

///contact update
router.patch('/contactupdate/:id',verifyToken,contactUpdate);

///contact insert
router.post('/contactInsert',verifyToken,contactInsert)

///////////retunr policy routes

//insert policy data
router.post('/returnpolicy',verifyToken,policyInsert);

///policy get
router.get('/returnpolicyget',policyGet);

///policy update
router.patch('/returnpolicyupdate/:id',verifyToken,policyUpdate);

///////////faq routes

//faq data
router.post('/faqinsert',verifyToken,faqInsert);

///faq get
router.get('/faqget',faqGet);

///faq update
router.patch('/faqupdate/:id',verifyToken,faqUpdate);


//////////////////////////////////////////notification managment module routes///////////////////////////

////creating notification
router.post('/createNotification',verifyToken,creatingNotification)

///list notification
router.get('/listNotification',verifyToken,getNotificationList)

///updating notification
router.patch('/updateNotification/:id',verifyToken,editNotification)

///delete notification 
router.delete('/deleteNotification/:id',verifyToken,deleteNotification)

///sending notification to users
router.post('/sendNotification',verifyToken,sendNotification)

///////////////////////test route for insertion of data in booking managemnet part
router.post('/addproduct',verifyToken,newBooking)

////////////////////////////admin dashoard count /////////////////////////////
router.get('/dashboardCountDta',verifyToken,dashboardData)

//////////////////////////////admin report page apis////////////////////////////////////////////
//user report
router.get('/totalusers',verifyToken,userReport)
//total revenue
router.get('/totalrevenue',verifyToken,revenueReport)
//least seeling product
router.get('/leastsellingproduct',verifyToken,leastsellingReport)
//top selling product
router.get('/topsellingproduct',verifyToken,topsellingReport)
///total sales report
router.get('/totalsales',verifyToken,totalsalesReport)

module.exports=router