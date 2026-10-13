import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SearchX } from "lucide-react";

import SearchFilterBar from "../components/SearchFilterBar.jsx";
import DestinationCard, {
  DestinationCardSkeleton,
} from "../components/DestinationCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import destinations, { categories } from "../data/destinations.js";

export default function ExploreDestinations() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return destinations.filter((d) => {
      const matchesCategory = category === "All" || d.category === category;
      const haystack = [d.name, d.country, d.category, d.description]
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!q || haystack.includes(q));
    });
  }, [query, category]);

  const clearFilters = () => {
    setQuery("");
    setCategory("All");
  };

  return (
    <>
      <div className="page-header">
        <div>
          <span className="eyebrow">Explore</span>
          <h1>Explore destinations</h1>
          <p>Find your next escape by place, mood or category.</p>
        </div>
      </div>

      <SearchFilterBar
        query={query}
        onQueryChange={setQuery}
        categories={categories}
        activeCategory={category}
        onCategoryChange={setCategory}
      />

      {!loading && (
        <p className="results-meta">
          Showing <strong>{filtered.length}</strong>{" "}
          {filtered.length === 1 ? "destination" : "destinations"}
        </p>
      )}

      {loading ? (
        <div className="dest-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <DestinationCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No destinations found"
          text="Try a different keyword or category. There is a lot of world out there."
        >
          <button className="btn btn-primary" onClick={clearFilters}>
            Clear filters
          </button>
        </EmptyState>
      ) : (
        <div className="dest-grid">
          {filtered.map((d) => (
            <DestinationCard
              key={d.id}
              destination={d}
              onPlan={(dest) => navigate(`/trips?new=${dest.id}`)}
            />
          ))}
        </div>
      )}
    </>
  );
}
