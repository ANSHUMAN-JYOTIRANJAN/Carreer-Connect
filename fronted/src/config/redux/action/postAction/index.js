import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
  "post/getAllPosts",
  async (_, thunkAPI) =>
  {
    try {
      const response = await clientServer.get("/posts");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch posts"
      );
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (userData, thunkAPI) =>
  {

    const { files, body } = userData;
    try {
      const formData = new FormData();
      formData.append('token', localStorage.getItem('token'))
      formData.append('body', body);
      // append each selected file under the same field name
      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append('media', file);
        });
      }
      const response = await clientServer.post("/post", formData, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      });

      if(response.status === 200 || response.status === 201){
        return thunkAPI.fulfillWithValue("Post created successfully")
      }else{
        return thunkAPI.rejectWithValue("Failed to create post")
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create post"
      );
    }
  });

