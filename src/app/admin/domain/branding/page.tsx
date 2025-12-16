"use client";
import { useEffect, useState } from 'react';

export default function WebsiteBrandingPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [navLinks, setNavLinks] = useState<{ label: string; href: string }[]>([]);
  const [footerText, setFooterText] = useState('');
  const [footerLinks, setFooterLinks] = useState<{ label: string; href: string }[]>([]);

  async function load() {
    try {
      setLoading(true); setError(null);
      const res = await fetch('/api/websites/current');
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to load');
      const { website } = await res.json();
      const branding = website?.branding || {};
      setLogoUrl(branding.header?.logoUrl || '');
      setNavLinks(branding.header?.navLinks || []);
      setFooterText(branding.footer?.text || '');
      setFooterLinks(branding.footer?.links || []);
    } catch (e: any) {
      setError(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/websites/current/branding', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        header: { logoUrl: logoUrl || null, navLinks },
        footer: { text: footerText || null, links: footerLinks },
      })
    });
    if (!res.ok) {
      let msg = 'Save failed'; try { msg = (await res.json()).error || msg; } catch {}
      setError(msg); return;
    }
    await load();
  };

  const addNav = () => setNavLinks([...navLinks, { label: '', href: '' }]);
  const addFoot = () => setFooterLinks([...footerLinks, { label: '', href: '' }]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Website Branding</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={save} className="space-y-4">
        <div className="p-4 border rounded space-y-2">
          <h2 className="font-medium">Header</h2>
          <label className="block text-sm">Logo URL</label>
          <input className="border px-2 py-1 rounded w-full" value={logoUrl} onChange={e=>setLogoUrl(e.target.value)} placeholder="https://..." />
          <div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium">Nav links</span>
              <button type="button" className="text-blue-600 underline" onClick={addNav}>Add</button>
            </div>
            <div className="space-y-2 mt-2">
              {navLinks.map((l, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <input className="border px-2 py-1 rounded" placeholder="Label" value={l.label} onChange={e=>{
                    const a=[...navLinks]; a[idx]={...a[idx], label:e.target.value}; setNavLinks(a);
                  }} />
                  <input className="border px-2 py-1 rounded" placeholder="Href" value={l.href} onChange={e=>{
                    const a=[...navLinks]; a[idx]={...a[idx], href:e.target.value}; setNavLinks(a);
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border rounded space-y-2">
          <h2 className="font-medium">Footer</h2>
          <label className="block text-sm">Footer Text</label>
          <input className="border px-2 py-1 rounded w-full" value={footerText} onChange={e=>setFooterText(e.target.value)} placeholder="© Your Company" />
          <div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium">Footer Links</span>
              <button type="button" className="text-blue-600 underline" onClick={addFoot}>Add</button>
            </div>
            <div className="space-y-2 mt-2">
              {footerLinks.map((l, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <input className="border px-2 py-1 rounded" placeholder="Label" value={l.label} onChange={e=>{
                    const a=[...footerLinks]; a[idx]={...a[idx], label:e.target.value}; setFooterLinks(a);
                  }} />
                  <input className="border px-2 py-1 rounded" placeholder="Href" value={l.href} onChange={e=>{
                    const a=[...footerLinks]; a[idx]={...a[idx], href:e.target.value}; setFooterLinks(a);
                  }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-3 py-2 rounded">Save</button>
      </form>
    </div>
  );
}
