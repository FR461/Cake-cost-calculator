import React, { useState } from "react";

export default function App() {
  const [ingredients, setIngredients] = useState([
    { name: "Flour", packCost: 5, packQty: 5, packUnit: "cups", usedQty: 2, usedUnit: "cups" },
    { name: "Sugar", packCost: 4, packQty: 4, packUnit: "cups", usedQty: 1, usedUnit: "cups" },
    { name: "Butter", packCost: 3, packQty: 200, packUnit: "g", usedQty: 100, usedUnit: "g" },
    { name: "Eggs", packCost: 3, packQty: 12, packUnit: "pcs", usedQty: 3, usedUnit: "pcs" },
  ]);

  const [laborHours, setLaborHours] = useState(1.5);
  const [hourlyRate, setHourlyRate] = useState(15);
  const [overhead, setOverhead] = useState(5);
  const [profitMargin, setProfitMargin] = useState(20);

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { name: "", packCost: 0, packQty: 0, packUnit: "cups", usedQty: 0, usedUnit: "cups" },
    ]);
  };

  const updateIngredient = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // Calculate actual ingredient cost based on package size and amount used
  const calculateIngredientCost = (item) => {
    const cost = parseFloat(item.packCost) || 0;
    const packQty = parseFloat(item.packQty) || 0;
    const usedQty = parseFloat(item.usedQty) || 0;

    if (packQty <= 0) return 0;
    return (cost / packQty) * usedQty;
  };

  const totalIngredientsCost = ingredients.reduce(
    (sum, item) => sum + calculateIngredientCost(item),
    0
  );

  const totalLaborCost = (parseFloat(laborHours) || 0) * (parseFloat(hourlyRate) || 0);
  const totalOverhead = parseFloat(overhead) || 0;
  const subtotal = totalIngredientsCost + totalLaborCost + totalOverhead;
  const totalCost = subtotal + subtotal * ((parseFloat(profitMargin) || 0) / 100);

  const unitOptions = (
    <>
      <option value="cups">cups</option>
      <option value="cup">cup</option>
      <option value="g">g</option>
      <option value="kg">kg</option>
      <option value="ml">ml</option>
      <option value="l">l</option>
      <option value="pcs">pcs</option>
      <option value="tbsp">tbsp</option>
      <option value="tsp">tsp</option>
    </>
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎂 Cake Cost Calculator</h1>

      {/* Ingredients Section */}
      <div style={styles.card}>
        <h2 style={styles.sectionHeader}>Ingredients & Pack Sizes</h2>
        {ingredients.map((item, index) => (
          <div key={index} style={styles.rowContainer}>
            <div style={styles.rowTop}>
              <input
                type="text"
                placeholder="Ingredient Name"
                value={item.name}
                onChange={(e) => updateIngredient(index, "name", e.target.value)}
                style={{ ...styles.input, flex: 2 }}
              />
              <button onClick={() => removeIngredient(index)} style={styles.deleteBtn}>
                ✕
              </button>
            </div>

            <div style={styles.rowDetails}>
              {/* Pack Details */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Pack Price ($)</label>
                <input
                  type="number"
                  value={item.packCost || ""}
                  onChange={(e) => updateIngredient(index, "packCost", e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Pack Size</label>
                <div style={{ display: "flex", gap: "4px" }}>
                  <input
                    type="number"
                    value={item.packQty || ""}
                    onChange={(e) => updateIngredient(index, "packQty", e.target.value)}
                    style={{ ...styles.input, flex: 1 }}
                  />
                  <select
                    value={item.packUnit}
                    onChange={(e) => updateIngredient(index, "packUnit", e.target.value)}
                    style={styles.select}
                  >
                    {unitOptions}
                  </select>
                </div>
              </div>

              {/* Recipe Used Details */}
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Recipe Used</label>
                <div style={{ display: "flex", gap: "4px" }}>
                  <input
                    type="number"
                    value={item.usedQty || ""}
                    onChange={(e) => updateIngredient(index, "usedQty", e.target.value)}
                    style={{ ...styles.input, flex: 1 }}
                  />
                  <select
                    value={item.usedUnit}
                    onChange={(e) => updateIngredient(index, "usedUnit", e.target.value)}
                    style={styles.select}
                  >
                    {unitOptions}
                  </select>
                </div>
              </div>

              <div style={styles.costBadge}>
                Cost: ${calculateIngredientCost(item).toFixed(2)}
              </div>
            </div>
          </div>
        ))}

        <button onClick={addIngredient} style={styles.addBtn}>
          + Add Ingredient
        </button>
      </div>

      {/* Labor & Extra Costs Section */}
      <div style={styles.card}>
        <h2 style={styles.sectionHeader}>Labor & Packaging</h2>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Hours Worked</label>
            <input
              type="number"
              value={laborHours || ""}
              onChange={(e) => setLaborHours(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Hourly Rate ($)</label>
            <input
              type="number"
              value={hourlyRate || ""}
              onChange={(e) => setHourlyRate(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        <div>
          <label style={styles.label}>Extra Costs (Box, Ribbon, Board) ($)</label>
          <input
            type="number"
            value={overhead || ""}
            onChange={(e) => setOverhead(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {/* Final Cost Summary */}
      <div style={styles.summaryCard}>
        <h2 style={styles.sectionHeader}>Total Price</h2>
        
        <div style={styles.summaryRow}>
          <span>Ingredients Total:</span>
          <span>${totalIngredientsCost.toFixed(2)}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Labor Total:</span>
          <span>${totalLaborCost.toFixed(2)}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Extra Costs:</span>
          <span>${totalOverhead.toFixed(2)}</span>
        </div>

        <div style={{ margin: "12px 0" }}>
          <label style={styles.label}>Profit Margin (%)</label>
          <input
            type="number"
            value={profitMargin}
            onChange={(e) => setProfitMargin(e.target.value)}
            style={{ ...styles.input, width: "80px", display: "block" }}
          />
        </div>

        <div style={styles.finalTotal}>
          Final Selling Price: ${totalCost.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "16px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
  title: {
    textAlign: "center",
    fontSize: "1.5rem",
    color: "#2c3e50",
    marginBottom: "16px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    padding: "14px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  summaryCard: {
    backgroundColor: "#e8f5e9",
    borderRadius: "10px",
    padding: "16px",
    border: "1px solid #c8e6c9",
  },
  sectionHeader: {
    fontSize: "1.1rem",
    marginTop: 0,
    marginBottom: "12px",
    color: "#34495e",
  },
  rowContainer: {
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "10px",
  },
  rowTop: {
    display: "flex",
    gap: "8px",
    marginBottom: "6px",
  },
  rowDetails: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
    alignItems: "end",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "0.75rem",
    color: "#7f8c8d",
    marginBottom: "3px",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "0.9rem",
    boxSizing: "border-box",
    width: "100%",
  },
  select: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "0.9rem",
    backgroundColor: "#fff",
  },
  deleteBtn: {
    background: "#ff5252",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "0 10px",
    cursor: "pointer",
  },
  addBtn: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "6px",
  },
  costBadge: {
    gridColumn: "span 2",
    textAlign: "right",
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: "#27ae60",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.9rem",
    marginBottom: "4px",
    color: "#555",
  },
  finalTotal: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
    marginTop: "12px",
    paddingTop: "8px",
    borderTop: "2px dashed #a5d6a7",
  },
};
