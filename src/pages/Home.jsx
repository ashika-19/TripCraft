import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Briefcase,
  Plane,
  Wallet,
  CalendarDays,
  Compass,
} from "lucide-react";

import StatCard from "../components/StatCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import DestinationCard, {
  DestinationCardSkeleton,
} from "../components/DestinationCard.jsx";
import destinations from "../data/destinations.js";
import {
  formatCurrency,
  formatDate,
  getGreeting,
  getTripStatus,
  todayISO,
} from "../utils/formatters.js";

export default function Home({ trips }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const today = todayISO();
  const upcoming = trips
    .filter((t) => t.endDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const nextTrip = upcoming[0];
  const totalBudget = trips.reduce((sum, t) => sum + (t.budget || 0), 0);
  const featured = destinations.filter((d) => d.featured);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/explore?q=${encodeURIComponent(q)}` : "/explore");
  };

  return (
    <>
      <section className="hero">
        <span className="eyebrow eyebrow-light">Dashboard</span>
        <h1>
          {getGreeting()}, traveller. <span>Where to next?</span>
        </h1>
        <p>
          Discover places, plan every day, track your budget and pack smart, all
          in one place.
        </p>

        <form className="hero-search" onSubmit={handleSearch}>
          <Search size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Bali, beaches, mountains…"
            aria-label="Search destinations"
          />
          <button type="submit" className="btn btn-orange">
            Search
          </button>
        </form>

        <div className="hero-chips">
          {["Beach", "Mountain", "City", "Culture", "Nature"].map((c) => (
            <button
              key={c}
              type="button"
              className="hero-chip"
              onClick={() => navigate(`/explore?q=${c}`)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="stats-grid" aria-label="Quick statistics">
        <StatCard
          icon={Briefcase}
          label="Trips planned"
          value={trips.length}
          hint="Saved on this device"
          tone="teal"
        />
        <StatCard
          icon={Plane}
          label="Upcoming trips"
          value={upcoming.length}
          hint={
            nextTrip ? `Next: ${nextTrip.destination}` : "Nothing scheduled"
          }
          tone="navy"
        />
        <StatCard
          icon={Wallet}
          label="Total budget"
          value={formatCurrency(totalBudget)}
          hint="Across all trips"
          tone="orange"
        />
        <StatCard
          icon={CalendarDays}
          label="Next departure"
          value={nextTrip ? getTripStatus(nextTrip).label : "—"}
          hint={
            nextTrip ? formatDate(nextTrip.startDate) : "Plan a trip to begin"
          }
          tone="cream"
        />
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Featured destinations</h2>
            <p>Hand-picked escapes to inspire your next adventure.</p>
          </div>
          <Link to="/explore" className="link-arrow">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="dest-grid">
          {loading
            ? featured.map((d) => <DestinationCardSkeleton key={d.id} />)
            : featured.map((d) => (
                <DestinationCard
                  key={d.id}
                  destination={d}
                  onPlan={(dest) => navigate(`/trips?new=${dest.id}`)}
                />
              ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Upcoming trips</h2>
            <p>Your next journeys at a glance.</p>
          </div>
          <Link to="/trips" className="link-arrow">
            Manage trips <ArrowRight size={16} />
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No upcoming trips"
            text="Your adventures will show up here. Pick a destination and create your first trip."
          >
            <Link to="/explore" className="btn btn-primary">
              Explore destinations
            </Link>
            <Link to="/trips?new=bali" className="btn btn-ghost">
              Create a trip
            </Link>
          </EmptyState>
        ) : (
          <ul className="upcoming-list">
            {upcoming.slice(0, 4).map((t) => {
              const status = getTripStatus(t);
              return (
                <li key={t.id}>
                  <Link to={`/itinerary/${t.id}`} className="upcoming-item">
                    <div
                      className="upcoming-thumb"
                      style={{ backgroundImage: `url("${t.image}")` }}
                    />
                    <div className="upcoming-info">
                      <strong>{t.name}</strong>
                      <span>
                        {t.destination}, {t.country} ·{" "}
                        {formatDate(t.startDate, {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        –{" "}
                        {formatDate(t.endDate, {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <span
                      className={`status-chip static status-${status.tone}`}
                    >
                      {status.label}
                    </span>
                    <ArrowRight size={18} className="upcoming-arrow" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
