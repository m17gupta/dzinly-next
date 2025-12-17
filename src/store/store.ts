import { configureStore } from '@reduxjs/toolkit';
import pageEditReducer from '../hooks/slices/pageEditSlice';
import userSlice from "../hooks/slices/user/userSlice"
import categoryReducer from "../hooks/slices/category/CategorySlice";
import websitesReducer from "../hooks/slices/websites/WebsiteSlice";
import attributeReducer from "../hooks/slices/attribute/AttributeSlice"
import brandReducer from "../hooks/slices/brand/BrandSlice"
import segmentReducer from "../hooks/slices/segment/SegmentSlice"



export const store = configureStore({
  reducer: {
    user:userSlice,
    pageEdit: pageEditReducer,
    category: categoryReducer,
    brand:brandReducer,
    segment:segmentReducer,
    attribute:attributeReducer,
    websites: websitesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
