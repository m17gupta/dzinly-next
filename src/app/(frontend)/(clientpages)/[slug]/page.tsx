import { auth } from "@/auth";
import { headers } from "next/headers";
const API_BASE_URL = process.env.NEXTAUTH_URL || "http://localhost:55803";

export default async function PageTemplate({ params }: any) {
  const headersList = await headers();

  const host = headersList.get("host");

  console.log("Host===>>>", host)

  const main = await fetch(`${API_BASE_URL}/api/domain/${host}`);

  const domainData = await main.json();

  const param = await params;

  const slugs = !param.hasOwnProperty("slug") ? "home" : param.slug;

  const query = new URLSearchParams({
    id: domainData.item, // page ID
    slug: slugs, // page slug
  }).toString();

  if (!domainData.item) {
    return <>404 Not Found</>;
  }

  const session = await auth();

  console.log(session?.user.role)

  const res = await fetch(`${API_BASE_URL}/api/pages/websites?${query}`);

  const t = await res.json();

  // Check if the response has the expected structure
  if (!t || !t.item || !t.item.content) {
    return <div>Page not found or content unavailable</div>;
  }

  const html = t.item.content;

  const EditButton = (await import("../EditButton")).default;
  return (
    <div>
      {session && session.user && (session.user.role == "owner" || session?.user.role=="A" )&& (
        <EditButton pageData={t.item} />
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
