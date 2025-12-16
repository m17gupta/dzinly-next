import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MaterialCategory } from "@/components/admin/category/types/CategoryModel";

export type CategoryState = {
  listCategory: MaterialCategory[];
  isCategoryLoading: boolean;
    hasFetched: boolean
};

const initialState: CategoryState = {
  listCategory: [],
  isCategoryLoading: false,
    hasFetched: false
};
export const fetchCategories = createAsyncThunk<
  MaterialCategory[],
  void,
  { state: { category: CategoryState }; rejectValue: string }
>(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/admin/category`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return rejectWithValue(body?.error || `HTTP ${res.status}`);
    }
    const data = await res.json();
    // API returns { items }
    console.log("daat", data);
    return data?.items || [];
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Network error"
    );
  }
  },
  {
    // prevent duplicate concurrent fetches
    condition: (_, { getState }) => {
      try {
        const state = getState() as { category: CategoryState };
        return !state.category.isCategoryLoading;
      } catch {
        return true;
      }
    },
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<MaterialCategory[]>) {
      state.listCategory = action.payload;
    },
    addCategory(state, action: PayloadAction<MaterialCategory>) {
      state.listCategory.push(action.payload);
    },
    updateCategory(state, action: PayloadAction<MaterialCategory>) {
      const updated = action.payload;
      const idx = state.listCategory.findIndex((c) => {
        if (!c) return false;
        // prefer _id if present, otherwise fall back to id or name
        if (c._id && updated._id) return String(c._id) === String(updated._id);
        if (c.id && updated.id) return String(c.id) === String(updated.id);
        return c.name === updated.name;
      });
      if (idx !== -1) {
        state.listCategory[idx] = {
          ...state.listCategory[idx],
          ...updated,
        };
      }
    },
    removeCategory(state, action: PayloadAction<string | number | undefined>) {
      const id = action.payload;
      state.listCategory = state.listCategory.filter((c) => {
        if (!c) return false;
        if (c._id && id) return String(c._id) !== String(id);
        if (c.id && id) return String(c.id) !== String(id);
        return c.name !== String(id);
      });
    },
    clearCategories(state) {
      state.listCategory = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isCategoryLoading = true;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<MaterialCategory[]>) => {
            state.listCategory = action.payload;
            state.hasFetched= true
          }
      )
      .addCase(fetchCategories.rejected, (state) => {
        state.isCategoryLoading = false;
      });
  },
});

export const {
  setCategories,
  addCategory,
  updateCategory,
  removeCategory,
  clearCategories,
} = categorySlice.actions;

export default categorySlice.reducer;

export const selectCategories = (state: { category: CategoryState }) =>
  state.category.listCategory;
