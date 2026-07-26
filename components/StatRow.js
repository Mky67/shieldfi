export default function StatRow({ items }) {
  return (
    <div className="stat-row">
      {items.map((item, i) => (
        <div className="stat" key={i}>
          <div className="stat-label">{item.label}</div>
          <div className={`stat-value${item.tone ? " stat-value--" + item.tone : ""}`}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
