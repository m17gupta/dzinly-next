"use client";
import { AppDispatch, RootState } from '@/store/store';
import React, { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { DataTableExt } from '@/components/admin/DataTableExt';
import { removeAttribute } from '@/hooks/slices/attribute/AttributeSlice';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { MaterialAttributes } from '../types/attributeModel';

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
    // navigate to edit/view page under admin
    router.push(`/admin/attribute/${id}`);
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
    </div>
  )
}

export default AttributeTable