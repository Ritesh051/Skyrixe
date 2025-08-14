import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { credAndUrl } from "../../../config/config";



export const loginApiSlice = createAsyncThunk(
    "loginApi/loginApiSlice",
    async (payload) => {
        try {
            const response = await axios.post(
                `${credAndUrl?.BASE_URL}customer/checking-phone`,
                payload
            );
            return response;
        } catch (e) {
            console.log('Error', e)
        }
    }
);



export const otpVerificationApiSlice = createAsyncThunk(
    "auth/otpVerificationApiSlice",
    async (payload) => {
        try {
            const response = await axios.post(
                `${credAndUrl?.BASE_URL}customer/verifyOtp-phone`,
                payload
            );
            return response;
        } catch (e) {
            console.log('Error', e)
            return e;
        }
    }
);

export const personalInfoUpdateSlice = createAsyncThunk(
    "auth/personalInfoUpdateSlice",
    async (payload) => {
        try {
            const response = await axios.patch(
                `${credAndUrl?.BASE_URL}customer/userupdation/${payload?.userId}`,payload?.data
            );
            return response;
        } catch (e) {
            console.log('Error', e)
        }
    }
);




export const personalInfoApiSlice = createAsyncThunk(
    "auth/personalInfoApiSlice",
    async (payload) => {
        try {
            const response = await axios.post(
                `${credAndUrl?.BASE_URL}customer/${payload?.userId}`,payload?.data,
                {
                    headers:{
                        'Content-Type':'multipart/form-data',
                    }
                }
            );
            return response;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

export const personalInfoEditApi = createAsyncThunk(
    "auth/personalInfoEditApi",
    async (payload) => {
        try {
            const response = await axios.put(
                `${credAndUrl?.BASE_URL}customer/updateaddress/${payload?.userId}/${payload?.addressId}`,payload?.data
            );
            return response;
        } catch (e) {
            console.log('Error', e)
        }
    }
);


export const personalAddrApiSlice = createAsyncThunk(
    "auth/personalAddrApiSlice",
    async (payload) => {
        try {
            const response = await axios.post(
                `${credAndUrl?.BASE_URL}customer/customermultipleaddress/${payload?.userId}`,payload?.data,
            );
            return response;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

export const addressDelete = createAsyncThunk(
    "auth/addressDelete",
    async (payload) => {
        try {
            const response = await axios.delete(
                `${credAndUrl?.BASE_URL}customer/deleteparticluaraddress/${payload?.userId}/${payload?.addressId}`,
            );
            return response;
        } catch (e) {
            
            console.log('Error', e)
        }
    }
);


export const addressListing = createAsyncThunk(
    "auth/addressListing",
    async (payload) => {
        try {
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}customer/getaddresslisting/${payload?.userId}`,
            );
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

const initialState = {
    getAddressList: '',
    loader: ''
}


const authSlice = createSlice({
    name: 'lists',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(addressListing.pending, (state) => {
            state.loader = true;
            state.getAddressList = {}
        })
        builder.addCase(addressListing.fulfilled, (state, action) => {
            state.loader = false;
            state.getAddressList = action.payload;
        })
        builder.addCase(addressListing.rejected, (state, action) => {
            state.loader = false;
            state.getAddressList = action.error.message;
        });

    }
})


export default authSlice.reducer;








