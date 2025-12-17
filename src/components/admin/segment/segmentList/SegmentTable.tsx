"use client";
import { AppDispatch, RootState } from "@/store/store";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTableExt } from "@/components/admin/DataTableExt";
import { removeSegment } from "@/hooks/slices/segment/SegmentSlice";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { MaterialSegmentModel } from "../types/SegmentModel";

const SegmentTable = () => {
  const { listSegment, isSegmentLoading } = useSelector(
    (state: RootState) => state.segment
  );
  const { user } = useSelector((state: RootState) => state.user);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const router = useRouter();

  const segments = useMemo(() => {
    if (
      currentWebsite &&
      currentWebsite._id &&
      listSegment &&
      listSegment.length > 0
    ) {
      const list = listSegment.filter(
        (item) => item.websiteId === currentWebsite._id
      );
      
      return list.length > 0 ? list : listSegment;
    }
    return [];
  }, [currentWebsite, listSegment]);

  const handleDelete = async (row: any) => {
    const id = row?._id ?? row?.id;
    if (!id) {
      toast({ title: "Delete failed", description: "Missing id" });
      return;
    }

    const ok = confirm(`Delete segment "${row?.name ?? id}"?`);
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/segment/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `HTTP ${res.status}`);
      }
      dispatch(removeSegment(id));
      toast({
        title: "Deleted",
        description: `Segment ${row?.name ?? id} removed`,
      });
    } catch (err: any) {
      console.error("Failed to delete segment", err);
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
    router.push(`/admin/segment/${id}`);
  };

  const initialColumns = [
    { key: "_id", label: "ID", hidden: true },
    { key: "id", label: "ID", hidden: true },
    { key: "name", label: "Name" },
    { key: "color", label: "Color" },
    { key: "color_code", label: "Color Code" },
    { key: "icon", label: "Icon" },
    { key: "short_code", label: "Short Code" },
    { key: "is_active", label: "Active" },
    { key: "createdAt", label: "Created" },
  ];

  return (
    <div>
      <DataTableExt
        title="Segments"
        data={segments ?? []}
        createHref="/admin/segment/create"
        initialColumns={initialColumns}
        onDelete={(row) => handleDelete(row)}
        onView={(row) => handleView(row)}
      />
    </div>
  );
};

export default SegmentTable;