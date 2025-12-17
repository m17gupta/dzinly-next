import { fetchBrands } from "@/hooks/slices/brand/BrandSlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllBrand = () => {
  const { isBrandLoading, hasFetched } = useSelector(
    (state: RootState) => state.brand
  );
  const { currentWebsite } = useSelector((state: RootState) => state.websites);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (
      !hasFetched &&
      !isBrandLoading &&
      currentWebsite &&
      currentWebsite._id
    ) {
      dispatch(fetchBrands({websiteId:currentWebsite._id}));
    }
  }, [hasFetched, isBrandLoading, currentWebsite, dispatch]);
  return null;
};

export default GetAllBrand;
