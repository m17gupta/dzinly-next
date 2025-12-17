import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MaterialSegmentModel } from "@/components/admin/segment/types/SegmentModel";

export type SegmentState = {
  listSegment: MaterialSegmentModel[];
  isSegmentLoading: boolean;
  hasFetched: boolean;
};

const initialState: SegmentState = {
  listSegment: [],
  isSegmentLoading: false,
  hasFetched: false,
};

export const fetchSegments = createAsyncThunk<
  MaterialSegmentModel[],
  {websiteId:string},
  { state: { segment: SegmentState }; rejectValue: string }
>(
  "segment/fetchSegments",
  async ({websiteId}, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/segment?websiteId=${websiteId}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return rejectWithValue(body?.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return data?.items || [];
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Network error"
      );
    }
  },
  {
    condition: (_, { getState }) => {
      try {
        const state = getState() as { segment: SegmentState };
        return !state.segment.isSegmentLoading;
      } catch {
        return true;
      }
    },
  }
);

const segmentSlice = createSlice({
  name: "segment",
  initialState,
  reducers: {
    setSegments(state, action: PayloadAction<MaterialSegmentModel[]>) {
      state.listSegment = action.payload;
    },
    addSegment(state, action: PayloadAction<MaterialSegmentModel>) {
      state.listSegment.push(action.payload);
    },
    updateSegment(state, action: PayloadAction<MaterialSegmentModel>) {
      const updated = action.payload;
      const idx = state.listSegment.findIndex((c) => {
        if (!c) return false;
        if ((c as any)._id && (updated as any)._id)
          return String((c as any)._id) === String((updated as any)._id);
        if (c.id && updated.id) return String(c.id) === String(updated.id);
        return c.name === updated.name;
      });
      if (idx !== -1) {
        state.listSegment[idx] = {
          ...state.listSegment[idx],
          ...updated,
        };
      }
    },
    removeSegment(state, action: PayloadAction<string | number | undefined>) {
      const id = action.payload;
      state.listSegment = state.listSegment.filter((c) => {
        if (!c) return false;
        if ((c as any)._id && id) return String((c as any)._id) !== String(id);
        if (c.id && id) return String(c.id) !== String(id);
        return c.name !== String(id);
      });
    },
    clearSegments(state) {
      state.listSegment = [];
      state.isSegmentLoading=false 
      state.hasFetched= false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSegments.pending, (state) => {
        state.isSegmentLoading = true;
      })
      .addCase(
        fetchSegments.fulfilled,
        (state, action: PayloadAction<MaterialSegmentModel[]>) => {
          state.listSegment = action.payload;
          state.hasFetched = true;
          state.isSegmentLoading = false;
        }
      )
      .addCase(fetchSegments.rejected, (state) => {
        state.isSegmentLoading = false;
      });
  },
});

export const {
  setSegments,
  addSegment,
  updateSegment,
  removeSegment,
  clearSegments,
} = segmentSlice.actions;

export default segmentSlice.reducer;

export const selectSegments = (state: { segment: SegmentState }) =>
  state.segment.listSegment;
