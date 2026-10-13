import { useState } from "react";
import { Plus } from "lucide-react";
import { EXPENSE_CATEGORIES } from "../utils/budgetHelpers.js";

export default function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("stay");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!title.trim() || !value || value <= 0) return;
    onAdd({ title: title.trim(), category, amount: value });
    setTitle("");
    setAmount("");
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="exp-title">Expense</label>
        <input
          id="exp-title"
          className="input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Hotel booking"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="exp-category">Category</label>
        <select
          id="exp-category"
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="exp-amount">Amount (₹)</label>
        <input
          id="exp-amount"
          className="input"
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        <Plus size={16} /> Add expense
      </button>
    </form>
  );
}
