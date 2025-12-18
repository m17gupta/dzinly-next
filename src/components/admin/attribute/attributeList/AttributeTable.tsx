"use client";
import { AppDispatch, RootState } from '@/store/store';
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { DataTableExt } from '@/components/admin/DataTableExt';
import { removeAttribute } from '@/hooks/slices/attribute/AttributeSlice';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { MaterialAttributes } from '../types/attributeModel';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AttributeForm from '../forms/AttributeForm';

const AttributeTable = () => {

  const { listAttribute, isAttributeLoading } = useSelector(
    (state: RootState) => state.attribute
  );
    const { listCategory,  } = useSelector(
    (state: RootState) => state.category
  );
   const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const router = useRouter();

  // Edit modal state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<MaterialAttributes | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const product_attribute = useMemo(() => {
    if (
      listCategory &&
      listCategory.length &&
      listAttribute &&
      listAttribute.length > 0
    ) {
      return listAttribute.map(item => {
        const catId = item.category_id;
        const category = listCategory.find(cat => cat._id == catId)
        return {
          ...item,
          category: category
        };
      });
    }
    return [];
  }, [listCategory, listAttribute]);

  const handleDelete = async (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) {
      toast({ title: 'Delete failed', description: 'Missing id' });
      return;
    }

    const ok = confirm(`Delete attribute "${row?.name ?? id}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/attribute/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      dispatch(removeAttribute(id));
      toast({ title: 'Deleted', description: `Attribute ${row?.name ?? id} removed` });
    } catch (err: any) {
      console.error('Failed to delete attribute', err);
      toast({ title: 'Delete failed', description: String(err?.message || err) });
    }
  };

  const handleView = (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) return;
    setEditingAttribute(row);
    setFieldErrors({});
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingAttribute) return;
    const id = (editingAttribute as any)._id ?? editingAttribute.id;
    if (!id) {
      toast({ title: 'Save failed', description: 'Missing ID' });
      return;
    }

    setIsSaving(true);
    try {
      // Remove _id from the payload to avoid MongoDB immutable field error
      const { _id, ...updateData } = editingAttribute as any;
      const res = await fetch(`/api/admin/attribute`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updateData, id }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        if (body.errors) {
          setFieldErrors(body.errors);
        }
        throw new Error(body?.error || `HTTP ${res.status}`);
      }

      const updated = await res.json();
      toast({ title: 'Saved', description: 'Attribute updated successfully' });
      setIsEditDialogOpen(false);
      setEditingAttribute(null);
      setFieldErrors({});
      
      // Reload the data
      window.location.reload();
    } catch (err: any) {
      console.error('Failed to save attribute', err);
      toast({ title: 'Save failed', description: String(err?.message || err) });
    } finally {
      setIsSaving(false);
    }
  };

  const initialColumns = [
    { key: '_id', label: 'ID', hidden: true },
    { key: 'id', label: 'ID', hidden: true },
    { key: 'name', label: 'Name' },
    { 
      key: 'category', 
      label: 'Category',
      render: (value: any, row: any) => value?.name || '-'
    },
    { key: 'createdAt', label: 'Created' },
  ];

  return (
    <div>
      <DataTableExt
        title="Attributes"
        data={product_attribute ?? []}
        createHref="/admin/attribute/create"
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Attribute</DialogTitle>
          </DialogHeader>
          
          {editingAttribute && (
            <div className="space-y-4 py-4">
              <AttributeForm
                attribute={editingAttribute}
                setAttribute={(value) => {
                  if (typeof value === 'function') {
                    setEditingAttribute((prev) => (prev ? value(prev) : null));
                  } else {
                    setEditingAttribute(value);
                  }
                }}
                fieldErrors={fieldErrors}
                filterCategory={listCategory ?? []}
              />
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingAttribute(null);
                setFieldErrors({});
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AttributeTable