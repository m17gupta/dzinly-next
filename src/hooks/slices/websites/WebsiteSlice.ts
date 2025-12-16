import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Website } from "@/components/admin/AppShell";

interface WebsitesState {
  websites: Website[];
  currentWebsite: Website | null;
}

const initialState: WebsitesState = {
  websites: [],
  currentWebsite: null,
};

const websitesSlice = createSlice({
  name: "websites",
  initialState,
  reducers: {
    setWebsites(state, action: PayloadAction<Website[]>) {
      state.websites = action.payload;
      // If currentWebsite is not set, pick the first one
      if (!state.currentWebsite && action.payload.length > 0) {
        state.currentWebsite = action.payload[0];
      }
    },
    clearWebsites(state) {
      state.websites = [];
      state.currentWebsite = null;
    },
    setCurrentWebsite(state, action: PayloadAction<Website | null>) {
      state.currentWebsite = action.payload;
    },
  },
});

export const { setWebsites, clearWebsites, setCurrentWebsite } = websitesSlice.actions;
export default websitesSlice.reducer;
