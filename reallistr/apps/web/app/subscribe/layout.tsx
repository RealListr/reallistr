"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`block rounded-xl px-3 py-2 text-sm transition
        ${active ? "bg-black text-white" : "hover:bg-gray-100 text-gray-800"}`}
    >
      {children}
    </Link>
  );
}

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const step = pathname === "/subscribe/media" ? 2 : 1;

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Pick a subscription, then upload your agents
          </h1>
          <p className="text-base text-gray-600 mt-2">
            Keep it simple. We’ll wire payments after this MVP works. Selectors are saved with the order; pricing shown is ex-GST. Total shows GST added.
          </p>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">Step {step}</span> / 2
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-start">
        <aside className="md:sticky md:top-6">
          <nav className="space-y-2">
            <NavItem href="/subscribe">Plan</NavItem>
            <NavItem href="/subscribe/media">Media</NavItem>
          </nav>
        </aside>

        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
