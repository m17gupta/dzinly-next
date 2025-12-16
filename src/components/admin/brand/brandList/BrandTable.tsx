"use client";

import React from 'react'
import { DataTableExt } from '../../DataTableExt';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const BrandTable = () => {
    const { listBrand, isBrandLoading } = useSelector(
    (state: RootState) => state.brand
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

  const handleView = (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) return;
    // navigate to edit/view page under admin
    router.push(`/admin/brand/${id}`);
  };

  const initialColumns = [
    { key: '_id', label: 'ID', hidden: true },
    { key: 'id', label: 'ID', hidden: true },
    { key: 'name', label: 'Name' },
    { key: 'url', label: 'URL' },
    { key: 'description', label: 'Description' },
    { key: 'logo', label: 'Logo' },
    { key: 'websiteId', label: 'Website ID' },
    { key: 'tenantId', label: 'Tenant ID' },
    { key: 'created_at', label: 'Created' },
    { key: 'updated_at', label: 'Updated' },
  ];
  return (
    <div> <DataTableExt
            title="Brands"
            data={listBrand ?? []}
            createHref="/admin/brand/create"
            initialColumns={initialColumns}
            onDelete={(row) => handleDelete(row)}
            onView={(row) => handleView(row)}
          /></div>
  )
}

export default BrandTable