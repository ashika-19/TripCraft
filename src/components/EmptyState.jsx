export default function EmptyState({
  icon: Icon,
  title,
  text,
  children,
  compact = false,
}) {
  return (
    <div className={`empty-state${compact ? " compact" : ""}`}>
      <div className="empty-icon">
        {Icon && <Icon size={compact ? 24 : 32} />}
      </div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children && <div className="empty-actions">{children}</div>}
    </div>
  );
}
