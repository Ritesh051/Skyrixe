import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { credAndUrl } from "../../../config/config";


export const staticDataList = createAsyncThunk(
    "staticGetApis/staticDataList",
    async (payload) => {
        try {
            const response = await axios.get(
                `${credAndUrl?.BASE_URL}admin/${payload?.endUrl}`
            );
            return response?.data;
        } catch (e) {
            console.log('Error', e)
        }
    }
);



const initialState = {
    getStaticList: '',
    loader: ''
}


const staticListSlice = createSlice({
    name: 'lists',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(staticDataList.pending, (state) => {
            state.loader = true;
            state.getStaticList = {}
        })
        builder.addCase(staticDataList.fulfilled, (state, action) => {
            state.loader = false;
            state.getStaticList = action.payload;
        })
        builder.addCase(staticDataList.rejected, (state, action) => {
            state.loader = false;
            state.getStaticList = action.error.message;
        });

    }
})


export default staticListSlice.reducer;