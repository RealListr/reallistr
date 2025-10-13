"use client";
import AgentsMedia from "@/components/AgentsMedia";
import ExternalMediaInvite from "@/components/ExternalMediaInvite";

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <AgentsMedia />
      <ExternalMediaInvite />
    </div>
  );
}
