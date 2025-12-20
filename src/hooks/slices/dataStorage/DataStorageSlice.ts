import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DataStorageModel, CreateDataStorageInput, UpdateDataStorageInput } from '@/components/admin/settings/integration/dataStorage/type/DataStorageModel';
import axios from 'axios';

// Thunks
export const getAllDataStorage = createAsyncThunk<DataStorageModel[]>('dataStorage/getAll', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/data-storage');
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const createDataStorage = createAsyncThunk<DataStorageModel, CreateDataStorageInput>('dataStorage/create', async (input, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/data-storage', input);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const updateDataStorage = createAsyncThunk<DataStorageModel, { id: string; input: UpdateDataStorageInput }>('dataStorage/update', async ({ id, input }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/api/data-storage/${id}`, input);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const deleteDataStorage = createAsyncThunk<string, string>('dataStorage/delete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/data-storage/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

// State
interface DataStorageState {
  items: DataStorageModel[];
  loading: boolean;
  error: string | null;
}

const initialState: DataStorageState = {
  items: [],
  loading: false,
  error: null,
};

const dataStorageSlice = createSlice({
  name: 'dataStorage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAll
      .addCase(getAllDataStorage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllDataStorage.fulfilled, (state, action: PayloadAction<DataStorageModel[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getAllDataStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // create
      .addCase(createDataStorage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDataStorage.fulfilled, (state, action: PayloadAction<DataStorageModel>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createDataStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // update
      .addCase(updateDataStorage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDataStorage.fulfilled, (state, action: PayloadAction<DataStorageModel>) => {
        state.loading = false;
        const idx = state.items.findIndex(item => item._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateDataStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // delete
      .addCase(deleteDataStorage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDataStorage.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(deleteDataStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dataStorageSlice.reducer;
