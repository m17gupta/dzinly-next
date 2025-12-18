"use client";
import { AppDispatch, RootState } from "@/store/store";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTableExt } from "@/components/admin/DataTableExt";
import { removeSegment } from "@/hooks/slices/segment/SegmentSlice";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { MaterialSegmentModel } from "../types/SegmentModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SegmentForm from "../forms/SegmentForm";
import { Button } from "@/components/ui/button";

const SegmentTable = () => {
  const { listSegment, isSegmentLoading } = useSelector(
    (state: RootState) => state.segment
  );
  const { user } = useSelector((state: RootState) => state.user);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const router = useRouter();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<MaterialSegmentModel | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

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
    setEditingSegment(row);
    setFieldErrors({});
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingSegment) return;
    
    setFieldErrors({});
    const errors: Record<string, string> = {};
    
    if (!editingSegment.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setIsSaving(true);
    try {
      const id = (editingSegment as any)._id ?? editingSegment.id;
      const { _id, ...updateData } = editingSegment as any;
      
      const res = await fetch(`/api/admin/segment`, {
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
        description: `Segment ${editingSegment.name} updated successfully` 
      });
      setIsEditDialogOpen(false);
      setEditingSegment(null);
      window.location.reload();
    } catch (err: any) {
      console.error('Failed to update segment', err);
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
    { key: "name", label: "Name" },
    {
      key: "color",
      label: "Color",
    },
    {
      key: "color_code",
      label: "Color Code",
      render: (value: any) => {
        if (!value) return "-";
        return (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: value }}
              title={value}
            />
            <span className="text-xs font-mono">{value}</span>
          </div>
        );
      },
    },
    {
      key: "icon",
      label: "Icon",
      render: (value: any) => {
        if (!value) return "-";
        // If it's a URL to an image
        if (
          typeof value === "string" &&
          (value.startsWith("http") || value.startsWith("/"))
        ) {
          return (
            <img src={value} alt="icon" className="w-8 h-8 object-contain" />
          );
        }
        return value;
      },
    },
    {
      key: "icon_svg",
      label: "Icon SVG",
      render: (value: any) => {
        if (!value) return "-";
        // If it's SVG code, render it directly
        if (typeof value === "string" && value.includes("<svg")) {
          return (
            <div
              className="w-8 h-8 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          );
        }
        return value;
      },
    },
    { key: "short_code", label: "Short Code" },
    { key: "is_active", label: "Active" },
    { key: "createdAt", label: "Created" },
  ];

  return (
    <>
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

      {/* Edit Segment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Segment</DialogTitle>
          </DialogHeader>
          
          {editingSegment && (
            <div className="space-y-4">
              <SegmentForm
                segment={editingSegment}
                setSegment={(value) => {
                  if (typeof value === 'function') {
                    setEditingSegment(prev => prev ? value(prev) : null);
                  } else {
                    setEditingSegment(value);
                  }
                }}
                fieldErrors={fieldErrors}
              />
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingSegment(null);
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

export default SegmentTable;
