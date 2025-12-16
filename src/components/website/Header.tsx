import Link from 'next/link';

export function WebsiteHeader({ branding }: { branding?: any }) {
  const header = branding?.header || {};
  const links: { label: string; href: string }[] = header.navLinks || [];
  return (
    <header className="w-full border-b">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {header.logoUrl ? (
            <img src={header.logoUrl} alt="logo" className="h-8 w-auto" />
          ) : (
            <span className="font-semibold">Site</span>
          )}
        </div>
        <nav className="flex items-center gap-4">
          {links.map((l, i) => (
            <Link key={i} href={l.href} className="text-sm text-blue-600 hover:underline">{l.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
