import React, { useState, useEffect } from 'react';

const defaultPantry = [
  { id: '1', name: 'Cocoa Powder', price: 70, size: 100, unit: 'g' },
  { id: '2', name: 'Flour (Maida)', price: 65, size: 1000, unit: 'g' },
  { id: '3', name: 'Caster Sugar', price: 50, size: 1000, unit: 'g' },
  { id: '4', name: 'Unsalted Butter', price: 275, size: 500, unit: 'g' },
  { id: '5', name: 'Eggs', price: 90, size: 12, unit: 'pcs' }
];

export default function App() {
  const [tab, setTab] = useState('calc');
  const [pantry, setPantry] = useState(() => {
    const s = localStorage.getItem('cake_pantry');
    return s ? JSON.parse(s) : defaultPantry;
  });

  useEffect(() => {
    localStorage.setItem('cake_pantry', JSON.stringify(pantry));
  }, [pantry]);

  const deletePantryItem = (id) => {
    setPantry(pantry.filter(i => i.id !== id));
  };

  const addPantryItem = (newItem) => {
    setPantry([...pantry, newItem]);
  };

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', background: '#fdfbf7', minHeight: '100vh' }}>
      <h2 style={{ color: '#d97706', marginBottom: '8px' }}>🎂 BakeCost Studio</h2>
      
      {/* Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => setTab('calc')} style={{ flex: 1, padding: '10px', background: tab === 'calc' ? '#d97706' : '#eee', color: tab === 'calc' ? '#fff' : '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Calculator</button>
        <button onClick={() => setTab('pantry')} style={{ flex: 1, padding: '10px', background: tab === 'pantry' ? '#d97706' : '#eee', color: tab === 'pantry' ? '#fff' : '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Pantry ({pantry.length})</button>
      </div>

      {tab === 'calc' ? (
        <CalculatorTab pantry={pantry} />
      ) : (
        <PantryTab pantry={pantry} onAddPantryItem={addPantryItem} onDeletePantryItem={deletePantryItem} />
      )}
    </div>
  );
}

/* ==========================================================================
   CALCULATOR COMPONENT
   ========================================================================== */
function CalculatorTab({ pantry }) {
  const [recipeName, setRecipeName] = useState('My Cake');
  const [items, setItems] = useState([]);
  const [packaging, setPackaging] = useState(50);
  const [labor, setLabor] = useState(100);
  const [margin, setMargin] = useState(40);

  const addRecipeItem = (pantryId) => {
    if (!pantryId || items.some(i => i.pantryId === pantryId)) return;
    setItems([...items, { pantryId, used: 1 }]);
  };

  const updateUsed = (pantryId, val) => {
    setItems(items.map(i => i.pantryId === pantryId ? { ...i, used: parseFloat(val) || 0 } : i));
  };

  const removeRecipeItem = (pantryId) => {
    setItems(items.filter(i => i.pantryId !== pantryId));
  };

  const calcItemCost = (pantryId, used) => {
    const item = pantry.find(p => p.id === pantryId);
    if (!item || item.size === 0) return 0;
    return (item.price / item.size) * (used || 0);
  };

  const ingSubtotal = items.reduce((sum, i) => sum + calcItemCost(i.pantryId, i.used), 0);
  const totalCost = ingSubtotal + (+packaging || 0) + (+labor || 0);
  const suggestedPrice = margin < 100 ? totalCost / (1 - margin / 100) : totalCost;

  return (
    <div>
      <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #ddd' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Recipe Name</label>
        <input value={recipeName} onChange={e => setRecipeName(e.target.value)} style={{ width: '90%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #ccc' }} />
      </div>

      {/* Add Ingredient Dropdown */}
      <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #ddd' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Add Ingredients</h4>
        <select onChange={e => { addRecipeItem(e.target.value); e.target.value = ''; }} style={{ width: '100%', padding: '8px', borderRadius: '6px' }}>
          <option value="">+ Select from Pantry</option>
          {pantry.map(i => <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>)}
        </select>

        <div style={{ marginTop: '12px' }}>
          {items.map(i => {
            const item = pantry.find(p => p.id === i.pantryId);
            if (!item) return null;
            const cost = calcItemCost(i.pantryId, i.used);
            return (
              <div key={i.pantryId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9f9f9', padding: '8px', marginBottom: '6px', borderRadius: '6px', fontSize: '14px' }}>
                <div style={{ flex: 1 }}>
                  <strong>{item.name}</strong>
                  <div style={{ fontSize: '11px', color: '#666' }}>₹{item.price} per {item.size} {item.unit}</div>
                </div>
                <div>
                  Using: <input type="number" value={i.used} onChange={e => updateUsed(i.pantryId, e.target.value)} style={{ width: '50px', padding: '4px' }} /> {item.unit}
                </div>
                <div style={{ width: '60px', textAlign: 'right', fontWeight: 'bold', color: '#d97706' }}>
                  ₹{cost.toFixed(1)}
                </div>
                <button onClick={() => removeRecipeItem(i.pantryId)} style={{ marginLeft: '6px', background: 'none', border: 'none', color: 'red' }}>✕</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overheads */}
      <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #ddd' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Overheads & Labor</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px' }}>Box/Board (₹)</label>
            <input type="number" value={packaging} onChange={e => setPackaging(+e.target.value)} style={{ width: '90%', padding: '6px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px' }}>Labor/Gas (₹)</label>
            <input type="number" value={labor} onChange={e => setLabor(+e.target.value)} style={{ width: '90%', padding: '6px' }} />
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div style={{ background: '#1e293b', color: '#fff', padding: '16px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span>Total Cost:</span>
          <strong style={{ fontSize: '18px', color: '#fbbf24' }}>₹{totalCost.toFixed(2)}</strong>
        </div>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '8px' }}>
          <label style={{ fontSize: '12px' }}>Profit Margin: {margin}%</label>
          <input type="range" min="0" max="80" value={margin} onChange={e => setMargin(+e.target.value)} style={{ width: '100%' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span>Suggested Selling Price:</span>
            <strong style={{ color: '#34d399', fontSize: '16px' }}>₹{suggestedPrice.toFixed(0)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   PANTRY COMPONENT
   ========================================================================== */
function PantryTab({ pantry, onAddPantryItem, onDeletePantryItem }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [unit, setUnit] = useState('cups');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !size) return;
    onAddPantryItem({ id: Date.now().toString(), name, price: +price, size: +size, unit });
    setName(''); setPrice(''); setSize('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #ddd' }}>
        <h4>Add New Ingredient</h4>
        <input placeholder="Name (e.g. Cocoa)" value={name} onChange={e => setName(e.target.value)} style={{ width: '90%', padding: '8px', marginBottom: '6px' }} required />
        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
          <input placeholder="Price (₹)" type="number" value={price} onChange={e => setPrice(e.target.value)} style={{ width: '40%', padding: '8px' }} required />
          <input placeholder="Pack Size" type="number" value={size} onChange={e => setSize(e.target.value)} style={{ width: '30%', padding: '8px' }} required />
          <select value={unit} onChange={e => setUnit(e.target.value)} style={{ padding: '8px', width: '30%' }}>
            <option value="cups">cups</option>
            <option value="cup">cup</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="pcs">pcs</option>
            <option value="tbsp">tbsp</option>
            <option value="tsp">tsp</option>
          </select>
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#d97706', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>+ Save to Pantry</button>
      </form>

      <div>
        {pantry.map(i => (
          <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '10px', marginBottom: '6px', borderRadius: '6px', border: '1px solid #eee' }}>
            <div>
              <strong>{i.name}</strong>
              <div style={{ fontSize: '12px', color: '#666' }}>₹{i.price} for {i.size} {i.unit} (₹{(i.price/i.size).toFixed(2)}/{i.unit})</div>
            </div>
            <button onClick={() => onDeletePantryItem(i.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '4px' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
