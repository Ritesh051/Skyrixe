import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { credAndUrl } from "../../../config/config";



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
            // const response = await axios.get(
            //     `http://13.51.132.29:4008/api/v1/customer/getslot?date=2025-02-13&productId=67ada73b7103c0d6a311be9e`
            // );
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
            // const response = await axios.get(
            //     `http://13.51.132.29:4008/api/v1/customer/getslot?date=2025-02-13&productId=67ada73b7103c0d6a311be9e`
            // );
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












const initialState = {
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
    loader: ''
}


const productListSlice = createSlice({
    name: 'lists',
    initialState,
    extraReducers: (builder) => {
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

    }
})


export default productListSlice.reducer;
