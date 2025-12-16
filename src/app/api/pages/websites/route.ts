import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  console.log("search paramass",searchParams)
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");

  // If neither ID nor slug is provided
  if (!id && !slug) {
    return NextResponse.json(
      { error: "Please provide either id or slug" },
      { status: 400 }
    );
  }

  let result;

  const db = await getDatabase()
  const collection = await db.collection("pages")
  const webs = new ObjectId(String(id))
  result = await collection.findOne({slug: "/"+slug, websiteId: webs})
  if (!result) {
    return NextResponse.json(
      { error: "No page found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ item: result });
}



