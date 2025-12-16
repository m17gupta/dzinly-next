import { ReactNode } from "react";
import { AppShellProvider } from "@/components/admin/AppShellProvider";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AppShellProvider>{children}</AppShellProvider>;
}
