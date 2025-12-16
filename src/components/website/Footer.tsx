import Link from 'next/link';

export function WebsiteFooter({ branding }: { branding?: any }) {
  const footer = branding?.footer || {};
  const links: { label: string; href: string }[] = footer.links || [];
  return (
    <footer className="w-full border-t mt-10">
      <div className="max-w-5xl mx-auto p-4 flex items-center justify-between text-sm text-gray-600">
        <div>{footer.text || '© Dzinly'}</div>
        <nav className="flex items-center gap-4">
          {links.map((l, i) => (
            <Link key={i} href={l.href} className="hover:underline">{l.label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
