import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  user: null,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  const response = await axios.post('https://lifeflow-server.up.railway.app/api/auth/admin/login', { email, password });
  localStorage.setItem('accessToken', response.data.data.accessToken);
  localStorage.setItem('refreshToken', response.data.data.refreshToken);
  return response.data.data;
});

export const refreshAccessToken = createAsyncThunk('auth/refreshAccessToken', async (_, { getState }) => {
  const { auth: { refreshToken } } = getState();
  const response = await axios.post('https://lifeflow-server.up.railway.app/api/auth/admin/refresh', {}, {
    withCredentials: true,
  });
  localStorage.setItem('accessToken', response.data.accessToken);
  return response.data.accessToken;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
