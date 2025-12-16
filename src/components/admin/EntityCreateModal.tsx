"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import type { MaterialCategory } from "./category/types/CategoryModel";
import type { MaterialBrandModel } from "./brand/types/brandModel";
import { MaterialAttributes } from "./attribute/types/attributeModel";
import { MaterialSegmentModel } from "./segment/types/SegmentModel";

type Props = { entity: string };

export default function EntityCreateModal({ entity }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // read tenant and website from redux store so we can include them in payloads
  const currentWebsite = useSelector((state: RootState) => state.websites.currentWebsite);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();


  // Category-specific state derived from MaterialCategory
  const [category, setCategory] = useState<MaterialCategory>({
    name: "",
    icon: "",
    sort_order: 0,
  });

  const [segment, setSegment] = useState<MaterialSegmentModel>({
    name: "",
    color: "",
    color_code: "",
    icon: "",
    icon_svg: "",
    index: 0,
    is_active: false,
    is_visible: false,
    description: "",
    short_code: "",
    categories: "",
    gallery: "",
  });
  // Brand-specific state derived from MaterialBrandModel
  const [brand, setBrand] = useState<MaterialBrandModel>({
    name: "",
    url: "",
    description: "",
    logo: "",
  });

  const [attribute, setAttribute] = useState<MaterialAttributes>({
    name: "",
    unit: "",
    possible_values: [],
    type: undefined,
    category_id: null,
  });
  // Generic simple state for other entities
  const [name, setName] = useState("");
  const [extra, setExtra] = useState("");

  const close = () => {
    setOpen(false);
    setError(null);
    setLoading(false);
    // reset
    setCategory({ name: "", icon: "", sort_order: 0 });
    setSegment({
      name: "",
      color: "",
      color_code: "",
      icon: "",
      icon_svg: "",
      index: 0,
      is_active: false,
      is_visible: false,
      description: "",
      short_code: "",
      categories: "",
      gallery: "",
    });
    setBrand({ name: "", url: "", description: "", logo: "" });
    setAttribute({ name: "", unit: "", possible_values: [], type: undefined, category_id: null });
    setName("");
    setExtra("");
  };

  // Reset form state when entity changes so the visible fields match the current entity
  useEffect(() => {
    setError(null);
    setLoading(false);
    setCategory({ name: "", icon: "", sort_order: 0 });
    setBrand({ name: "", url: "", description: "", logo: "" });
    setSegment({
      name: "",
      color: "",
      color_code: "",
      icon: "",
      icon_svg: "",
      index: 0,
      is_active: false,
      is_visible: false,
      description: "",
      short_code: "",
      categories: "",
      gallery: "",
    });
    setAttribute({ name: "", unit: "", possible_values: [], type: undefined, category_id: null });
    setName("");
    setExtra("");
    // Auto-open modal when entity prop changes
    setOpen(false);
  }, [entity]);

  // Validation state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (entity === "category") {
      if (!category.name || category.name.trim() === "")
        errs.name = "Name is required";
      if (Number.isNaN(Number(category.sort_order)) || category.sort_order! < 0)
        errs.sort_order = "Sort order must be >= 0";
    } else if (entity === "segment") {
      if (!segment.name || segment.name.trim() === "") errs.name = "Name is required";
      // optionally validate index
      if (Number.isNaN(Number(segment.index ?? 0)) || (segment.index ?? 0) < 0)
        errs.index = "Index must be >= 0";
    } else if (entity === "brand") {
      if (!brand.name || brand.name.trim() === "")
        errs.name = "Name is required";
      if (brand.url && brand.url.trim() !== "") {
        // basic URL validation
        try {
          // allow data: URLs (from stub upload) and http(s)
          if (
            !(brand.url.startsWith("data:") || /^https?:\/\//.test(brand.url))
          ) {
            // attempt to construct URL to validate
            new URL(brand.url);
          }
        } catch {
          errs.url = "Invalid URL format";
        }
      }
    } else {
      if (!name || name.trim() === "") errs.name = "Name is required";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // File upload stub: read file as data URL and store in brand.logo
  const handleLogoFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setBrand((b) => ({ ...b, logo: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // client-side validation
    if (!validate()) {
      setLoading(false);
      return;
    }

  let payload: any;
  if (entity === "category") {
    // include websiteId and tenantId for multi-tenant scoping
    payload = { ...category } as any;
    const websiteId = currentWebsite?.websiteId ?? currentWebsite?._id;
    if (websiteId) payload.websiteId = websiteId;
    if (currentUser?.tenantId) payload.tenantId = currentUser.tenantId;
  }
  else if (entity === "segment") payload = segment;
  else if (entity === "brand") {
      payload = { ...brand } as any;
    const websiteId = currentWebsite?.websiteId ?? currentWebsite?._id;
    if (websiteId) payload.websiteId = websiteId;
    if (currentUser?.tenantId) payload.tenantId = currentUser.tenantId;
  }
  else if (entity === "attribute") payload = attribute;
  else payload = { name, extra };

    try {
      const res = await fetch(`/api/admin/${entity}`, {
        method: "POST",
        credentials: 'same-origin',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Try to parse JSON body for structured errors or response
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const msg = data?.error ?? data?.message ?? (typeof data === 'string' ? data : undefined) ?? "Failed to create";
        throw new Error(msg);
      }

      // If backend returned the created resource, add it to redux so UI updates immediately
      try {
        if (entity === "category") {
          // backend may return the created item directly or under keys like `item` or `category`
          const created = data?.item ?? data?.category ?? data;
          if (created) {
      
            const { addCategory } = await import("@/hooks/slices/category/CategorySlice");
            dispatch(addCategory(created));
          }
        }
      } catch (e) {
        // ignore dispatch errors and continue with navigation
        // (we still close the modal and navigate back)
      }

      close();
      // navigate back to list or refresh
      router.push(`/admin/${entity}`);
    } catch (err: any) {
      setError(err?.message || "Unexpected error");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm btn btn-primary"
        type="button"
      >
        + New {entity}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={close} />
          <div className="relative z-10 w-full max-w-lg rounded bg-background p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Create new {entity}</h2>
            <form onSubmit={submit} className="space-y-4">
              {entity === "category" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      value={category.name || ""}
                      onChange={(e) =>
                        setCategory({ ...category, name: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border p-2"
                    />
                    {fieldErrors.name && (
                      <div className="text-sm text-destructive mt-1">
                        {fieldErrors.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Icon</label>
                    <div className="mt-1 flex gap-2">
                      {["tag", "star", "folder", "bookmark", "grid"].map(
                        (ic) => (
                          <button
                            key={ic}
                            type="button"
                            onClick={() =>
                              setCategory({ ...category, icon: ic })
                            }
                            className={`px-2 py-1 rounded border ${
                              category.icon === ic ? "bg-accent text-white" : ""
                            }`}
                          >
                            {ic}
                          </button>
                        )
                      )}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Selected: {category.icon}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Sort order
                    </label>
                    <input
                      type="number"
                      value={category.sort_order ?? 0}
                      onChange={(e) =>
                        setCategory({
                          ...category,
                          sort_order: Number(e.target.value),
                        })
                      }
                      className="mt-1 block w-full rounded-md border p-2"
                    />
                    {fieldErrors.sort_order && (
                      <div className="text-sm text-destructive mt-1">
                        {fieldErrors.sort_order}
                      </div>
                    )}
                  </div>
                </>
              ) : entity === "segment" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      value={segment.name || ""}
                      onChange={(e) => setSegment({ ...segment, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border p-2"
                    />
                    {fieldErrors.name && (
                      <div className="text-sm text-destructive mt-1">{fieldErrors.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Color</label>
                    <input
                      value={segment.color || ""}
                      onChange={(e) => setSegment({ ...segment, color: e.target.value })}
                      className="mt-1 block w-full rounded-md border p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Index</label>
                    <input
                      type="number"
                      value={segment.index ?? 0}
                      onChange={(e) => setSegment({ ...segment, index: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border p-2"
                    />
                    {fieldErrors.index && (
                      <div className="text-sm text-destructive mt-1">{fieldErrors.index}</div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={segment.is_active}
                        onChange={(e) => setSegment({ ...segment, is_active: e.target.checked })}
                      />
                      <span className="text-sm">Active</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={segment.is_visible}
                        onChange={(e) => setSegment({ ...segment, is_visible: e.target.checked })}
                      />
                      <span className="text-sm">Visible</span>
                    </label>
                  </div>
                </>
              ) : entity === "brand" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      value={brand.name || ""}
                      onChange={(e) =>
                        setBrand({ ...brand, name: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border p-2"
                    />
                    {fieldErrors.name && (
                      <div className="text-sm text-destructive mt-1">
                        {fieldErrors.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">URL</label>
                    <input
                      value={brand.url || ""}
                      onChange={(e) =>
                        setBrand({ ...brand, url: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border p-2"
                    />
                    {fieldErrors.url && (
                      <div className="text-sm text-destructive mt-1">
                        {fieldErrors.url}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Logo</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleLogoFile(
                          e.target.files ? e.target.files[0] : undefined
                        )
                      }
                      className="mt-1 block w-full rounded-md border p-2"
                    />
                    {brand.logo && (
                      <div className="mt-2">
                        <img
                          src={brand.logo}
                          alt="logo preview"
                          className="h-16 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      value={brand.description || ""}
                      onChange={(e) =>
                        setBrand({ ...brand, description: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border p-2"
                      rows={3}
                    />
                  </div>
                </>
              ) : entity === "attribute" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      value={attribute.name || ""}
                      onChange={(e) => setAttribute({ ...attribute, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border p-2"
                    />
                    {fieldErrors.name && (
                      <div className="text-sm text-destructive mt-1">{fieldErrors.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Data type</label>
                    <select
                      value={attribute.data_type || ""}
                      onChange={(e) => setAttribute({ ...attribute, data_type: e.target.value as any })}
                      className="mt-1 block w-full rounded-md border p-2"
                    >
                      <option value="">Select type</option>
                      <option value="enum">enum</option>
                      <option value="number">number</option>
                      <option value="text">text</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Possible values (comma separated)</label>
                    <input
                      value={(attribute.possible_values || []).join(",")}
                      onChange={(e) => setAttribute({ ...attribute, possible_values: e.target.value ? e.target.value.split(",").map(v => v.trim()) : [] })}
                      className="mt-1 block w-full rounded-md border p-2"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-md border p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Extra</label>
                    <input
                      value={extra}
                      onChange={(e) => setExtra(e.target.value)}
                      className="mt-1 block w-full rounded-md border p-2"
                    />
                  </div>
                </>
              )}

              {error && <div className="text-sm text-destructive">{error}</div>}

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm text-white"
                >
                  {loading ? "Creating…" : "Create"}
                </button>
                <button type="button" className="text-sm" onClick={close}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
