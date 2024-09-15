import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  donors: [],
  hospitals: [],
  bloodStock: [],
  status: 'idle',
  error: null,
};

const fetchData = async (endpoint) => {
  const response = await axios.get(`https://lifeflow-server.up.railway.app/api/${endpoint}`);
  return response.data.data;
};

export const fetchDonors = createAsyncThunk('data/fetchDonors', async () => {
  return await fetchData('donors');
});

export const fetchHospitals = createAsyncThunk('data/fetchHospitals', async () => {
  return await fetchData('hospitals');
});

export const fetchBloodStock = createAsyncThunk('data/fetchBloodStock', async () => {
  return await fetchData('blood-stock/admin-only');
});

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonors.fulfilled, (state, action) => {
        state.donors = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchDonors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchHospitals.fulfilled, (state, action) => {
        state.hospitals = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchBloodStock.fulfilled, (state, action) => {
        state.bloodStock = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchBloodStock.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
