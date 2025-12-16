import { NextRequest } from "next/server";
import { getDatabase } from "@/lib/db/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ host: string }> }
) {
  const { host } = await params; // 


  const db = await getDatabase();
  const collection = db.collection("websites");

  const website = await collection.findOne({
    primaryDomain: { $in: [host] },
  });

  // console.log("website---->",website)
  if (website) {
    return Response.json({ item: String(website._id) });
  }

  return Response.json({ item: null });
}
