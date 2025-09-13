import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService.js';
import { toast } from 'react-hot-toast';

const userInfo = JSON.parse(localStorage.getItem('userInfo'));

const initialState = {
     userInfo: userInfo ? userInfo : null,
     isError: false, isSuccess: false, isLoading: false, message: '',
};

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
     try {
          const data = await authService.register(user);
          toast.success(data.message || 'Registration successful! Please check your email.');
          return data;
     } catch (error) {
          const message = (error.response?.data?.message) || error.message;
          toast.error(message);
          return thunkAPI.rejectWithValue(message);
     }
});

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
     try { return await authService.login(user); } catch (error) { const message = (error.response?.data?.message) || error.message; toast.error(message); return thunkAPI.rejectWithValue(message); }
});

export const logout = createAsyncThunk('auth/logout', async () => { authService.logout(); });

export const forgotPassword = createAsyncThunk('auth/forgotpassword', async (email, thunkAPI) => {
     try { return await authService.forgotPassword(email); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});

export const resetPassword = createAsyncThunk('auth/resetpassword', async (data, thunkAPI) => {
     try { return await authService.resetPassword(data); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});

export const updateUser = createAsyncThunk('auth/update', async (userData, thunkAPI) => {
     try { const token = thunkAPI.getState().auth.userInfo.token; return await authService.updateUser(userData, token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});

export const deleteUser = createAsyncThunk('auth/delete', async (_, thunkAPI) => {
     try {
          const token = thunkAPI.getState().auth.userInfo.token;
          const data = await authService.deleteUser(token);
          toast.success(data.message || 'Account deleted successfully.');
          return data;
     } catch (error) {
          const message = (error.response?.data?.message) || error.message;
          return thunkAPI.rejectWithValue(message);
     }
});

export const changePassword = createAsyncThunk('auth/changepassword', async (passwordData, thunkAPI) => {
     try { const token = thunkAPI.getState().auth.userInfo.token; return await authService.changePassword(passwordData, token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});

export const authSlice = createSlice({
     name: 'auth',
     initialState,
     reducers: {
     reset: (state) => { state.isLoading = false; state.isSuccess = false; state.isError = false; state.message = ''; },
     },
     extraReducers: (builder) => {
     builder
          .addCase(register.pending, (state) => { state.isLoading = true; })
          .addCase(register.fulfilled, (state) => { state.isLoading = false; state.isSuccess = true; })
          .addCase(register.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
          .addCase(login.pending, (state) => { state.isLoading = true; })
          .addCase(login.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.userInfo = action.payload; })
          .addCase(login.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; state.userInfo = null; })
          .addCase(logout.fulfilled, (state) => { state.userInfo = null; })
          .addCase(updateUser.pending, (state) => { state.isLoading = true; })
          .addCase(updateUser.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.userInfo = action.payload; })
          .addCase(updateUser.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
          .addCase(deleteUser.pending, (state) => { state.isLoading = true; })
          .addCase(deleteUser.fulfilled, (state) => { state.isLoading = false; state.isSuccess = true; state.userInfo = null; })
          .addCase(deleteUser.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
          .addCase(changePassword.pending, (state) => { state.isLoading = true; })
          .addCase(changePassword.fulfilled, (state) => { state.isLoading = false; state.isSuccess = true; })
          .addCase(changePassword.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
          .addCase(forgotPassword.pending, (state) => { state.isLoading = true; })
          .addCase(forgotPassword.fulfilled, (state) => { state.isLoading = false; state.isSuccess = true; })
          .addCase(forgotPassword.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
          .addCase(resetPassword.pending, (state) => { state.isLoading = true; })
          .addCase(resetPassword.fulfilled, (state) => { state.isLoading = false; state.isSuccess = true; })
          .addCase(resetPassword.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; });
     },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;