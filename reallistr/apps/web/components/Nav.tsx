"use client";
import Link from "next/link";

export default function Nav() {
  return (
    <nav style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
      <ul style={{ display: "flex", gap: 24, alignItems: "center", listStyle: "none", margin: 0, padding: 0 }}>
        <li><Link href="/" style={{ fontWeight: 800, fontSize: 24, textDecoration: "underline" }}>RealListr</Link></li>
        <li><Link href="/map">Map</Link></li>
        <li><Link href="/media">Media</Link></li>
      </ul>
    </nav>
  );
}
