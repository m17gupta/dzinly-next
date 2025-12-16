import { PageModel } from '@/types/pages/PageModel';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Thunk to save page (async)

import { AppDispatch, RootState } from '@/store/store';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { pageService } from '@/modules/website/page-service';
interface PageEditState {
  page: PageModel|null;
  updatePage: PageModel|null;
}

const initialState: PageEditState = {
  page: null,
  updatePage:null
}
// Thunk to save page via API
export const savePageThunk = createAsyncThunk(
  'pageEdit/savePage',
  async (payload: { id: string; tenantId:string,content: string }, { getState, dispatch }) => {
   const data={
    id:payload.id,
    tenantId:payload.tenantId, 
    content:payload.content
  }
    try {
      const response = await fetch(`/api/pages/${payload.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

   
      if (!response.ok) throw new Error('Failed to save page');
      // Optionally update local state
      const { page } = (getState() as RootState).pageEdit;
      if (page) {
        dispatch(setPageEdit({ ...page, content: payload.content }));
      }
      return await response.json();
    } catch (error) {
      // Optionally handle error (e.g., show toast)
      throw error;
    }
  }
);


export const pageEditSlice = createSlice({
  name: 'pageEdit',
  initialState,
  reducers: {
    setPageEdit: (state, action) => {
      state.page = action.payload;
    },
    updatePage:(state,action)=>{
      state.updatePage=action.payload

    },

    clearPageEdit: (state) => {
      state.page = null;
    },
  },
});






export const { setPageEdit, clearPageEdit,updatePage } = pageEditSlice.actions;
export default pageEditSlice.reducer;
