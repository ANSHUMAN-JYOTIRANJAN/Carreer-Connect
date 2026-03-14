import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";
export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(`/login`, {
        email: user.email,
        password: user.password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkAPI.rejectWithValue({
          message: "Login failed: No token received",
        });
      }

      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      console.error("Registration error:", error.response.data);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try{

      console.log(user.token)
      const  response = await clientServer.get("/get_user_and_profile", {
        params : {
          token: user.token
        }
      })

      return thunkAPI.fulfillWithValue(response.data)
      
    }catch(error){
        return thunkAPI.rejectWithValue(error.response.data)
    }
  }
);

export const getAllUser = createAsyncThunk("/user/get_all_profiles",
  async(_,thunkAPI) => {
    try{
        const response = await clientServer.get("/user/get_all_profiles")
        return thunkAPI.fulfillWithValue(response.data);
    }catch(error){
        return thunkAPI.rejectWithValue(error.response?.data || "Failed to load profiles");
    }
  }
)
