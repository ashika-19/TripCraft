import { Link, useParams } from "react-router-dom";
import { Briefcase, Wallet, Receipt, PiggyBank } from "lucide-react";

import { TripBanner, TripPicker } from "../components/TripCard.jsx";
import StatCard from "../components/StatCard.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { formatCurrency } from "../utils/formatters.js";
import { getCategoryTotals, getTotalSpent } from "../utils/budgetHelpers.js";
import { generateId } from "../utils/storage.js";

export default function BudgetPlanner({ trips, updateTrip }) {
  const { tripId } = useParams();
  const trip = trips.find((t) => t.id === tripId);

  if (!trip) {
    return (
      <>
        <div className="page-header">
          <div>
            <span className="eyebrow">Budget</span>
            <h1>Budget planner</h1>
            <p>Choose a trip to track its spending.</p>
          </div>
        </div>
        {trips.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No trips to budget yet"
            text="Create a trip first, then track every rupee here."
          >
            <Link to="/trips?new=bali" className="btn btn-primary">
              Create a trip
            </Link>
            <Link to="/explore" className="btn btn-ghost">
              Explore destinations
            </Link>
          </EmptyState>
        ) : (
          <TripPicker trips={trips} basePath="/budget" />
        )}
      </>
    );
  }

  const expenses = trip.expenses || [];
  const spent = getTotalSpent(expenses);
  const remaining = trip.budget - spent;
  const percent =
    trip.budget > 0
      ? Math.min(100, Math.round((spent / trip.budget) * 100))
      : 0;
  const over = trip.budget > 0 && spent > trip.budget;
  const totals = getCategoryTotals(expenses).filter((c) => c.total > 0);

  const addExpense = (expense) => {
    updateTrip(trip.id, {
      expenses: [...expenses, { id: generateId(), ...expense }],
    });
  };

  const deleteExpense = (id) => {
    updateTrip(trip.id, { expenses: expenses.filter((e) => e.id !== id) });
  };

  const changeBudget = (e) => {
    updateTrip(trip.id, { budget: Math.max(0, Number(e.target.value) || 0) });
  };

  return (
    <>
      <div className="page-header">
        <div>
          <span className="eyebrow">Budget</span>
          <h1>Budget planner</h1>
          <p>Set a budget, log expenses and stay in control.</p>
        </div>
      </div>

      <TripPicker trips={trips} basePath="/budget" activeId={trip.id} />
      <TripBanner trip={trip} />

      <div className="budget-stats">
        <StatCard
          icon={Wallet}
          label="Total budget"
          value={formatCurrency(trip.budget)}
          tone="teal"
        />
        <StatCard
          icon={Receipt}
          label="Spent so far"
          value={formatCurrency(spent)}
          hint={`${percent}% of budget`}
          tone="navy"
        />
        <StatCard
          icon={PiggyBank}
          label={over ? "Over budget by" : "Remaining"}
          value={formatCurrency(Math.abs(remaining))}
          tone={over ? "orange" : "cream"}
        />
      </div>

      <div className="card budget-progress-card">
        <div className="budget-progress-head">
          <div className="field budget-edit">
            <label htmlFor="budget-total">Total budget (₹)</label>
            <input
              id="budget-total"
              className="input"
              type="number"
              min="0"
              value={trip.budget}
              onChange={changeBudget}
            />
          </div>
          <div className="budget-percent">
            <strong>{percent}%</strong>
            <span>{over ? "Over budget" : "used"}</span>
          </div>
        </div>
        <div className="progress progress-lg">
          <div
            className={`progress-bar${over ? " over" : percent >= 80 ? " warn" : ""}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="budget-layout">
        <div className="budget-main">
          <div className="card panel">
            <h3>Add an expense</h3>
            <ExpenseForm onAdd={addExpense} />
          </div>
          <div className="card panel">
            <h3>Expenses</h3>
            <ExpenseList expenses={expenses} onDelete={deleteExpense} />
          </div>
        </div>

        <aside className="card panel">
          <h3>Spending by category</h3>
          {totals.length === 0 ? (
            <p className="muted">
              Your category breakdown will appear once you add expenses.
            </p>
          ) : (
            <ul className="breakdown">
              {totals.map((c) => (
                <li key={c.id}>
                  <div className="breakdown-row">
                    <span>
                      <i style={{ background: c.color }} /> {c.label}
                    </span>
                    <strong>{formatCurrency(c.total)}</strong>
                  </div>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${(c.total / spent) * 100}%`,
                        background: c.color,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </>
  );
}
