
"use client"
import { fetchSegments } from '@/hooks/slices/segment/SegmentSlice';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const GetAllSegment = () => {
  const { isSegmentLoading, hasFetched } = useSelector(
    (state: RootState) => state.segment
  );
  const { user } = useSelector((state: RootState) => state.user);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!hasFetched && 
      !isSegmentLoading &&
    currentWebsite &&
  currentWebsite._id) {
      dispatch(fetchSegments({websiteId:currentWebsite._id}));
    }
  }, [hasFetched, isSegmentLoading, user,dispatch,currentWebsite]);

  return null;
}

export default GetAllSegment