export default function ListingWorkspace() {
  return (
    <main className="p-6 space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Listing Workspace</h1>
        <div className="space-x-2">
          <button className="px-3 py-1 border rounded">Edit</button>
          <button className="px-3 py-1 border rounded">Publish</button>
        </div>
      </div>
      <p className="opacity-70">Tabs: Overview • Details • Media • Marketing • Open Homes • Enquiries • Offers • Compliance • Settings • Activity</p>
    </main>
  );
}
