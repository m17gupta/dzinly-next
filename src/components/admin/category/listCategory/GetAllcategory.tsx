
import { fetchCategories } from "@/hooks/slices/category/CategorySlice";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


let hasFetchedCategories = false;

const GetAllcategory = () => {
const { isCategoryLoading, hasFetched } = useSelector(
    (state: RootState) => state.category
  );console.log(  )

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!hasFetched && !isCategoryLoading) {
      dispatch(fetchCategories());
    }
  }, [hasFetched, isCategoryLoading, dispatch]);

  return null;
};

export default GetAllcategory;
