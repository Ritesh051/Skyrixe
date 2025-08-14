import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { credAndUrl } from "../../../config/config";



export const addtoCart = createAsyncThunk(
    "listApis/addtoCart",
    async (payload) => {
        try {
            const response = await axios.post(`${credAndUrl?.BASE_URL}customer/addtocart`,payload);
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);


export const upcomingBooking = createAsyncThunk(
    "listApis/upcomingBooking",
    async (payload) => {
        try {
            const response = await axios.get(`${credAndUrl?.BASE_URL}customer/upcomingordercustomer/${payload?.userId}`);
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);

export const pastBooking = createAsyncThunk(
    "listApis/pastBooking",
    async (payload) => {
        try {
            const response = await axios.get(`${credAndUrl?.BASE_URL}customer/previousordercustomer/${payload?.userId}`);
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);



export const orderSummary = createAsyncThunk(
    "listApis/orderSummary",
    async (payload) => {
        try {
            const response = await axios.get(`${credAndUrl?.BASE_URL}customer/getproduct/${payload?.userId}`);
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);


export const placeOrder = createAsyncThunk(
    "listApis/placeOrder",
    async (payload) => {
        try {
            const response = await axios.post(`${credAndUrl?.BASE_URL}customer/createOrder/${payload?.orderId}`,payload);
            return response?.data;
        } catch (error) {
            return error?.data;
        }
    }
);


export const createCODorder = createAsyncThunk(
    "listApis/createCODorder",
    async (payload) => {
        try {
            const response = await axios.post(`${credAndUrl?.BASE_URL}/customer/createcodOrder`,payload);
            return response?.data;
        } catch (error) {
            return error?.data;
        }
    }
);


export const createOrder = createAsyncThunk(
    "listApis/createOrder",
    async (payload) => {
        try {
            const response = await axios.post(`${credAndUrl?.BASE_URL}customer/paymentProcess`,payload);
            return response?.data;
        } catch (error) {
            return error?.data;
        }
    }
);

export const verifyPayment = createAsyncThunk(
    "listApis/verifyPayment",
    async (payload) => {
        try {
            const response = await axios.post(`${credAndUrl?.BASE_URL}customer/paymentwebhook`,payload);
            return response?.data;
        } catch (error) {
            return error?.data;
        }
    }
);

export const editCart = createAsyncThunk(
    "listApis/editCart",
    async (payload) => {
        try {
            const response = await axios.put(`${credAndUrl?.BASE_URL}customer/updateproductCart/${payload?.id}`,payload?.detail);
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);


export const deleteCartProduct = createAsyncThunk(
    "listApis/deleteCartProduct",
    async (payload) => {
        try {
            const response = await axios.delete(`${credAndUrl?.BASE_URL}customer/deletefromcart`,{
                data: { id: payload?.id },
               
            });
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);


const initialState = {
   
    getOrderSummaryDetail:'',
    getUpcomingBooking:'',
    getPastBooking:'',
    loader: ''
}


const orderSummarySlice = createSlice({
    name: 'orderSummaryApi',
    initialState,
    extraReducers: (builder) => {
       
        builder.addCase(orderSummary.pending, (state) => {
            state.loader = true;
            state.getOrderSummaryDetail = ""
        })
        builder.addCase(orderSummary.fulfilled, (state, action) => {
            state.loader = false;
            state.getOrderSummaryDetail = action.payload;
        })
        builder.addCase(orderSummary.rejected, (state, action) => {
            state.loader = false;
            state.getOrderSummaryDetail = action.error.message;
        });
        builder.addCase(upcomingBooking.pending, (state) => {
            state.loader = true;
            state.getUpcomingBooking = {}
        })
        builder.addCase(upcomingBooking.fulfilled, (state, action) => {
            state.loader = false;
            state.getUpcomingBooking = action.payload;
        })
        builder.addCase(upcomingBooking.rejected, (state, action) => {
            state.loader = false;
            state.getUpcomingBooking = action.error.message;
        });
        builder.addCase(pastBooking.pending, (state) => {
            state.loader = true;
            state.getPastBooking = ""
        })
        builder.addCase(pastBooking.fulfilled, (state, action) => {
            state.loader = false;
            state.getPastBooking = action.payload;
        })
        builder.addCase(pastBooking.rejected, (state, action) => {
            state.loader = false;
            state.getPastBooking = action.error.message;
        });


    }
})


export default orderSummarySlice.reducer;

