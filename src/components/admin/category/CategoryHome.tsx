"use client"
import { AppDispatch, RootState } from '@/store/store'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import GetAllcategory from './listCategory/GetAllcategory'
import ListCategory from './listCategory/ListCategory'

const CategoryHome = () => {

  const {listCategory , isCategoryLoading}= useSelector((state:RootState)=>state.category)
    const dispatch= useDispatch<AppDispatch>()
  return (
<>

<GetAllcategory/>
<ListCategory/>
</>
  )
}

export default CategoryHome