import { useState } from "react";
import { Plus, Trash2, Clock } from "lucide-react";
import { formatDate } from "../utils/formatters.js";

export default function ItineraryDay({
  day,
  date,
  activities,
  onAdd,
  onRemove,
}) {
  const [time, setTime] = useState("09:00");
  const [title, setTitle] = useState("");

  const sorted = [...activities].sort((a, b) =>
    (a.time || "").localeCompare(b.time || ""),
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(day, { time, title: title.trim() });
    setTitle("");
  };

  return (
    <section className="day-card">
      <header className="day-head">
        <span className="day-number">Day {day}</span>
        <span className="day-date">
          {formatDate(date, {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </span>
        <span className="day-count">
          {activities.length}{" "}
          {activities.length === 1 ? "activity" : "activities"}
        </span>
      </header>

      {sorted.length === 0 ? (
        <p className="day-empty">
          Nothing planned yet. Add your first stop below.
        </p>
      ) : (
        <ul className="activity-list">
          {sorted.map((a) => (
            <li key={a.id} className="activity">
              <span className="activity-time">
                <Clock size={13} /> {a.time || "—"}
              </span>
              <span className="activity-title">{a.title}</span>
              <button
                className="icon-btn icon-btn-danger"
                aria-label={`Remove ${a.title}`}
                onClick={() => onRemove(day, a.id)}
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="activity-form" onSubmit={handleSubmit}>
        <input
          type="time"
          className="input input-time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          aria-label="Time"
        />
        <input
          type="text"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Visit the old fort"
          aria-label="Activity"
        />
        <button type="submit" className="btn btn-primary btn-sm">
          <Plus size={16} /> Add
        </button>
      </form>
    </section>
  );
}
