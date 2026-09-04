import React, { useState, useEffect } from 'react';

const defaultPantry = [
  { id: '1', name: 'Cocoa Powder', price: 70, size: 100, unit: 'g', category: 'cake', isDry: true },
  { id: '2', name: 'Flour (Maida)', price: 65, size: 1000, unit: 'g', category: 'cake', isDry: true },
  { id: '3', name: 'Caster Sugar', price: 50, size: 1000, unit: 'g', category: 'cake', isDry: true },
  { id: '4', name: 'Unsalted Butter', price: 275, size: 500, unit: 'g', category: 'cake', isDry: true },
  { id: '5', name: 'Eggs', price: 90, size: 12, unit: 'pcs', category: 'cake', isDry: false },
  { id: '6', name: 'Oil', price: 200, size: 1000, unit: 'ml', category: 'cake', isDry: false },
  { id: '7', name: 'Whipping Cream', price: 200, size: 1000, unit: 'ml', category: 'cream', isDry: false },
  { id: '8', name: 'Cream Cheese', price: 350, size: 500, unit: 'g', category: 'cream', isDry: false }
];

export default function App() {
  const [tab, setTab] = useState('calc');
  
  // Safely load pantry from localStorage while protecting existing items
  const [pantry, setPantry] = useState(() => {
    const s = localStorage.getItem('cake_pantry');
    if (s) {
      try {
        const parsed = JSON.parse(s);
        return parsed.map(item => ({
          ...item,
          isDry: item.isDry !== undefined ? item.isDry : false
        }));
      } catch (e) {
        return defaultPantry;
      }
    }
    return defaultPantry;
  });

  const [savedRecipes, setSavedRecipes] = useState(() => {
    const r = localStorage.getItem('cake_recipes');
    return r ? JSON.parse(r) : [];
  });

  const [currentRecipe, setCurrentRecipe] = useState({
    id: null,
    name: 'My Cake',
    cakeItems: [],
    creamItems: [],
    packaging: 50,
    decorations: 0,
    labor: 100,
    margin: 40
  });

  useEffect(() => {
    localStorage.setItem('cake_pantry', JSON.stringify(pantry));
  }, [pantry]);

  useEffect(() => {
    localStorage.setItem('cake_recipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  const deletePantryItem = (id) => setPantry(pantry.filter(i => i.id !== id));
  
  const addPantryItem = (newItem) => setPantry([...pantry, newItem]);

  const updatePantryItem = (updatedItem) => {
    setPantry(pantry.map(i => i.id === updatedItem.id ? updatedItem : i));
  };

  const saveRecipe = (recipeToSave) => {
    const recipeId = recipeToSave.id || Date.now().toString();
    const recipeWithId = { ...recipeToSave, id: recipeId };
    
    const exists = savedRecipes.some(r => r.id === recipeId);
    let updated;
    if (exists) {
      updated = savedRecipes.map(r => r.id === recipeId ? recipeWithId : r);
    } else {
      updated = [...savedRecipes, recipeWithId];
    }
    
    setSavedRecipes(updated);
    setCurrentRecipe(recipeWithId);
    alert('Recipe saved successfully!');
  };

  const deleteRecipe = (id) => setSavedRecipes(savedRecipes.filter(r => r.id !== id));

  const loadRecipe = (recipe) => {
    setCurrentRecipe({
      ...recipe,
      cakeItems: recipe.cakeItems || recipe.items || [],
      creamItems: recipe.creamItems || []
    });
    setTab('calc');
  };

  const startNewRecipe = () => {
    setCurrentRecipe({
      id: null,
      name: 'New Recipe',
      cakeItems: [],
      creamItems: [],
      packaging: 0,
      decorations: 0,
      labor: 0,
      margin: 40
    });
  };

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', background: '#fdfbf7', minHeight: '100vh' }}>
      <h2 style={{ color: '#d97706', marginBottom: '8px' }}>🎂 BakeCost Studio</h2>
      
      {/* Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => setTab('calc')} style={{ flex: 1, padding: '10px', background: tab === 'calc' ? '#d97706' : '#eee', color: tab === 'calc' ? '#fff' : '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Calculator</button>
        <button onClick={() => setTab('pantry')} style={{ flex: 1, padding: '10px', background: tab === 'pantry' ? '#d97706' : '#eee', color: tab === 'pantry' ? '#fff' : '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Pantry ({pantry.length})</button>
        <button onClick={() => setTab('recipes')} style={{ flex: 1, padding: '10px', background: tab === 'recipes' ? '#d97706' : '#eee', color: tab === 'recipes' ? '#fff' : '#333', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Recipes ({savedRecipes.length})</button>
      </div>

      {tab === 'calc' && (
        <CalculatorTab 
          pantry={pantry} 
          currentRecipe={currentRecipe} 
          setCurrentRecipe={setCurrentRecipe} 
          onSaveRecipe={saveRecipe} 
          onNewRecipe={startNewRecipe}
        />
      )}

      {tab === 'pantry' && (
        <PantryTab 
          pantry={pantry} 
          onAddPantryItem={addPantryItem} 
          onUpdatePantryItem={updatePantryItem}
          onDeletePantryItem={deletePantryItem} 
        />
      )}

      {tab === 'recipes' && (
        <RecipesTab 
          savedRecipes={savedRecipes} 
          onLoadRecipe={loadRecipe} 
          onDeleteRecipe={deleteRecipe} 
        />
      )}
    </div>
  );
}

/* ==========================================================================
   HELPER CONVERSION FUNCTION
   ========================================================================== */
function getUnitMultiplier(unit, isDry) {
  const multipliers = {
    g: 1,
    kg: 1000,
    mg: 0.001,
    ml: 1,
    l: 1000,
    cups: isDry ? 120 : 240, // 1 cup = 120g for dry ingredients, 240ml for liquids
    cup: isDry ? 120 : 240,
    tbsp: isDry ? 7.5 : 15,
    tsp: isDry ? 2.5 : 5,
    pcs: 1
  };
  return multipliers[unit] || 1;
}

/* ==========================================================================
   CALCULATOR COMPONENT
   ========================================================================== */
function CalculatorTab({ pantry, currentRecipe, setCurrentRecipe, onSaveRecipe, onNewRecipe }) {
  const { name: recipeName, cakeItems, creamItems, packaging, decorations, labor, margin } = currentRecipe;

  const setRecipeName = (val) => setCurrentRecipe({ ...currentRecipe, name: val });
  const setPackaging = (val) => setCurrentRecipe({ ...currentRecipe, packaging: val });
  const setDecorations = (val) => setCurrentRecipe({ ...currentRecipe, decorations: val });
  const setLabor = (val) => setCurrentRecipe({ ...currentRecipe, labor: val });
  const setMargin = (val) => setCurrentRecipe({ ...currentRecipe, margin: val });

  const addRecipeItem = (pantryId, section) => {
    if (!pantryId) return;
    const itemsKey = section === 'cake' ? 'cakeItems' : 'creamItems';
    if (currentRecipe[itemsKey].some(i => i.pantryId === pantryId)) return;
    const item = pantry.find(p => p.id === pantryId);
    
    setCurrentRecipe({ 
      ...currentRecipe, 
      [itemsKey]: [...currentRecipe[itemsKey], { pantryId, used: 1, usedUnit: item ? item.unit : 'cups' }] 
    });
  };

  const updateUsed = (pantryId, field, val, section) => {
    const itemsKey = section === 'cake' ? 'cakeItems' : 'creamItems';
    const updatedItems = currentRecipe[itemsKey].map(i => {
      if (i.pantryId === pantryId) {
        return { ...i, [field]: field === 'used' ? parseFloat(val) || 0 : val };
      }
      return i;
    });
    setCurrentRecipe({ ...currentRecipe, [itemsKey]: updatedItems });
  };

  const removeRecipeItem = (pantryId, section) => {
    const itemsKey = section === 'cake' ? 'cakeItems' : 'creamItems';
    const updatedItems = currentRecipe[itemsKey].filter(i => i.pantryId !== pantryId);
    setCurrentRecipe({ ...currentRecipe, [itemsKey]: updatedItems });
  };

  const calcItemCost = (pantryId, used, usedUnit) => {
    const item = pantry.find(p => p.id === pantryId);
    if (!item || item.size === 0) return 0;
    
    const isDry = item.isDry || false;
    const pantryBaseMult = getUnitMultiplier(item.unit, isDry);
    const recipeBaseMult = getUnitMultiplier(usedUnit, isDry);
    
    const costPerBaseUnit = item.price / (item.size * pantryBaseMult);
    const totalBaseUsed = (used || 0) * recipeBaseMult;
    return costPerBaseUnit * totalBaseUsed;
  };

  const cakeSubtotal = cakeItems.reduce((sum, i) => sum + calcItemCost(i.pantryId, i.used, i.usedUnit), 0);
  const creamSubtotal = creamItems.reduce((sum, i) => sum + calcItemCost(i.pantryId, i.used, i.usedUnit), 0);
  
  const ingSubtotal = cakeSubtotal + creamSubtotal;
  const totalCost = ingSubtotal + (+packaging || 0) + (+decorations || 0) + (+labor || 0);
  const suggestedPrice = margin < 100 ? totalCost / (1 - margin / 100) : totalCost;

  const renderSection = (title, sectionKey, itemsList, filterCategory) => {
    const filteredPantry = pantry.filter(p => (p.category || 'cake') === filterCategory);
    return (
      <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #ddd' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#d97706' }}>{title}</h4>
        <select onChange={e => { addRecipeItem(e.target.value, sectionKey); e.target.value = ''; }} style={{ width: '100%', padding: '8px', borderRadius: '6px' }}>
          <option value="">+ Select {filterCategory === 'cake' ? 'Cake' : 'Cream'} Ingredient</option>
          {filteredPantry.map(i => <option key={i.id} value={i.id}>{i.name} ({i.unit}) {i.isDry ? '[Dry]' : '[Wet]'}</option>)}
        </select>

        <div style={{ marginTop: '12px' }}>
          {itemsList.map(i => {
            const item = pantry.find(p => p.id === i.pantryId);
            if (!item) return null;
            const cost = calcItemCost(i.pantryId, i.used, i.usedUnit);
            return (
              <div key={i.pantryId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f9f9f9', padding: '8px', marginBottom: '6px', borderRadius: '6px', fontSize: '13px' }}>
                <div style={{ flex: 1 }}>
                  <strong>{item.name}</strong> <span style={{ fontSize: '10px', color: '#666' }}>({item.isDry ? 'Dry' : 'Wet/Volume'})</span>
                  <div style={{ fontSize: '11px', color: '#666' }}>₹{item.price} per {item.size} {item.unit}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Using:</span>
                  <input type="number" step="0.01" value={i.used} onChange={e => updateUsed(i.pantryId, 'used', e.target.value, sectionKey)} style={{ width: '45px', padding: '4px' }} />
                  <select value={i.usedUnit || item.unit} onChange={e => updateUsed(i.pantryId, 'usedUnit', e.target.value, sectionKey)} style={{ padding: '4px', fontSize: '12px' }}>
                    <option value="cups">cups</option>
                    <option value="cup">cup</option>
                    <option value="tbsp">tbsp</option>
                    <option value="tsp">tsp</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="pcs">pcs</option>
                  </select>
                </div>
                <div style={{ width: '55px', textAlign: 'right', fontWeight: 'bold', color: '#d97706' }}>
                  ₹{cost.toFixed(1)}
                </div>
                <button onClick={() => removeRecipeItem(i.pantryId, sectionKey)} style={{ marginLeft: '4px', background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>✕</button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #ddd', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Recipe Name</label>
          <input value={recipeName} onChange={e => setRecipeName(e.target.value)} style={{ width: '90%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #ccc' }} />
        </div>
        <button onClick={onNewRecipe} style={{ padding: '9px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + New / Clear
        </button>
      </div>

      {renderSection('Cake Ingredients', 'cake', cakeItems, 'cake')}
      {renderSection('Cream Ingredients', 'cream', creamItems, 'cream')}

      {/* Overheads */}
      <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #ddd' }}>
        <h4 style={{ margin: '0 0 8px 0' }}>Overheads & Labor</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px' }}>Box/Board (₹)</label>
            <input type="number" value={packaging} onChange={e => setPackaging(+e.target.value)} style={{ width: '85%', padding: '6px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px' }}>Decorations/Fondant (₹)</label>
            <input type="number" value={decorations} onChange={e => setDecorations(+e.target.value)} style={{ width: '85%', padding: '6px' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px' }}>Electricity/Gas (₹)</label>
            <input type="number" value={labor} onChange={e => setLabor(+e.target.value)} style={{ width: '85%', padding: '6px' }} />
          </div>
        </div>
      </div>

      {/* Summary Box & Save Recipe */}
      <div style={{ background: '#1e293b', color: '#fff', padding: '16px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span>Total Cost:</span>
          <strong style={{ fontSize: '18px', color: '#fbbf24' }}>₹{totalCost.toFixed(2)}</strong>
        </div>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '8px', marginBottom: '12px' }}>
          <label style={{ fontSize: '12px' }}>Profit Margin: {margin}%</label>
          <input type="range" min="0" max="80" value={margin} onChange={e => setMargin(+e.target.value)} style={{ width: '100%' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span>Suggested Selling Price:</span>
            <strong style={{ color: '#34d399', fontSize: '16px' }}>₹{suggestedPrice.toFixed(0)}</strong>
          </div>
        </div>

        <button 
          onClick={() => onSaveRecipe(currentRecipe)} 
          style={{ width: '100%', padding: '10px', background: '#d97706', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          💾 Save Recipe
        </button>
      </div>
    </div>
  );
}

/* ==========================================================================
   PANTRY COMPONENT (WITH WET/DRY SELECTION)
   ========================================================================== */
function PantryTab({ pantry, onAddPantryItem, onUpdatePantryItem, onDeletePantryItem }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');
  const [unit, setUnit] = useState('cups');
  const [category, setCategory] = useState('cake');
  const [isDry, setIsDry] = useState(true);
  const [pantryFilter, setPantryFilter] = useState('all');

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', size: '', unit: 'g', category: 'cake', isDry: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !size) return;
    onAddPantryItem({ id: Date.now().toString(), name, price: +price, size: +size, unit, category, isDry });
    setName(''); setPrice(''); setSize('');
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({ ...item, isDry: item.isDry !== undefined ? item.isDry : true });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    onUpdatePantryItem({
      ...editForm,
      price: +editForm.price,
      size: +editForm.size
    });
    setEditingId(null);
  };

  const filteredPantry = pantryFilter === 'all' 
    ? pantry 
    : pantry.filter(i => (i.category || 'cake') === pantryFilter);

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #ddd' }}>
        <h4>Add New Ingredient</h4>
        <input placeholder="Name (e.g. Cocoa)" value={name} onChange={e => setName(e.target.value)} style={{ width: '90%', padding: '8px', marginBottom: '6px' }} required />
        
        <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
          <input placeholder="Price (₹)" type="number" value={price} onChange={e => setPrice(e.target.value)} style={{ width: '25%', padding: '8px' }} required />
          <input placeholder="Pack Size" type="number" value={size} onChange={e => setSize(e.target.value)} style={{ width: '25%', padding: '8px' }} required />
          <select value={unit} onChange={e => setUnit(e.target.value)} style={{ padding: '8px', width: '20%' }}>
            <option value="cups">cups</option>
            <option value="cup">cup</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
            <option value="pcs">pcs</option>
            <option value="tbsp">tbsp</option>
            <option value="tsp">tsp</option>
          </select>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '8px', width: '20%' }}>
            <option value="cake">Cake</option>
            <option value="cream">Cream</option>
          </select>
        </div>

        {/* Wet / Dry Ingredient Type Radio */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', fontSize: '13px', background: '#f3f4f6', padding: '6px 10px', borderRadius: '6px' }}>
          <span style={{ fontWeight: 'bold' }}>Type:</span>
          <label style={{ cursor: 'pointer' }}>
            <input type="radio" name="pantryType" checked={isDry} onChange={() => setIsDry(true)} /> Dry (1 cup = 120g)
          </label>
          <label style={{ cursor: 'pointer' }}>
            <input type="radio" name="pantryType" checked={!isDry} onChange={() => setIsDry(false)} /> Wet / Liquid (1 cup = 240ml)
          </label>
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', background: '#d97706', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>+ Save to Pantry</button>
      </form>

      {/* Pantry Filter Sub-tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        <button onClick={() => setPantryFilter('all')} style={{ flex: 1, padding: '6px', background: pantryFilter === 'all' ? '#3b82f6' : '#eee', color: pantryFilter === 'all' ? '#fff' : '#333', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>All ({pantry.length})</button>
        <button onClick={() => setPantryFilter('cake')} style={{ flex: 1, padding: '6px', background: pantryFilter === 'cake' ? '#3b82f6' : '#eee', color: pantryFilter === 'cake' ? '#fff' : '#333', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>Cake Ingredients</button>
        <button onClick={() => setPantryFilter('cream')} style={{ flex: 1, padding: '6px', background: pantryFilter === 'cream' ? '#3b82f6' : '#eee', color: pantryFilter === 'cream' ? '#fff' : '#333', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>Cream Ingredients</button>
      </div>

      <div>
        {filteredPantry.map(i => (
          <div key={i.id} style={{ background: '#fff', padding: '10px', marginBottom: '6px', borderRadius: '6px', border: '1px solid #eee' }}>
            {editingId === i.id ? (
              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={{ padding: '6px' }} required />
                <div style={{ display: 'flex', gap: '4px' }}>
                  <input type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} placeholder="Price" style={{ width: '25%', padding: '6px' }} required />
                  <input type="number" value={editForm.size} onChange={e => setEditForm({ ...editForm, size: e.target.value })} placeholder="Size" style={{ width: '25%', padding: '6px' }} required />
                  <select value={editForm.unit} onChange={e => setEditForm({ ...editForm, unit: e.target.value })} style={{ width: '20%', padding: '6px' }}>
                    <option value="cups">cups</option>
                    <option value="cup">cup</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="pcs">pcs</option>
                    <option value="tbsp">tbsp</option>
                    <option value="tsp">tsp</option>
                  </select>
                  <select value={editForm.category || 'cake'} onChange={e => setEditForm({ ...editForm, category: e.target.value })} style={{ width: '20%', padding: '6px' }}>
                    <option value="cake">Cake</option>
                    <option value="cream">Cream</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                  <label>
                    <input type="radio" name={`editType_${i.id}`} checked={editForm.isDry} onChange={() => setEditForm({ ...editForm, isDry: true })} /> Dry
                  </label>
                  <label>
                    <input type="radio" name={`editType_${i.id}`} checked={!editForm.isDry} onChange={() => setEditForm({ ...editForm, isDry: false })} /> Wet / Volume
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '4px' }}>
                  <button type="button" onClick={cancelEdit} style={{ background: '#eee', color: '#333', border: 'none', padding: '4px 8px', borderRadius: '4px' }}>Cancel</button>
                  <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Save</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{i.name}</strong> 
                  <span style={{ fontSize: '10px', background: '#eee', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>{(i.category || 'cake').toUpperCase()}</span>
                  <span style={{ fontSize: '10px', background: i.isDry ? '#fef3c7' : '#e0f2fe', color: i.isDry ? '#b45309' : '#0369a1', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>
                    {i.isDry ? 'Dry' : 'Wet'}
                  </span>
                  <div style={{ fontSize: '12px', color: '#666' }}>₹{i.price} for {i.size} {i.unit} (₹{(i.price/i.size).toFixed(2)}/{i.unit})</div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => startEdit(i)} style={{ background: '#feF3c7', color: '#d97706', border: 'none', padding: '6px 10px', borderRadius: '4px', fontWeight: 'bold' }}>Edit</button>
                  <button onClick={() => onDeletePantryItem(i.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '4px' }}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================================
   RECIPES TAB COMPONENT
   ========================================================================== */
function RecipesTab({ savedRecipes, onLoadRecipe, onDeleteRecipe }) {
  return (
    <div>
      <h4 style={{ margin: '0 0 12px 0' }}>Saved Recipes</h4>
      {savedRecipes.length === 0 ? (
        <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', textAlign: 'center', color: '#777', border: '1px solid #ddd' }}>
          No saved recipes yet. Build a recipe in the Calculator tab and tap "Save Recipe"!
        </div>
      ) : (
        savedRecipes.map(recipe => {
          const count = ((recipe.cakeItems || recipe.items || []).length) + ((recipe.creamItems || []).length);
          return (
            <div key={recipe.id} style={{ background: '#fff', padding: '12px', marginBottom: '8px', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{recipe.name}</strong>
                <div style={{ fontSize: '12px', color: '#666' }}>{count} ingredient(s)</div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => onLoadRecipe(recipe)} style={{ background: '#d97706', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', fontWeight: 'bold' }}>Load</button>
                <button onClick={() => onDeleteRecipe(recipe.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '4px' }}>Delete</button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
