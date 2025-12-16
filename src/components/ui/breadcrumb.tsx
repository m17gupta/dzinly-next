"use client";
import * as React from "react";

export function Breadcrumb({ children }: { children: React.ReactNode }) {
  return <nav aria-label="Breadcrumb">{children}</nav>;
}
export function BreadcrumbList({ children }: { children: React.ReactNode }) {
  return <ol className="flex items-center gap-2 text-sm">{children}</ol>;
}
export function BreadcrumbItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <li className={className}>{children}</li>;
}
export function BreadcrumbLink({ href, children }: { href?: string; children: React.ReactNode }) {
  return href ? <a href={href} className="text-muted-foreground hover:underline">{children}</a> : <span>{children}</span>;
}
export function BreadcrumbPage({ children }: { children: React.ReactNode }) {
  return <span className="font-medium">{children}</span>;
}
export function BreadcrumbSeparator({ className }: { className?: string }) {
  return <span className={className}>/</span>;
}
