"use client";
import { AppDispatch, RootState } from "@/store/store";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTableExt } from "@/components/admin/DataTableExt";
import { removeProduct } from "@/hooks/slices/product/ProductSlice";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const ProductTable = () => {
  const { listProduct, isProductLoading } = useSelector(
    (state: RootState) => state.product
  );
  const { listCategory } = useSelector((state: RootState) => state.category);
  const { listBrand } = useSelector((state: RootState) => state.brand);
  const { listSegment } = useSelector((state: RootState) => state.segment);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const router = useRouter();

  const products = useMemo(() => {
    if (listProduct && listProduct.length > 0) {
      return listProduct.map((item) => {
        const categoryId = item.product_category_id;
        const brandId = item.brand_id;
        const segmentId = item.material_segment_id;

        const category = listCategory.find(
          (cat) => cat._id == categoryId
        )?.name;
        const brand = listBrand.find((b) => (b as any)._id == brandId)?.name;
        const segment = listSegment.find(
          (s) => (s as any)._id == segmentId
        )?.name;

        return {
          ...item,
          category: category || "-",
          brand: brand || "-",
          segment: segment || "-",
        };
      });
    }
    return [];
  }, [listCategory, listBrand, listSegment, listProduct]);

  const handleDelete = async (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) {
      toast({ title: "Delete failed", description: "Missing id" });
      return;
    }

    const ok = confirm(`Delete product "${row?.name ?? id}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      dispatch(removeProduct(id));
      toast({
        title: "Deleted",
        description: `Product ${row?.name ?? id} removed`,
      });
    } catch (err: any) {
      console.error("Failed to delete product", err);
      toast({
        title: "Delete failed",
        description: String(err?.message || err),
      });
    }
  };

  const handleView = (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) return;
    // navigate to edit/view page under admin
    router.push(`/admin/products/${id}`);
  };

  const initialColumns = [
    { key: "_id", label: "ID", hidden: true },
    { key: "id", label: "ID", hidden: true },
    { key: "product_category_id", label: "Product category Id", hidden: true },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "category", label: "Category" },
    { key: "brand", label: "Brand" },
    { key: "segment", label: "Segment" },
    { key: "base_price", label: "Price" },
    { key: "createdAt", label: "Created" },
  ];

  return (
    <div>
      <DataTableExt
        title="Products"
        data={products ?? []}
        createHref="/admin/products/create"
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
      />
    </div>
  );
};

export default ProductTable;
