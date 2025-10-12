export default function LeadBoard() {
  const stages = ['new','qualified','inspection_booked','offer_made','won','lost'];
  return (
    <main className="p-6 grid grid-cols-6 gap-4">
      {stages.map(s => (
        <section key={s} className="border rounded p-3">
          <h2 className="font-medium mb-2 capitalize">{s.replace('_',' ')}</h2>
          <div className="text-sm opacity-60">(Cards appear here)</div>
        </section>
      ))}
    </main>
  );
}
