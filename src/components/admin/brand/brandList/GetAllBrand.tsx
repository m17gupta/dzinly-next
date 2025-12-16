import { fetchBrands } from '@/hooks/slices/brand/BrandSlice';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const GetAllBrand = () => {
  const { isBrandLoading, hasFetched } = useSelector(
    (state: RootState) => state.brand
  );console.log(  )

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!hasFetched && !isBrandLoading) {
      dispatch(fetchBrands());
    }
  }, [hasFetched, isBrandLoading, dispatch]);
  return (
   null
  )
}

export default GetAllBrand