import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  getAboutUser,
  getAllUser,
} from "../../action/authAction";

const initialState = {
  user: [],
  all_users: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  profileFetched: false,
  isTokenThere: false,
  connections: [],
  connectionRequest: [],
  all_profiles_fetched: false,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleloginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.loggedIn = true;
        state.message = "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.loggedIn = false;
        state.message = action.payload?.message || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "You are registering...";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.loggedIn = false;
        state.message = "Registration is Successfully";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Registration failed";
      })
      .addCase(getAboutUser.fulfilled, (state, Action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = Action.payload.profile;
        state.connections = Action.payload.connections;
        state.connectionRequest = Action.payload.connectionRequest;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_users = action.payload.profiles || [];
        state.all_profiles_fetched = true;
      });
  },
});
export const {
  reset,
  handleloginUser,
  emptyMessage,
  setTokenIsThere,
  setTokenIsNotThere,
} = authSlice.actions;
export default authSlice.reducer;
