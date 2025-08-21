import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { credAndUrl } from "../../../config/config";

// Existing API calls (unchanged)
export const cityList = createAsyncThunk(
    "listApis/cityList",
    async (payload) => {
        try {
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}customer/citylist?search=${payload?.search}`
            );
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

export const birthdayDecoList = createAsyncThunk(
    "listApis/birthdayDecoList",
    async (payload) => {
        try {
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}customer/birthdayDecoration/${payload?.selectCity}`
            );
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

export const anniversaryDecoList = createAsyncThunk(
    "listApis/anniversaryDecoList",
    async (payload) => {
        try {
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}customer/anniversayDecoartion/${payload?.selectCity}`
            );
            console.log(response,"response")
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

export const kidsDecoList = createAsyncThunk(
    "listApis/kidsDecoList",
    async (payload) => {
        try {
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}customer/kidsDecoration/${payload?.selectCity}`
            );
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

export const weddingBalloonDecoList = createAsyncThunk(
    "listApis/weddingBalloonDecoList",
    async (payload) => {
        try {
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}customer/ballonsWholesale/${payload?.selectCity}`
            );
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

export const categorySubCatList = createAsyncThunk(
    "listApis/categorySubCatList",
    async (payload) => {
        try {
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}customer/catsubcatlist`
            );
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

export const categoryList = createAsyncThunk(
    "listApis/categoryList",
    async (payload) => {
        try {
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}customer/categorylist`
            );
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

export const categoryProductList = createAsyncThunk(
    "listApis/categoryProductList",
    async (payload) => {
        try {
            const response = await axios.post(
                `${credAndUrl?.BASE_URL}customer/getproductListing`,payload
            );
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

export const dealBannerList = createAsyncThunk(
    "listApis/dealBannerList",
    async (payload) => {
        try {
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}customer/dealbannerlist`
            );
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

export const topBannerList = createAsyncThunk(
    "listApis/topBannerList",
    async (payload) => {
        try {
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}customer/bannerlist`
            );
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

//============================Dynamic Data================================
export const userDetailState = createAsyncThunk(
    "listApis/userDetailState",
     (payload) => {
        try {
            return payload;
        } catch (e) {
            
        }
    }
);

export const signUpState = createAsyncThunk(
    "listApis/signUpState",
     (payload) => {
        try {
            return payload;
        } catch (e) {
            
        }
    }
);

export const productDetails = createAsyncThunk(
    "listApis/productDetails",
    async (payload) => {
        try {
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}customer/detailproductview/${payload?.id}`
            );
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

export const slotListApi = createAsyncThunk(
    "listApis/slotListApi",
    async (payload) => {
        try {
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}customer/getslot?date=${payload?.date}&productId=${payload?.productId}`
            );
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

export const staticSlotListApi = createAsyncThunk(
    "listApis/staticSlotListApi",
    async (payload) => {
        try {
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}customer/getslotswithoutcalculate`
            );
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

// =============================Search Product List=======================================
export const searchProduct = createAsyncThunk(
    "listApis/searchProduct",
    async (payload) => {
        try {
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}customer/getproductcategory?search=${payload?.search}&city=${payload?.city}`
            );
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

// =============================NEW CART FUNCTIONALITY=======================================

// Add to Cart
export const addtoCart = createAsyncThunk(
    "listApis/addtoCart",
    async (payload, { rejectWithValue }) => {
        try {
            console.log('AddtoCart payload:', payload);
            
            const response = await axios.post(
                `${credAndUrl?.BASE_URL}customer/addtocart`,
                payload
            );
            
            console.log('AddtoCart response:', response);
            
            // Return the response data
            return response?.data;
        } catch (error) {
            console.error('AddtoCart error:', error);
            
            // Return a proper error response using rejectWithValue
            return rejectWithValue(
                error?.response?.data || 
                { message: "Failed to add item to cart", error: error.message }
            );
        }
    }
);

// Get Cart Items
export const getCartItems = createAsyncThunk(
    "listApis/getCartItems",
    async (payload, { rejectWithValue }) => {
        try {
            console.log('GetCartItems payload:', payload);
            
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}customer/getcart/${payload?.userId}`
            );
            
            console.log('GetCartItems response:', response);
            return response?.data;
        } catch (error) {
            console.error('GetCartItems error:', error);
            return rejectWithValue(
                error?.response?.data || 
                { message: "Failed to fetch cart items", error: error.message }
            );
        }
    }
);

// Update Cart Item
export const updateCartItem = createAsyncThunk(
    "listApis/updateCartItem",
    async (payload, { rejectWithValue }) => {
        try {
            console.log('UpdateCartItem payload:', payload);
            
            const response = await axios.put(
                `${credAndUrl?.BASE_URL}customer/updatecart`,
                payload
            );
            
            console.log('UpdateCartItem response:', response);
            return response?.data;
        } catch (error) {
            console.error('UpdateCartItem error:', error);
            return rejectWithValue(
                error?.response?.data || 
                { message: "Failed to update cart item", error: error.message }
            );
        }
    }
);

// Remove from Cart
export const removeFromCart = createAsyncThunk(
    "listApis/removeFromCart",
    async (payload, { rejectWithValue }) => {
        try {
            console.log('RemoveFromCart payload:', payload);
            
            const response = await axios.delete(
                `${credAndUrl?.BASE_URL}customer/removefromcart`,
                { data: payload }
            );
            
            console.log('RemoveFromCart response:', response);
            return response?.data;
        } catch (error) {
            console.error('RemoveFromCart error:', error);
            return rejectWithValue(
                error?.response?.data || 
                { message: "Failed to remove item from cart", error: error.message }
            );
        }
    }
);

// Clear Cart
export const clearCart = createAsyncThunk(
    "listApis/clearCart",
    async (payload, { rejectWithValue }) => {
        try {
            console.log('ClearCart payload:', payload);
            
            const response = await axios.delete(
                `${credAndUrl?.BASE_URL}customer/clearcart/${payload?.userId}`
            );
            
            console.log('ClearCart response:', response);
            return response?.data;
        } catch (error) {
            console.error('ClearCart error:', error);
            return rejectWithValue(
                error?.response?.data || 
                { message: "Failed to clear cart", error: error.message }
            );
        }
    }
);

// UPDATED INITIAL STATE WITH CART FUNCTIONALITY
const initialState = {
    // Existing states
    getBirthdayList: '',
    getAnniversaryList: '',
    getKidsList: '',
    getWeddingDecoList:'',
    getCategorySubCatList:'',
    getCategoryList:'',
    getDealBannerList:'',
    getTopBannerList:'',
    getUserDetailState:JSON.parse(window.localStorage.getItem("LennyUserDetail"))?true:false,
    getCityList:'',
    getProductDetails:'',
    getSignUpState:false,
    getCategoryProductList:"",
    getSlotList:'',
    getStaticSlotList:'',
    getSearchProductList:'',
    
    // NEW CART STATES
    cartItems: [],
    cartLoading: false,
    cartError: null,
    addToCartLoading: false,
    addToCartError: null,
    updateCartLoading: false,
    updateCartError: null,
    removeCartLoading: false,
    removeCartError: null,
    clearCartLoading: false,
    clearCartError: null,
    cartItemCount: 0,
    cartTotal: 0,
    
    // General loader
    loader: false
}

const productListSlice = createSlice({
    name: 'lists',
    initialState,
    extraReducers: (builder) => {
        // EXISTING REDUCERS (unchanged)
        builder.addCase(birthdayDecoList.pending, (state) => {
            state.loader = true;
            state.getBirthdayList = {}
        })
        builder.addCase(birthdayDecoList.fulfilled, (state, action) => {
            state.loader = false;
            state.getBirthdayList = action.payload;
        })
        builder.addCase(birthdayDecoList.rejected, (state, action) => {
            state.loader = false;
            state.getBirthdayList = action.error.message;
        });

        builder.addCase(userDetailState.pending, (state) => {
            state.loader = true;
            state.getUserDetailState = false
        })
        builder.addCase(userDetailState.fulfilled, (state, action) => {
            state.loader = false;
            state.getUserDetailState = action.payload;
        })
        builder.addCase(userDetailState.rejected, (state, action) => {
            state.loader = false;
            state.getUserDetailState = action.error.message;
        });

        builder.addCase(cityList.pending, (state) => {
            state.loader = true;
            state.getCityList = ""
        })
        builder.addCase(cityList.fulfilled, (state, action) => {
            state.loader = false;
            state.getCityList = action.payload;
        })
        builder.addCase(cityList.rejected, (state, action) => {
            state.loader = false;
            state.getCityList = action.error.message;
        });

        builder.addCase(anniversaryDecoList.pending, (state) => {
            state.loader = true;
            state.getAnniversaryList = {}
        })
        builder.addCase(anniversaryDecoList.fulfilled, (state, action) => {
            state.loader = false;
            state.getAnniversaryList = action.payload;
        })
        builder.addCase(anniversaryDecoList.rejected, (state, action) => {
            state.loader = false;
            state.getAnniversaryList = action.error.message;
        });

        builder.addCase(kidsDecoList.pending, (state) => {
            state.loader = true;
            state.getKidsList = {}
        })
        builder.addCase(kidsDecoList.fulfilled, (state, action) => {
            state.loader = false;
            state.getKidsList = action.payload;
        })
        builder.addCase(kidsDecoList.rejected, (state, action) => {
            state.loader = false;
            state.getKidsList = action.error.message;
        });

        builder.addCase(weddingBalloonDecoList.pending, (state) => {
            state.loader = true;
            state.getWeddingDecoList = {}
        })
        builder.addCase(weddingBalloonDecoList.fulfilled, (state, action) => {
            state.loader = false;
            state.getWeddingDecoList = action.payload;
        })
        builder.addCase(weddingBalloonDecoList.rejected, (state, action) => {
            state.loader = false;
            state.getWeddingDecoList = action.error.message;
        });

        builder.addCase(categorySubCatList.pending, (state) => {
            state.loader = true;
            state.getCategorySubCatList = {}
        })
        builder.addCase(categorySubCatList.fulfilled, (state, action) => {
            state.loader = false;
            state.getCategorySubCatList = action.payload;
        })
        builder.addCase(categorySubCatList.rejected, (state, action) => {
            state.loader = false;
            state.getCategorySubCatList = action.error.message;
        });

        builder.addCase(categoryList.pending, (state) => {
            state.loader = true;
            state.getCategoryList = {}
        })
        builder.addCase(categoryList.fulfilled, (state, action) => {
            state.loader = false;
            state.getCategoryList = action.payload;
        })
        builder.addCase(categoryList.rejected, (state, action) => {
            state.loader = false;
            state.getCategoryList = action.error.message;
        });

        builder.addCase(dealBannerList.pending, (state) => {
            state.loader = true;
            state.getDealBannerList = {}
        })
        builder.addCase(dealBannerList.fulfilled, (state, action) => {
            state.loader = false;
            state.getDealBannerList = action.payload;
        })
        builder.addCase(dealBannerList.rejected, (state, action) => {
            state.loader = false;
            state.getDealBannerList = action.error.message;
        });

        builder.addCase(productDetails.pending, (state) => {
            state.loader = true;
            state.getProductDetails = " "
        })
        builder.addCase(productDetails.fulfilled, (state, action) => {
            state.loader = false;
            state.getProductDetails = action.payload;
        })
        builder.addCase(productDetails.rejected, (state, action) => {
            state.loader = false;
            state.getProductDetails = action.error.message;
        });

        builder.addCase(topBannerList.pending, (state) => {
            state.loader = true;
            state.getTopBannerList = {}
        })
        builder.addCase(topBannerList.fulfilled, (state, action) => {
            state.loader = false;
            state.getTopBannerList = action.payload;
        })
        builder.addCase(topBannerList.rejected, (state, action) => {
            state.loader = false;
            state.getTopBannerList = action.error.message;
        });

        builder.addCase(signUpState.fulfilled, (state, action) => {
            state.loader = false;
            state.getSignUpState = action.payload;
        })

        builder.addCase(categoryProductList.pending, (state) => {
            state.loader = true;
            state.getCategoryProductList = ""
        })
        builder.addCase(categoryProductList.fulfilled, (state, action) => {
            state.loader = false;
            state.getCategoryProductList = action.payload;
        })
        builder.addCase(categoryProductList.rejected, (state, action) => {
            state.loader = false;
            state.getCategoryProductList = action.error.message;
        });

        builder.addCase(slotListApi.pending, (state) => {
            state.loader = true;
            state.getSlotList = ""
        })
        builder.addCase(slotListApi.fulfilled, (state, action) => {
            state.loader = false;
            state.getSlotList = action.payload;
            state.getStaticSlotList='';
        })
        builder.addCase(slotListApi.rejected, (state, action) => {
            state.loader = false;
            state.getSlotList = action.error.message;
        });

        builder.addCase(searchProduct.pending, (state) => {
            state.loader = true;
            state.getSearchProductList = {}
        })
        builder.addCase(searchProduct.fulfilled, (state, action) => {
            state.loader = false;
            state.getSearchProductList = action.payload;
        })
        builder.addCase(searchProduct.rejected, (state, action) => {
            state.loader = false;
            state.getSearchProductList = action.error.message;
        });

        builder.addCase(staticSlotListApi.pending, (state) => {
            state.loader = true;
            state.getStaticSlotList = ""
        })
        builder.addCase(staticSlotListApi.fulfilled, (state, action) => {
            state.loader = false;
            state.getStaticSlotList = action.payload;
            state.getSlotList='';
        })
        builder.addCase(staticSlotListApi.rejected, (state, action) => {
            state.loader = false;
            state.getStaticSlotList = action.error.message;
        });

        // NEW CART REDUCERS
        // Add to cart cases
        builder.addCase(addtoCart.pending, (state) => {
            state.addToCartLoading = true;
            state.addToCartError = null;
        })
        builder.addCase(addtoCart.fulfilled, (state, action) => {
            state.addToCartLoading = false;
            state.addToCartError = null;
            console.log('Add to cart successful:', action.payload);
            
            // If you want to update the cart items immediately after adding
            // You can do this or trigger a getCartItems call from the component
            // state.cartItems = action.payload?.cartItems || state.cartItems;
            // state.cartItemCount = action.payload?.cartItemCount || state.cartItemCount;
        })
        builder.addCase(addtoCart.rejected, (state, action) => {
            state.addToCartLoading = false;
            state.addToCartError = action.payload?.message || action.error.message;
            console.error('Add to cart failed:', action.payload);
        });

        // Get cart items cases
        builder.addCase(getCartItems.pending, (state) => {
            state.cartLoading = true;
            state.cartError = null;
        })
        builder.addCase(getCartItems.fulfilled, (state, action) => {
            state.cartLoading = false;
            state.cartItems = action.payload?.data || action.payload?.cartItems || [];
            state.cartItemCount = action.payload?.data?.length || action.payload?.cartItems?.length || 0;
            state.cartTotal = action.payload?.total || 0;
            state.cartError = null;
        })
        builder.addCase(getCartItems.rejected, (state, action) => {
            state.cartLoading = false;
            state.cartError = action.payload?.message || action.error.message;
        });

        // Update cart item cases
        builder.addCase(updateCartItem.pending, (state) => {
            state.updateCartLoading = true;
            state.updateCartError = null;
        })
        builder.addCase(updateCartItem.fulfilled, (state, action) => {
            state.updateCartLoading = false;
            state.updateCartError = null;
            
            // Update the specific item in cartItems if needed
            const updatedItem = action.payload?.data;
            if (updatedItem && state.cartItems.length > 0) {
                const itemIndex = state.cartItems.findIndex(item => item._id === updatedItem._id);
                if (itemIndex !== -1) {
                    state.cartItems[itemIndex] = updatedItem;
                }
            }
        })
        builder.addCase(updateCartItem.rejected, (state, action) => {
            state.updateCartLoading = false;
            state.updateCartError = action.payload?.message || action.error.message;
        });

        // Remove from cart cases
        builder.addCase(removeFromCart.pending, (state) => {
            state.removeCartLoading = true;
            state.removeCartError = null;
        })
        builder.addCase(removeFromCart.fulfilled, (state, action) => {
            state.removeCartLoading = false;
            state.removeCartError = null;
            
            // Remove the item from cartItems locally
            const removedItemId = action.meta.arg?.itemId || action.meta.arg?.cartItemId;
            if (removedItemId) {
                state.cartItems = state.cartItems.filter(item => item._id !== removedItemId);
                state.cartItemCount = state.cartItems.length;
            }
        })
        builder.addCase(removeFromCart.rejected, (state, action) => {
            state.removeCartLoading = false;
            state.removeCartError = action.payload?.message || action.error.message;
        });

        // Clear cart cases
        builder.addCase(clearCart.pending, (state) => {
            state.clearCartLoading = true;
            state.clearCartError = null;
        })
        builder.addCase(clearCart.fulfilled, (state, action) => {
            state.clearCartLoading = false;
            state.clearCartError = null;
            state.cartItems = [];
            state.cartItemCount = 0;
            state.cartTotal = 0;
        })
        builder.addCase(clearCart.rejected, (state, action) => {
            state.clearCartLoading = false;
            state.clearCartError = action.payload?.message || action.error.message;
        });
    }
})

export default productListSlice.reducer;