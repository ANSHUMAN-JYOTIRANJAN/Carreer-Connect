
import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts } from "../../action/postAction";
const initialState = {
    posts: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    postFetched: false,
    comments: [],
    postId: "",
};

const postSlice = createSlice({
    name : "post",
    initialState,
    reducers: {
        reset : () => initialState,
        resetPostId: (state) => {
            state.postId = ""
        }
    },

    extraReducers: (builder) => {
        builder
        .addCase(getAllPosts.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
            state.message = "Fetching all the Posts..."
        })
        .addCase(getAllPosts.fulfilled,(state,action) => {
            state.isLoading = false;
            state.postFetched = true;
            state.isError = false;
            state.posts = action.payload.posts
        })
        .addCase(getAllPosts.rejected,(state, action) => {
            state.isError = true;
            state.isLoading = false;
            state.message = action.payload;
        })
    }
})

export default postSlice.reducer;
