"use client";
import * as React from "react";
import clsx from "clsx";

type SidebarCtx = { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> };
const SidebarContext = React.createContext<SidebarCtx | null>(null);

export function SidebarProvider({ children, className }: { children: React.ReactNode; className?: string }) {
  const [open, setOpen] = React.useState(true);
  return <SidebarContext.Provider value={{ open, setOpen }}><div className={clsx("flex w-full min-h-screen", className)}>{children}</div></SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) return { open: true, setOpen: () => {} } as unknown as SidebarCtx;
  return ctx;
}

export function Sidebar({ children, className, side, variant, collapsible, style }: { children: React.ReactNode; className?: string; side?: string; variant?: string; collapsible?: string; style?: React.CSSProperties }) {
  const { open } = useSidebar();
  return (
    <aside
      className={clsx(
        "bg-background overflow-hidden",
        open ? "w-[320px] min-w-[320px]" : "w-[64px] min-w-[64px]",
        className
      )}
      style={style}
      aria-expanded={open}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-3 border-b">{children}</div>;
}
export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="p-2">{children}</div>;
}
export function SidebarFooter({ children }: { children: React.ReactNode }) {
  return <div className="p-2 border-t">{children}</div>;
}
export function SidebarRail() {
  return null;
}
export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-1">{children}</ul>;
}
export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}
export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, { children: React.ReactNode; className?: string; size?: string; tooltip?: string; asChild?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, className, size, tooltip, asChild, ...props }, ref) => {
    const classes = clsx("w-full flex items-center gap-2 px-2 py-2 rounded hover:bg-muted/50 text-left", className);
    if (asChild) {
      // Allow Radix primitives to attach handlers/refs via asChild usage
      return (
        <div ref={ref as unknown as React.Ref<HTMLDivElement>} className={classes} {...(props as unknown as React.HTMLAttributes<HTMLDivElement>)}>
          {children}
        </div>
      );
    }
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";
export function SidebarGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("mt-3", className)}>{children}</div>;
}
export function SidebarGroupLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("px-2 text-xs text-muted-foreground uppercase tracking-wide mb-1", className)}>{children}</div>;
}
export function SidebarGroupContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function SidebarMenuSub({ children }: { children: React.ReactNode }) {
  return <ul className="ml-4 space-y-1">{children}</ul>;
}
export function SidebarMenuSubItem({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}
export function SidebarMenuSubButton({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  return <button className="w-full text-left px-2 py-1 rounded hover:bg-muted/50">{children}</button>;
}
export function SidebarInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx("w-full border rounded px-2 py-1 text-sm", props.className)} />;
}
export function SidebarInset({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("flex-1", className)}>{children}</div>;
}
export function SidebarTrigger({ className }: { className?: string }) {
  const { setOpen } = useSidebar();
  return <button className={clsx("px-2 py-1 border rounded", className)} onClick={() => setOpen((o) => !o)}>☰</button>;
}
export function Collapsible({ children, asChild, defaultOpen, className }: { children: React.ReactNode; asChild?: boolean; defaultOpen?: boolean; className?: string }) {
  return <div className={className}>{children}</div>;
}
export function CollapsibleTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactNode }) {
  return <div>{children}</div>;
}
export function CollapsibleContent({ children }: { children: React.ReactNode }) {
  return <div className="ml-2">{children}</div>;
}
