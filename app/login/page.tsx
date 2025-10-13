"use client";
import Link from "next/link";

export default function LoginLanding() {
  return (
    <main className="mx-auto max-w-3xl p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Access RealListr</h1>
        <p className="text-base text-gray-600 mt-2">Choose how you’d like to proceed.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/login/enquiry" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-gray-300">
          <div className="text-base font-semibold">Enquiry / Request Access</div>
          <p className="text-sm text-gray-600 mt-1">For new agencies/agents who need preliminary access.</p>
        </Link>
        <Link href="/login/agency" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-gray-300">
          <div className="text-base font-semibold">Agency Login</div>
          <p className="text-sm text-gray-600 mt-1">Approved subscribers. All access is logged.</p>
        </Link>
      </div>
    </main>
  );
}
