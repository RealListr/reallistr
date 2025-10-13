"use client";
import { useState } from "react";
import Link from "next/link";

export default function AgencyLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("MVP login: access will be logged on backend later.");
  };

  return (
    <main className="mx-auto max-w-md p-6 md:p-10">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Agency login</h1>
        <p className="text-sm text-gray-600 mt-1">Authorised subscribers only. All access is logged.</p>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="text-sm block">
            <span className="block font-medium mb-1">Email</span>
            <input className="h-11 w-full rounded-xl border border-gray-300 px-3" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </label>
          <label className="text-sm block">
            <span className="block font-medium mb-1">Passcode</span>
            <input className="h-11 w-full rounded-xl border border-gray-300 px-3" type="password" value={pass} onChange={(e)=>setPass(e.target.value)} required />
          </label>
          <button type="submit" className="h-11 w-full rounded-2xl bg-black text-white">Login</button>
        </form>

        <div className="mt-4 text-xs text-gray-600">New here? <Link href="/login/enquiry" className="underline">Request preliminary access</Link>.</div>
      </div>
    </main>
  );
}
