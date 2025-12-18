"use client";
import { AppDispatch, RootState } from "@/store/store";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTableExt } from "@/components/admin/DataTableExt";
import { removeProduct } from "@/hooks/slices/product/ProductSlice";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductForm from "../forms/ProductForm";
import { ProductModel } from "../type/ProductModel";
import { Button } from "@/components/ui/button";

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

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductModel | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

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
    setEditingProduct(row);
    setFieldErrors({});
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    
    setFieldErrors({});
    const errors: Record<string, string> = {};
    
    if (!editingProduct.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setIsSaving(true);
    try {
      const id = (editingProduct as any)._id ?? editingProduct.id;
      const { _id, ...updateData } = editingProduct as any;
      
      const res = await fetch(`/api/admin/products`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updateData, id }),
      });
      
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      
      toast({ 
        title: 'Updated', 
        description: `Product ${editingProduct.name} updated successfully` 
      });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      window.location.reload();
    } catch (err: any) {
      console.error('Failed to update product', err);
      toast({ 
        title: 'Update failed', 
        description: String(err?.message || err),
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const initialColumns = [
    { key: "_id", label: "ID", hidden: true },
    { key: "id", label: "ID", hidden: true },
    { key: "product_category_id", label: "Product category Id", hidden: true },
    { key: "name", label: "Name" },
    { 
      key: "photo", 
      label: "Photo",
      render: (value: any) => value ? (
        <img 
          src={value} 
          alt="Product" 
          className="w-12 h-12 object-cover rounded"
        />
      ) : (
        <span className="text-gray-400 text-xs">No image</span>
      )
    },
    { key: "description", label: "Description" },
    { key: "category", label: "Category" },
    { key: "brand", label: "Brand" },
    { key: "segment", label: "Segment" },
    { key: "base_price", label: "Price" },
    { key: "createdAt", label: "Created" },
  ];

  return (
    <>
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

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          
          {editingProduct && (
            <div className="space-y-4">
              <ProductForm
                product={editingProduct}
                setProduct={(value) => {
                  if (typeof value === 'function') {
                    setEditingProduct(prev => prev ? value(prev) : null);
                  } else {
                    setEditingProduct(value);
                  }
                }}
                fieldErrors={fieldErrors}
                filterCategory={listCategory}
                listBrand={listBrand}
                listSegment={listSegment}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingProduct(null);
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductTable;
