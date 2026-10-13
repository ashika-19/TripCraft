export const EXPENSE_CATEGORIES = [
  { id: "stay", label: "Stay", color: "#0F9D9A" },
  { id: "food", label: "Food", color: "#F28C3A" },
  { id: "transport", label: "Transport", color: "#12294B" },
  { id: "activities", label: "Activities", color: "#5BC0BE" },
  { id: "shopping", label: "Shopping", color: "#E0B36A" },
  { id: "other", label: "Other", color: "#8A97A8" },
];

export function getCategory(id) {
  return (
    EXPENSE_CATEGORIES.find((c) => c.id === id) ||
    EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
  );
}

export function getTotalSpent(expenses = []) {
  return expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
}

export function getCategoryTotals(expenses = []) {
  return EXPENSE_CATEGORIES.map((c) => ({
    ...c,
    total: expenses
      .filter((e) => e.category === c.id)
      .reduce((s, e) => s + (Number(e.amount) || 0), 0),
  }));
}
