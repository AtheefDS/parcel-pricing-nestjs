
import { useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function App() {
  const [form, setForm] = useState({
    category: "NORMAL",
    weight: "",
    length: "",
    width: "",
    height: ""
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value
    });
  }

  async function calculatePrice(event) {
    event.preventDefault();

    setResult(null);
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/parcels/calculate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            category: form.category,
            weight: Number(form.weight),
            length: Number(form.length),
            width: Number(form.width),
            height: Number(form.height)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Object.values(data).join(", ") || "Unable to calculate price"
        );
      }

      setResult(data);

    } catch (err) {
      setError(
        err.message || "Cannot connect to the backend. Check whether the NestJS server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      category: "NORMAL",
      weight: "",
      length: "",
      width: "",
      height: ""
    });

    setResult(null);
    setError("");
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Parcel Pricing System</h1>
        <p>Calculate your parcel delivery price instantly</p>
      </header>

      <main className="container">
        <section className="form-card">
          <h2>Parcel Details</h2>
          <p className="subtitle">
            Enter your parcel information below.
          </p>

          <form onSubmit={calculatePrice}>
            <label>Parcel Category</label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="DOCUMENT">Document</option>
              <option value="NORMAL">Normal</option>
              <option value="FRAGILE">Fragile</option>
            </select>

            <label>Weight (kg)</label>

            <input
              type="number"
              name="weight"
              placeholder="Enter weight"
              min="0.01"
              step="any"
              value={form.weight}
              onChange={handleChange}
              required
            />

            <div className="dimension-heading">
              <label>Dimensions (cm)</label>
            </div>

            <div className="dimension-grid">
              <input
                type="number"
                name="length"
                placeholder="Length"
                min="0.01"
                step="any"
                value={form.length}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="width"
                placeholder="Width"
                min="0.01"
                step="any"
                value={form.width}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="height"
                placeholder="Height"
                min="0.01"
                step="any"
                value={form.height}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Calculating..." : "Calculate Price"}
            </button>

            <button
              type="button"
              className="reset-button"
              onClick={resetForm}
            >
              Reset
            </button>
          </form>
        </section>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {result && (
          <section className="result-card">
            <h2>Pricing Breakdown</h2>

            <div className="result-row">
              <span>Category</span>
              <strong>{result.category}</strong>
            </div>

            <div className="result-row">
              <span>Actual Weight</span>
              <strong>{result.actualWeight} kg</strong>
            </div>

            <div className="result-row">
              <span>Volumetric Weight</span>
              <strong>{result.volumetricWeight} kg</strong>
            </div>

            <div className="result-row">
              <span>Chargeable Weight</span>
              <strong>{result.chargeableWeight} kg</strong>
            </div>

            <div className="result-row">
              <span>Base Charge</span>
              <strong>Rs. {result.baseCharge.toFixed(2)}</strong>
            </div>

            <div className="result-row">
              <span>Weight Charge</span>
              <strong>Rs. {result.weightCharge.toFixed(2)}</strong>
            </div>

            <div className="result-row">
              <span>Oversized Surcharge</span>
              <strong>Rs. {result.oversizedSurcharge.toFixed(2)}</strong>
            </div>

            <div className="total-row">
              <span>Total Price</span>
              <strong>Rs. {result.totalPrice.toFixed(2)}</strong>
            </div>
          </section>
        )}
      </main>

      <footer>
        Parcel Pricing System | React + NestJS
      </footer>
    </div>
  );
}

export default App;
