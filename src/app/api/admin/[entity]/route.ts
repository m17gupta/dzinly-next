import { NextRequest, NextResponse } from "next/server";

// Example services (replace with DB / Payload / Prisma / etc)
import {
  createCategory,
  listCategories,
  getCategoryById,
  deleteCategory,
} from "@/lib/material/category";
import {
  getBrandById,
  updateBrand,
  createBrand,
  listBrands,
} from "@/lib/material/product_brand";

export async function POST(req: NextRequest, ctx: any) {
  // `ctx.params` may be a Promise in Next.js app routes; await the context
  // before accessing its properties to avoid the sync-dynamic-apis warning.
  // `ctx.params` may be a Promise in Next.js app routes; await `ctx.params`
  // before accessing its properties to avoid the sync-dynamic-apis warning.
  const params = (await ctx?.params) ?? {};
  const { entity } = params ?? {};

  try {
    const body = await req.json();

    let result;

    switch (entity) {
      case "category":
      case "product_categories":
        result = await createCategory(body);
        break;

      case "brand":
        result = await createBrand(body);
        break;

      case "segment":
        //  result = await createSegment(body);
        break;

      case "attribute":
        // result = await createAttribute(body);
        break;

      default:
      // return NextResponse.json(
      //   { error: `Unsupported entity: ${entity}` },
      //   { status: 400 }
      // );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, ctx: any) {
  // Await ctx.params specifically (it may be a Promise) before reading its props.
  const params = (await ctx?.params) ?? {};
  const { entity } = params ?? {};

  try {
    const id = req.nextUrl?.searchParams?.get("id");
    switch (entity) {
      case "category":
      case "product_categories": {
        if (id) {
          const item = await getCategoryById(id);
          if (!item)
            return NextResponse.json({ error: "Not found" }, { status: 404 });
          return NextResponse.json({ item });
        }

        const items = await listCategories();
        return NextResponse.json({ items });
      }

      case "brand": {
        if (id) {
          const item = await getBrandById(id);
          if (!item)
            return NextResponse.json({ error: "Not found" }, { status: 404 });
          return NextResponse.json({ item });
        }
        const items = await listBrands();
        return NextResponse.json({ items });

      }

      default:
        return NextResponse.json(
          { error: `Unsupported entity: ${entity}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, ctx: any) {
  const params = (await ctx?.params) ?? {};
  const { entity } = params ?? {};

  try {
    // id in query or body
    const idFromQuery = req.nextUrl?.searchParams?.get("id");
    let id = idFromQuery;
    if (!id) {
      const body = await req.json().catch(() => null);
      id = body?.id ?? body?._id;
    }

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    switch (entity) {
      case "category":
      case "product_categories": {
        const deleted = await deleteCategory(id);
        if (!deleted)
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: `Unsupported entity: ${entity}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, ctx: any) {
  const params = (await ctx?.params) ?? {};
  const { entity } = params ?? {};

  try {
    const body = await req.json();

    switch (entity) {
      case "product_brand":
      case "brand": {
        const id = body?.id ?? body?._id;
        if (!id)
          return NextResponse.json({ error: "Missing id" }, { status: 400 });

        const updated = await updateBrand(id, body);
        if (!updated)
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json({ item: updated });
      }

      default:
        return NextResponse.json(
          { error: `Unsupported entity: ${entity}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
