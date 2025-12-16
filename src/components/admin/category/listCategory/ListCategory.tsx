"use client";
import { AppDispatch, RootState } from '@/store/store';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { DataTableExt } from '@/components/admin/DataTableExt';
import { removeCategory } from '@/hooks/slices/category/CategorySlice';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const ListCategory = () => {
  const { listCategory, isCategoryLoading } = useSelector(
    (state: RootState) => state.category
  );
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) {
      toast({ title: 'Delete failed', description: 'Missing id' });
      return;
    }

    const ok = confirm(`Delete category "${row?.name ?? id}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/category/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      dispatch(removeCategory(id));
      toast({ title: 'Deleted', description: `Category ${row?.name ?? id} removed` });
    } catch (err: any) {
      console.error('Failed to delete category', err);
      toast({ title: 'Delete failed', description: String(err?.message || err) });
    }
  };

  const handleView = (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) return;
    // navigate to edit/view page under admin
    router.push(`/admin/category/${id}`);
  };

  const initialColumns = [
    { key: '_id', label: 'ID', hidden: true },
        { key: 'id', label: 'ID', hidden: true },
    { key: 'name', label: 'Name' },
    { key: 'icon', label: 'Icon' },
    { key: 'sort_order', label: 'Sort Order' },
    { key: 'createdAt', label: 'Created' },
  ];

  return (
    <div>
      <DataTableExt
        title="Categories"
        data={listCategory ?? []}
        createHref="/admin/category/create"
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
      />
    </div>
  )
}

export default ListCategory