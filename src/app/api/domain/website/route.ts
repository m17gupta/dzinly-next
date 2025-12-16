import { getDatabase } from "@/lib/db/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const _id = new ObjectId(id);

  const db = await getDatabase();
  const collection = db.collection("websites");

  const website = await collection.findOne({ _id });

  return NextResponse.json({
    item: website,
  });
}
