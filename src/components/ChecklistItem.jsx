import { Check, Trash2 } from "lucide-react";

export default function ChecklistItem({ item, onToggle, onDelete }) {
  return (
    <li className={`check-item${item.packed ? " packed" : ""}`}>
      <label className="check-label">
        <input
          type="checkbox"
          checked={item.packed}
          onChange={() => onToggle(item.id)}
        />
        <span className="check-box">
          <Check size={14} strokeWidth={3} />
        </span>
        <span className="check-text">{item.text}</span>
      </label>
      <button
        className="icon-btn icon-btn-danger"
        aria-label={`Delete ${item.text}`}
        onClick={() => onDelete(item.id)}
      >
        <Trash2 size={15} />
      </button>
    </li>
  );
}
