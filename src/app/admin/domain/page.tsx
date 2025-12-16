// "use client";
// import { useEffect, useState } from 'react';

// export default function WebsitesPage() {
//   const [items, setItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentId, setCurrentId] = useState<string | null>(null);

//   const [name, setName] = useState('');
//   const [serviceType, setServiceType] = useState<'WEBSITE_ONLY' | 'ECOMMERCE'>('WEBSITE_ONLY');
//   const [primaryDomain, setPrimaryDomain] = useState('');

//   async function load() {
//     try {
//       setLoading(true);
//       setError(null);
//       const [listRes, curRes] = await Promise.all([
//         fetch('/api/domain'),
//         fetch('/api/session/website')
//       ]);
//       if (!listRes.ok) throw new Error('Failed to load websites');
//       const listJson = await listRes.json();
//       setItems(listJson.items || []);
//       if (curRes.ok) {
//         const curJson = await curRes.json();
//         setCurrentId(curJson.websiteId || null);
//       }
//     } catch (e: any) {
//       setError(e?.message || 'Error');
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => { load(); }, []);

//   const onCreate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const res = await fetch('/api/websites', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ name, serviceType, primaryDomain: primaryDomain || null }),
//     });
//     if (res.ok) {
//       setName(''); setPrimaryDomain(''); setServiceType('WEBSITE_ONLY');
//       load();
//     } else {
//       let msg = '';
//       try { msg = (await res.json()).error; } catch {}
//       alert('Create failed: ' + (msg || res.status));
//     }
//   };

//   const setCurrent = async (websiteId: string) => {
//     const res = await fetch('/api/session/website', {
//       method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ websiteId })
//     });
//     if (res.ok) load();
//   };

//   return (
//     <div className="space-y-6">
//       <h1 className="text-xl font-semibold">Websites</h1>
//       <form onSubmit={onCreate} className="space-y-3 p-4 border rounded">
//         <div>
//           <label className="block text-sm mb-1">Name</label>
//           <input className="border px-2 py-1 rounded w-full" value={name} onChange={(e) => setName(e.target.value)} required />
//         </div>
//         <div>
//           <label className="block text-sm mb-1">Service Type</label>
//           <select className="border px-2 py-1 rounded w-full" value={serviceType} onChange={(e) => setServiceType(e.target.value as any)}>
//             <option value="WEBSITE_ONLY">WEBSITE_ONLY</option>
//             <option value="ECOMMERCE">ECOMMERCE</option>
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm mb-1">Primary Domain (optional)</label>
//           <input className="border px-2 py-1 rounded w-full" value={primaryDomain} onChange={(e) => setPrimaryDomain(e.target.value)} placeholder="https://www.example.com" />
//         </div>
//         <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">Create</button>
//       </form>

//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-600">{error}</p>}
//       {!loading && items.length > 0 ? (
//         <div className="mt-4">
//           {/* Use extended shadcn table */}
//           {(() => {
//             const Ext = require('./ExtTable').default as any;
//             return <Ext items={items} currentId={currentId} />
//           })()}
//         </div>
//       ) : (
//         !loading && <p>No websites yet.</p>
//       )}
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function WebsitesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [serviceType, setServiceType] = useState<"WEBSITE_ONLY" | "ECOMMERCE">(
    "WEBSITE_ONLY"
  );
  const [primaryDomains, setPrimaryDomains] = useState<string[]>([]);
  const [currentDomain, setCurrentDomain] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const [listRes, curRes] = await Promise.all([
        fetch("/api/domain"),
        fetch("/api/session/website"),
      ]);
      if (!listRes.ok) throw new Error("Failed to load websites");
      const listJson = await listRes.json();
      setItems(listJson.items || []);
      if (curRes.ok) {
        const curJson = await curRes.json();
        setCurrentId(curJson.websiteId || null);
      }
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const addDomain = () => {
    if (currentDomain.trim()) {
      setPrimaryDomains([...primaryDomains, currentDomain.trim()]);
      setCurrentDomain("");
    }
  };

  const removeDomain = (index: number) => {
    setPrimaryDomains(primaryDomains.filter((_, i) => i !== index));
  };

  const handleDomainKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addDomain();
    }
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/domain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        serviceType,
        primaryDomain: primaryDomains.length > 0 ? primaryDomains : null,
      }),
    });

    console.log(res);
    if (res.ok) {
      setName("");
      setPrimaryDomains([]);
      setCurrentDomain("");
      setServiceType("WEBSITE_ONLY");
      load();
    } else {
      let msg = "";
      try {
        msg = (await res.json()).error;
      } catch {}
      alert("Create failed: " + (msg || res.status));
    }
  };

  const setCurrent = async (websiteId: string) => {
    const res = await fetch("/api/session/website", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ websiteId }),
    });
    if (res.ok) load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Websites</h1>
      <form onSubmit={onCreate} className="space-y-3 p-4 border rounded">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Service Type</label>
          <select
            className="border px-2 py-1 rounded w-full"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as any)}
          >
            <option value="WEBSITE_ONLY">WEBSITE_ONLY</option>
            <option value="ECOMMERCE">ECOMMERCE</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Primary Domains</label>
          <div className="flex gap-2 mb-2">
            <input
              className="border px-2 py-1 rounded flex-1"
              value={currentDomain}
              onChange={(e) => setCurrentDomain(e.target.value)}
              onKeyPress={handleDomainKeyPress}
              placeholder="https://www.example.com"
            />
            <button
              type="button"
              onClick={addDomain}
              className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700"
            >
              Add
            </button>
          </div>
          {primaryDomains.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {primaryDomains.map((domain, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  <span>{domain}</span>
                  <button
                    type="button"
                    onClick={() => removeDomain(index)}
                    className="hover:text-blue-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && items.length > 0 ? (
        <div className="mt-4">
          {(() => {
            const Ext = require("./ExtTable").default as any;
            return <Ext items={items} currentId={currentId} />;
          })()}
        </div>
      ) : (
        !loading && <p>No websites yet.</p>
      )}
    </div>
  );
}
