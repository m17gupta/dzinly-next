import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BuilderClient from "./BuilderClient";

export default async function Builder() {
  const session = await auth();

  // Check if user is authenticated
  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  // Check if user has permission to edit (owner or admin)
  if (session.user.role !== "owner" && session.user.role !== "A") {
    redirect("/"); // Redirect to home if not authorized
  }

  return <BuilderClient />;
}
