import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, X, Briefcase } from "lucide-react";

import TripCard from "../components/TripCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import destinations from "../data/destinations.js";
import { addDays, todayISO } from "../utils/formatters.js";

function makeDefaults(destId) {
  const dest = destinations.find((d) => d.id === destId) || destinations[0];
  const start = addDays(todayISO(), 14);
  return {
    destinationId: dest.id,
    name: "",
    startDate: start,
    endDate: addDays(start, dest.days - 1),
    budget: dest.cost,
    travellers: 2,
  };
}

export default function MyTrips({ trips, addTrip, deleteTrip }) {
  const [params, setParams] = useSearchParams();
  const preselected = params.get("new");

  const [showForm, setShowForm] = useState(Boolean(preselected));
  const [form, setForm] = useState(() => makeDefaults(preselected));

  const selectedDest =
    destinations.find((d) => d.id === form.destinationId) || destinations[0];

  const openForm = () => {
    setForm(makeDefaults(destinations[0].id));
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    if (params.get("new")) setParams({});
  };

  useEffect(() => {
    if (!showForm) return undefined;
    const onKey = (e) => e.key === "Escape" && closeForm();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "destinationId") {
        const d = destinations.find((x) => x.id === value);
        if (d) {
          next.budget = d.cost;
          next.endDate = addDays(next.startDate, d.days - 1);
        }
      }
      if (name === "startDate" && next.endDate < value) next.endDate = value;
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTrip(form);
    closeForm();
  };

  return (
    <>
      <div className="page-header">
        <div>
          <span className="eyebrow">My Trips</span>
          <h1>My trips</h1>
          <p>
            {trips.length === 0
              ? "Your planned journeys will appear here."
              : `${trips.length} trip${trips.length > 1 ? "s" : ""} planned. Open one to build the itinerary, budget and packing list.`}
          </p>
        </div>
        <button className="btn btn-primary" onClick={openForm}>
          <Plus size={18} /> Create trip
        </button>
      </div>

      {trips.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No trips yet"
          text="Create your first trip and start crafting the perfect itinerary."
        >
          <button className="btn btn-primary" onClick={openForm}>
            <Plus size={18} /> Create trip
          </button>
          <Link to="/explore" className="btn btn-ghost">
            Browse destinations
          </Link>
        </EmptyState>
      ) : (
        <div className="trip-grid">
          {trips.map((t) => (
            <TripCard key={t.id} trip={t} onDelete={deleteTrip} />
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="trip-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-preview"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(11,31,58,.1), rgba(11,31,58,.8)), url("${selectedDest.image}")`,
              }}
            >
              <button
                className="icon-btn modal-close"
                aria-label="Close"
                onClick={closeForm}
              >
                <X size={20} />
              </button>
              <h2 id="trip-modal-title">Create a new trip</h2>
              <p>
                {selectedDest.name}, {selectedDest.country}
              </p>
            </div>

            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="field span-2">
                <label htmlFor="destinationId">Destination</label>
                <select
                  id="destinationId"
                  name="destinationId"
                  className="input"
                  value={form.destinationId}
                  onChange={handleChange}
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}, {d.country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field span-2">
                <label htmlFor="name">Trip name</label>
                <input
                  id="name"
                  name="name"
                  className="input"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={`e.g. ${selectedDest.name} with friends`}
                />
              </div>

              <div className="field">
                <label htmlFor="startDate">Start date</label>
                <input
                  id="startDate"
                  name="startDate"
                  className="input"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="endDate">End date</label>
                <input
                  id="endDate"
                  name="endDate"
                  className="input"
                  type="date"
                  min={form.startDate}
                  value={form.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="budget">Budget (₹)</label>
                <input
                  id="budget"
                  name="budget"
                  className="input"
                  type="number"
                  min="0"
                  value={form.budget}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="travellers">Travellers</label>
                <input
                  id="travellers"
                  name="travellers"
                  className="input"
                  type="number"
                  min="1"
                  max="20"
                  value={form.travellers}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions span-2">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Plus size={18} /> Create trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
