"use client";

import React, { useMemo, useState } from 'react'
import { DataTableExt } from '../../DataTableExt';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BrandForm from '../forms/BrandForm';
import { MaterialBrandModel } from '../types/brandModel';
import { Button } from '@/components/ui/button';

const BrandTable = () => {
    const { listBrand, isBrandLoading } = useSelector(
    (state: RootState) => state.brand
  );
  const dispatch = useDispatch<AppDispatch>();
    const { toast } = useToast();
  const router = useRouter();
 const { currentWebsite } = useSelector((state: RootState) => state.websites);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<MaterialBrandModel | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const product_brand = useMemo(() => {
      if (
        currentWebsite &&
        currentWebsite._id &&
        listBrand &&
        listBrand.length > 0
      ) {
        const list = listBrand.filter(
          (item) => item.websiteId === currentWebsite._id
        );
        
        return list.length > 0 ? list : listBrand;
      }
      return [];
    }, [currentWebsite, listBrand]);

  const handleDelete = async (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) {
      toast({ title: 'Delete failed', description: 'Missing id' });
      return;
    }

    const ok = confirm(`Delete brand "${row?.name ?? id}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/brand?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
     // dispatch(removeCategory(id));
      toast({ title: 'Deleted', description: `Brand ${row?.name ?? id} removed` });
    } catch (err: any) {
      console.error('Failed to delete category', err);
      toast({ title: 'Delete failed', description: String(err?.message || err) });
    }
  };

  const handleEdit = (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) return;
    
    // Set the brand data for editing
    setEditingBrand(row);
    setFieldErrors({});
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingBrand) return;
    
    setFieldErrors({});
    const errors: Record<string, string> = {};
    
    if (!editingBrand.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setIsSaving(true);
    try {
      const id = (editingBrand as any)._id ?? editingBrand.id;
      
      // Remove _id from the payload to avoid immutable field error
      const { _id, ...updateData } = editingBrand as any;
      
      const res = await fetch(`/api/admin/brand`, {
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
        description: `Brand ${editingBrand.name} updated successfully` 
      });
      setIsEditDialogOpen(false);
      setEditingBrand(null);
      
      // Refresh the data
      window.location.reload();
    } catch (err: any) {
      console.error('Failed to update brand', err);
      toast({ 
        title: 'Update failed', 
        description: String(err?.message || err),
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoFile = (file?: File) => {
    // Handle logo file upload if needed
  };

  const initialColumns = [
    { key: '_id', label: 'ID', hidden: true },
    { key: 'id', label: 'ID', hidden: true },
    { key: 'name', label: 'Name' },
    { key: 'url', label: 'URL' },
    { key: 'description', label: 'Description' },
    { key: 'logo', label: 'Logo' ,
      render:(value:any)=>value?(
        <img 
          src={value} 
          alt="Product" 
          className="w-12 h-12 object-cover rounded"
        />
      ) : (
        <span className="text-gray-400 text-xs">No image</span>
      )
    },
    { key: 'websiteId', label: 'Website ID' },
    { key: 'tenantId', label: 'Tenant ID' },
    { key: 'created_at', label: 'Created' },
    { key: 'updated_at', label: 'Updated' },
  ];
  return (
    <>
      <div>
        <DataTableExt
          title="Brands"
          data={product_brand ?? []}
          createHref="/admin/brand/create"
          initialColumns={initialColumns}
          onDelete={(row) => handleDelete(row)}
          onView={(row) => handleEdit(row)}
        />
      </div>

      {/* Edit Brand Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          
          {editingBrand && (
            <div className="space-y-4">
              <BrandForm
                brand={editingBrand}
                setBrand={(value) => {
                  if (typeof value === 'function') {
                    setEditingBrand(prev => prev ? value(prev) : null);
                  } else {
                    setEditingBrand(value);
                  }
                }}
                fieldErrors={fieldErrors}
                handleLogoFile={handleLogoFile}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingBrand(null);
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
  )
}

export default BrandTable