import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { credAndUrl } from "../../../config/config";

export const addReview = createAsyncThunk(
  "reviewRatingApi/addReview",
  async (payload) => {
    try {
      const response = await axios.post(
        `${credAndUrl?.BASE_URL}customer/writeReview`,
        payload
      );
      return response?.data;
    } catch (error) {
      return error?.data;
    }
  }
);

export const ratingReviewList = createAsyncThunk(
  "reviewRatingApi/ratingReviewList",
  async (payload) => {
    try {
      const response = await axios.get(
        `${credAndUrl?.BASE_URL}customer/getlistReview?customerId=${payload?.customerId}&productId=${payload?.productId}&rating=${payload?.rating?payload?.rating:""}&page=${payload?.page?payload?.page:""}`
      );
      return response?.data;
    } catch (e) {
      console.log("Error", e);
    }
  }
);

const initialState = {
  getRatingReviewList: "",
  loading: "",
};

const ratingListSlice = createSlice({
  name: "lists",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(ratingReviewList.pending, (state) => {
      state.loading = true;
      state.getRatingReviewList = "";
    });
    builder.addCase(ratingReviewList.fulfilled, (state, action) => {
      state.loading = false;
      state.getRatingReviewList = action.payload;
    });
    builder.addCase(ratingReviewList.rejected, (state, action) => {
      state.loading = false;
      state.getRatingReviewList = action.error.message;
    });
  },
});

export default ratingListSlice.reducer;
