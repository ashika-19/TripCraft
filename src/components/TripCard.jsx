import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  CalendarDays,
  Wallet,
  Luggage,
  Users,
  Trash2,
} from "lucide-react";
import {
  formatCurrency,
  formatDate,
  getDayCount,
  getTripStatus,
} from "../utils/formatters.js";
import { getTotalSpent } from "../utils/budgetHelpers.js";

/* Banner shown at the top of Itinerary / Budget / Packing pages */
export function TripBanner({ trip }) {
  return (
    <section
      className="trip-banner"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(11,31,58,.15), rgba(11,31,58,.85)), url("${trip.image}")`,
      }}
    >
      <span className="trip-banner-chip">
        <MapPin size={14} /> {trip.destination}, {trip.country}
      </span>
      <h2>{trip.name}</h2>
      <p>
        {formatDate(trip.startDate)} – {formatDate(trip.endDate)} ·{" "}
        {getDayCount(trip)} days · {trip.travellers}{" "}
        {trip.travellers > 1 ? "travellers" : "traveller"}
      </p>
    </section>
  );
}

/* Pill switcher between trips. Also used as the "choose a trip" screen. */
export function TripPicker({ trips, basePath, activeId }) {
  return (
    <div className="trip-picker">
      {trips.map((t) => (
        <Link
          key={t.id}
          to={`${basePath}/${t.id}`}
          className={`trip-pill${t.id === activeId ? " active" : ""}`}
        >
          <strong>{t.name}</strong>
          <span>{t.destination}</span>
        </Link>
      ))}
    </div>
  );
}

export default function TripCard({ trip, onDelete }) {
  const [failed, setFailed] = useState(false);
  const status = getTripStatus(trip);
  const spent = getTotalSpent(trip.expenses);
  const percent =
    trip.budget > 0
      ? Math.min(100, Math.round((spent / trip.budget) * 100))
      : 0;
  const packing = trip.packing || [];
  const packed = packing.filter((i) => i.packed).length;

  const handleDelete = () => {
    if (window.confirm(`Delete "${trip.name}"? This cannot be undone.`))
      onDelete(trip.id);
  };

  return (
    <article className="trip-card">
      <div className="trip-media">
        {!failed && (
          <img
            src={trip.image}
            alt={trip.destination}
            loading="lazy"
            onError={() => setFailed(true)}
          />
        )}
        <span className={`status-chip status-${status.tone}`}>
          {status.label}
        </span>
        <button
          className="trip-delete"
          aria-label={`Delete ${trip.name}`}
          onClick={handleDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="trip-body">
        <h3>{trip.name}</h3>
        <p className="trip-place">
          <MapPin size={14} /> {trip.destination}, {trip.country}
        </p>

        <ul className="trip-facts">
          <li>
            <CalendarDays size={15} />
            {formatDate(trip.startDate, {
              day: "numeric",
              month: "short",
            })}{" "}
            –{" "}
            {formatDate(trip.endDate, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </li>
          <li>
            <Users size={15} /> {trip.travellers}{" "}
            {trip.travellers > 1 ? "travellers" : "traveller"}
          </li>
        </ul>

        <div className="trip-budget">
          <div className="trip-budget-row">
            <span>
              {formatCurrency(spent)} of {formatCurrency(trip.budget)}
            </span>
            <span>{percent}%</span>
          </div>
          <div className="progress">
            <div
              className={`progress-bar${percent >= 100 ? " over" : ""}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <p className="trip-packed">
          <Luggage size={14} /> {packed}/{packing.length} items packed
        </p>

        <div className="trip-actions">
          <Link to={`/itinerary/${trip.id}`} className="btn btn-ghost btn-sm">
            <CalendarDays size={15} /> Itinerary
          </Link>
          <Link to={`/budget/${trip.id}`} className="btn btn-ghost btn-sm">
            <Wallet size={15} /> Budget
          </Link>
          <Link to={`/packing/${trip.id}`} className="btn btn-ghost btn-sm">
            <Luggage size={15} /> Pack
          </Link>
        </div>
      </div>
    </article>
  );
}
