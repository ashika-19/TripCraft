import { Trash2, Receipt } from "lucide-react";
import EmptyState from "./EmptyState.jsx";
import { formatCurrency } from "../utils/formatters.js";
import { getCategory } from "../utils/budgetHelpers.js";

export default function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return (
      <EmptyState
        compact
        icon={Receipt}
        title="No expenses yet"
        text="Add your first expense to start tracking your spending."
      />
    );
  }

  return (
    <ul className="expense-list">
      {[...expenses].reverse().map((e) => {
        const cat = getCategory(e.category);
        return (
          <li key={e.id} className="expense-item">
            <span className="expense-dot" style={{ background: cat.color }} />
            <div className="expense-info">
              <strong>{e.title}</strong>
              <span>{cat.label}</span>
            </div>
            <span className="expense-amount">{formatCurrency(e.amount)}</span>
            <button
              className="icon-btn icon-btn-danger"
              aria-label={`Delete ${e.title}`}
              onClick={() => onDelete(e.id)}
            >
              <Trash2 size={15} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
