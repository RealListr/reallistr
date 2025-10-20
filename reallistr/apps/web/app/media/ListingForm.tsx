// …inside the component’s state
const [floorLevel, setFloorLevel] = useState<number | ''>('');
const [floorHeightM, setFloorHeightM] = useState<number | ''>(3.2);

// …in your <form> where the other fields live
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
  {/* left column … keep your current fields */}

  {/* right column – add these two under your location inputs */}
  <label>
    Level
    <input
      type="number"
      min={1}
      value={floorLevel}
      onChange={(e) => setFloorLevel(e.target.value === '' ? '' : Number(e.target.value))}
      placeholder="e.g. 18"
      style={{ width: '100%' }}
    />
  </label>

  <label>
    Floor height (m)
    <input
      type="number"
      step="0.1"
      min={2.6}
      value={floorHeightM}
      onChange={(e) => setFloorHeightM(e.target.value === '' ? '' : Number(e.target.value))}
      placeholder="3.2"
      style={{ width: '100%' }}
    />
  </label>
</div>
