import React from 'react'
import SegmentTable from './segmentList/SegmentTable'
import GetAllSegment from './segmentList/GetAllSegment'

const SegmentHome = () => {
  return (
   <>
   <GetAllSegment/>
   <SegmentTable/>
   </>
  )
}

export default SegmentHome