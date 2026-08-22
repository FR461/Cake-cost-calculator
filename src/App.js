import React, { useState } from "react";

export default function App() {
  const [ingredients, setIngredients] = useState([
    { name: "Flour", cost: 0, qty: 0, unit: "cups" },
    { name: "Sugar", cost: 0, qty: 0, unit: "cups" },
    { name: "Butter", cost: 0, qty: 0, unit: "g" },
    { name: "Eggs", cost: 0, qty: 0, unit: "pcs" },
  ]);

  const [laborHours, setLaborHours] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [overhead, setOverhead] = useState(0);
  const [profitMargin, setProfitMargin] = useState(20);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", cost: 0, qty: 0, unit: "cups" }]);
  };

  const updateIngredient = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const totalIngredientsCost = ingredients.reduce(
    (sum, item) => sum + (parseFloat(item.cost) || 0),
    0
  );
  const totalLaborCost = (parseFloat(laborHours) || 0) * (parseFloat(hourlyRate) || 0);
  const totalOverhead = parseFloat(overhead) || 0;
  const subtotal = totalIngredientsCost + totalLaborCost + totalOverhead;
  const totalCost = subtotal + subtotal * ((parseFloat(profitMargin) || 0) / 100);

  return (
    <div style={{ padding: "16px", maxWidth: "480px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>🍰 Cake Cost Calculator</h2>

      <div style={{ background: "#f9f9f9", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
        <h3>Ingredients</h3>
        {ingredients.map((item, index) => (
          <div key={index} style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
            <input
              type="text"
              placeholder="Name"
              value={item.name}
              onChange={(e) => updateIngredient(index, "name", e.target.value)}
              style={{ flex: "2", padding: "6px" }}
            />
            <input
              type="number"
              placeholder="Qty"
              value={item.qty || ""}
              onChange={(e) => updateIngredient(index, "qty", e.target.value)}
              style={{ flex: "1", padding: "6px" }}
            />
            <select
              value={item.unit}
              onChange={(e) => updateIngredient(index, "unit", e.target.value)}
              style={{ padding: "6px" }}
            >
              <option value="cups">cups</option>
              <option value="g">g</option>
              <option value="mg">mg</option>
              <option value="pcs">pcs</option>
            </select>
            <input
              type="number"
              placeholder="Cost ($)"
              value={item.cost || ""}
              onChange={(e) => updateIngredient(index, "cost", e.target.value)}
              style={{ flex: "1", padding: "6px" }}
            />
            <button onClick={() => removeIngredient(index)} style={{ color: "red", background: "none", border: "none" }}>
              ✕
            </button>
          </div>
        ))}
        <button onClick={addIngredient} style={{ width: "100%", padding: "8px", cursor: "pointer" }}>
          + Add Ingredient
        </button>
      </div>

      <div style={{ background: "#f9f9f9", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
        <h3>Labor & Overhead</h3>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <input
            type="number"
            placeholder="Hours"
            value={laborHours || ""}
            onChange={(e) => setLaborHours(e.target.value)}
            style={{ flex: "1", padding: "6px" }}
          />
          <input
            type="number"
            placeholder="$/Hour"
            value={hourlyRate || ""}
            onChange={(e) => setHourlyRate(e.target.value)}
            style={{ flex: "1", padding: "6px" }}
          />
        </div>
        <input
          type="number"
          placeholder="Extra Costs (Boxes, Ribbon, Electricity)"
          value={overhead || ""}
          onChange={(e) => setOverhead(e.target.value)}
          style={{ width: "100%", padding: "6px", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ background: "#f9f9f9", padding: "12px", borderRadius: "8px" }}>
        <h3>Final Price</h3>
        <label style={{ display: "block", marginBottom: "8px" }}>
          Profit Margin (%):
          <input
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(e.target.value)}
            style={{ width: "60px", marginLeft: "8px", padding: "4px" }}
          />
        </label>
        <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#2e7d32", marginTop: "12px" }}>
          Total Price: ${totalCost.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
