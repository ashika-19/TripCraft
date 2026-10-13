import { Search, X } from "lucide-react";

export default function SearchFilterBar({
  query,
  onQueryChange,
  categories,
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div className="filter-bar">
      <label className="search-field">
        <Search size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search destinations, countries or vibes…"
          aria-label="Search destinations"
        />
        {query && (
          <button
            type="button"
            className="search-clear"
            aria-label="Clear search"
            onClick={() => onQueryChange("")}
          >
            <X size={16} />
          </button>
        )}
      </label>

      <div className="chip-row" role="group" aria-label="Filter by category">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={`chip${activeCategory === c ? " active" : ""}`}
            onClick={() => onCategoryChange(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
