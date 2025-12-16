import Link from "next/link";
import EntityCreateModal from "@/components/admin/EntityCreateModal";
import { listCategories } from "@/lib/material/category";
import { MaterialCategory } from "@/components/admin/category/types/CategoryModel";
import CategoryHome from "@/components/admin/category/CategoryHome";
import BrandHome from "@/components/admin/brand/BrandHome";

export default async function EntityIndexPage(props: any) {
  const params = await props.params;
  const { entity } = params as { entity: string };

  let listCat: MaterialCategory[] = [];
  if (entity === "category") {
    try {
      listCat = await listCategories();
    } catch (err) {
      console.error("Failed to load categories:", err);
      listCat = [];
    }
  }

  return (
    <div className="mx-auto max-w-full px-6">
      <div className="flex items-center justify-between mb-6">
        {/* <h1 className="text-2xl font-semibold capitalize">{entity}</h1> */}
        <EntityCreateModal entity={entity} />
      </div>

    {entity=="category" &&
    <CategoryHome/>}

    {entity=="brand" &&
    <BrandHome/>}
    </div>
  );
}
