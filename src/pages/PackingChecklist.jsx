import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Briefcase, Plus, ListChecks } from "lucide-react";

import { TripBanner, TripPicker } from "../components/TripCard.jsx";
import ChecklistItem from "../components/ChecklistItem.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { packingTemplates } from "../data/packingTemplates.js";
import { generateId } from "../utils/storage.js";

const CATEGORY_OPTIONS = [...packingTemplates.map((t) => t.label), "Other"];

export default function PackingChecklist({ trips, updateTrip }) {
  const { tripId } = useParams();
  const trip = trips.find((t) => t.id === tripId);

  const [text, setText] = useState("");
  const [category, setCategory] = useState("Essentials");

  if (!trip) {
    return (
      <>
        <div className="page-header">
          <div>
            <span className="eyebrow">Packing</span>
            <h1>Packing checklist</h1>
            <p>Choose a trip to prepare its packing list.</p>
          </div>
        </div>
        {trips.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No trips to pack for yet"
            text="Create a trip first, then never forget a thing."
          >
            <Link to="/trips?new=bali" className="btn btn-primary">
              Create a trip
            </Link>
            <Link to="/explore" className="btn btn-ghost">
              Explore destinations
            </Link>
          </EmptyState>
        ) : (
          <TripPicker trips={trips} basePath="/packing" />
        )}
      </>
    );
  }

  const items = trip.packing || [];
  const packedCount = items.filter((i) => i.packed).length;
  const percent = items.length
    ? Math.round((packedCount / items.length) * 100)
    : 0;
  const groups = CATEGORY_OPTIONS.map((name) => ({
    name,
    items: items.filter((i) => i.category === name),
  })).filter((g) => g.items.length > 0);

  const save = (next) => updateTrip(trip.id, { packing: next });

  const addItem = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    save([
      ...items,
      { id: generateId(), text: value, category, packed: false },
    ]);
    setText("");
  };

  const addTemplate = (template) => {
    const existing = new Set(items.map((i) => i.text.toLowerCase()));
    const fresh = template.items
      .filter((name) => !existing.has(name.toLowerCase()))
      .map((name) => ({
        id: generateId(),
        text: name,
        category: template.label,
        packed: false,
      }));
    if (fresh.length) save([...items, ...fresh]);
  };

  const toggleItem = (id) =>
    save(items.map((i) => (i.id === id ? { ...i, packed: !i.packed } : i)));
  const deleteItem = (id) => save(items.filter((i) => i.id !== id));
  const clearPacked = () => save(items.filter((i) => !i.packed));

  return (
    <>
      <div className="page-header">
        <div>
          <span className="eyebrow">Packing</span>
          <h1>Packing checklist</h1>
          <p>
            {packedCount} of {items.length} items packed
          </p>
        </div>
        {packedCount > 0 && (
          <button className="btn btn-ghost" onClick={clearPacked}>
            Clear packed items
          </button>
        )}
      </div>

      <TripPicker trips={trips} basePath="/packing" activeId={trip.id} />
      <TripBanner trip={trip} />

      <div className="card panel">
        <div className="pack-progress-head">
          <h3>Progress</h3>
          <strong>{percent}%</strong>
        </div>
        <div className="progress progress-lg">
          <div className="progress-bar" style={{ width: `${percent}%` }} />
        </div>

        <form className="pack-form" onSubmit={addItem}>
          <input
            className="input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add an item, e.g. Travel pillow"
            aria-label="New packing item"
          />
          <select
            className="input pack-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Category"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary">
            <Plus size={16} /> Add
          </button>
        </form>

        <div className="template-row">
          <span>Quick add:</span>
          {packingTemplates.map((t) => (
            <button
              key={t.id}
              type="button"
              className="chip"
              onClick={() => addTemplate(t)}
            >
              <Plus size={13} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="Your list is empty"
          text="Add items one by one, or tap a quick-add list above to get started."
        />
      ) : (
        <div className="check-groups">
          {groups.map((g) => (
            <section key={g.name} className="card check-group">
              <h4>
                {g.name}
                <span>
                  {g.items.filter((i) => i.packed).length}/{g.items.length}
                </span>
              </h4>
              <ul>
                {g.items.map((item) => (
                  <ChecklistItem
                    key={item.id}
                    item={item}
                    onToggle={toggleItem}
                    onDelete={deleteItem}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
