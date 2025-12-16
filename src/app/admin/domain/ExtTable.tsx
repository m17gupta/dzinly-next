
"use client";
import { DataTableExt } from "@/components/admin/DataTableExt";

export default function WebsitesExtTable({ items, currentId }: { items: any[]; currentId: string | null }) {
  const rows = (items || []).map((w) => ({
    ...w,
    isCurrent: currentId === w.websiteId,
  }));

  return (
    <DataTableExt
      title="Websites"
      data={rows}
      initialColumns={[
        { 
          key: "name", 
          label: "Name", 
          render: (_v, row) => (<a className="underline" href="#">{row.name}</a>) 
        },
        { 
          key: "systemSubdomain", 
          label: "System Subdomain" 
        },
        { 
          key: "primaryDomain", 
          label: "Primary Domains",
          render: (value, row) => {
            // Handle both array and single value for backward compatibility
            const domains = Array.isArray(value) ? value : (value ? [value] : []);
            
            if (domains.length === 0) {
              return <span className="text-gray-400">-</span>;
            }
            
            return (
              <div className="flex flex-wrap gap-1">
                {domains.map((domain: string, index: number) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            );
          }
        },
        { 
          key: "serviceType", 
          label: "Service" 
        },
        { 
          key: "isCurrent", 
          label: "Current" 
        },
      ]}
    />
  );
}