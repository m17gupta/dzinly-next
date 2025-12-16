"use client"
import React from "react";
import GetAllBrand from "./brandList/GetAllBrand";
import BrandTable from "./brandList/BrandTable";

const BrandHome = () => {
  return (
    <>
      <GetAllBrand />
      <BrandTable />
    </>
  );
};

export default BrandHome;
