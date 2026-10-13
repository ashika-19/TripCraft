import { useState } from "react";
import { MapPin, Star, ArrowRight, Clock } from "lucide-react";
import { formatCurrency } from "../utils/formatters.js";

export function DestinationCardSkeleton() {
  return (
    <div className="dest-card skeleton-card" aria-hidden="true">
      <div className="dest-media skeleton" />
      <div className="dest-body">
        <div className="skeleton sk-line w60" />
        <div className="skeleton sk-line w40" />
        <div className="skeleton sk-line" />
        <div className="skeleton sk-line w80" />
      </div>
    </div>
  );
}

export default function DestinationCard({ destination, onPlan }) {
  const [failed, setFailed] = useState(false);
  const d = destination;

  return (
    <article className="dest-card">
      <div className="dest-media">
        {!failed && (
          <img
            src={d.image}
            alt={`${d.name}, ${d.country}`}
            loading="lazy"
            onError={() => setFailed(true)}
          />
        )}
        <span className="dest-badge">{d.category}</span>
        <span className="dest-rating">
          <Star size={13} fill="currentColor" /> {d.rating}
        </span>
        <div className="dest-title">
          <h3>{d.name}</h3>
          <p>
            <MapPin size={14} /> {d.country}
          </p>
        </div>
      </div>

      <div className="dest-body">
        <p className="dest-desc">{d.description}</p>
        <div className="dest-meta">
          <span>
            <Clock size={14} /> {d.days} days · {d.bestTime}
          </span>
        </div>
        <div className="dest-footer">
          <div>
            <span className="dest-from">From</span>
            <strong className="dest-price">{formatCurrency(d.cost)}</strong>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => onPlan(d)}>
            Plan trip <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
