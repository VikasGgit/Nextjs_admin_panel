import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

// Async Actions

// Admin Login
export const adminLogin = createAsyncThunk("admin/login", async (credentials, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/users/login", credentials);
    const { token } = response.data;
    localStorage.setItem("token", token);
    return token;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Login failed");
  }
});

// Fetch All Users
export const fetchAllUsers = createAsyncThunk("admin/fetchUsers", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/admin/users");
    console.log(response.data);
    return response.data;
   
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Failed to fetch users");
  }
});

// Freeze User Account
export const freeze = createAsyncThunk('admin/freeze', async (userId, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`/admin/users/${userId}/freeze`);
    console.log(response.data);
    return response.data; // Should return data for updating state (user info)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Failed to freeze user account");
  }
});

// Unfreeze User Account
export const unfreeze = createAsyncThunk('admin/unfreeze', async (userId, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`/admin/users/${userId}/unfreeze`);
    console.log(response.data);
    return response.data; // Should return data for updating state (user info)
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Failed to unfreeze user account");
  }
});

// Delete User
export const deleteUser = createAsyncThunk("admin/deleteUser", async (userId, thunkAPI) => {
  try {
    await axiosInstance.delete(`/admin/users/${userId}`);
    return userId; // Return user ID to remove from state
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Failed to delete user");
  }
});

// Reset User Credentials
export const resetUserCredentials = createAsyncThunk("admin/resetUserCredentials", async (userId, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`/admin/users/${userId}/reset-credentials`);
    return { userId, tempPassword: response.data.tempPassword };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || "Failed to reset credentials");
  }
});

// Admin Slice
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    token: null,
    isAuthenticated: false,
    users: [],
    tempPassword: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Fetch All Users
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Freeze User Account
      .addCase(freeze.fulfilled, (state, action) => {
        // Find the user in the users array and update their account status to "FROZEN"
        state.users = state.users.map(user =>
          user.id === action.payload.id ? { ...user, accountStatus: 'FROZEN' } : user
        );
      })
      .addCase(freeze.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Unfreeze User Account
      .addCase(unfreeze.fulfilled, (state, action) => {
        // Find the user in the users array and update their account status to "ACTIVE"
        state.users = state.users.map(user =>
          user.id === action.payload.id ? { ...user, accountStatus: 'ACTIVE' } : user
        );
      })
      .addCase(unfreeze.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Reset Credentials
      .addCase(resetUserCredentials.fulfilled, (state, action) => {
        state.tempPassword = action.payload.tempPassword;
      })
      .addCase(resetUserCredentials.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Actions and Reducer
export const { logout } = adminSlice.actions;
export default adminSlice.reducer;
