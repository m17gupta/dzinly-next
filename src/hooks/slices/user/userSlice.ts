import { IUser } from '@/models/user';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// Thunk to get all users
export const getAllUser = createAsyncThunk<IUser[]>(
  'user/getAllUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/getAllUsers');
      // API returns { users: IUser[] } with superadmin filtered out
      return response.data.users;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

interface UserState {
  user:IUser| null,
  alluser:IUser[];
  isLoading:boolean;
  hasFetched:boolean
}

const initialState: UserState = {
  user: null,
  alluser:[],
  isLoading:false,
  hasFetched:false

};


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    updateUser(state, action: PayloadAction<Partial<UserState['user']>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUser.fulfilled, (state, action: PayloadAction<IUser[]>) => {
        state.isLoading = false;
        state.hasFetched=true
        state.alluser = action.payload;
      })
      .addCase(getAllUser.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
