import React from "react";

export function Chip({ children, onClick }) {
  return (
    <span
      className="chip"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        border: "1px solid #e5e7eb",
        borderRadius: 999,
        fontSize: 12,
        lineHeight: 1,
        cursor: onClick ? "pointer" : "default",
        background: "#fff",
      }}
    >
      {children}
    </span>
  );
}

export default function Chips({ items = [], renderItem }) {
  return (
    <div className="chips" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {items.map((it, i) =>
        renderItem ? <Chip key={i}>{renderItem(it, i)}</Chip> : <Chip key={i}>{String(it)}</Chip>
      )}
    </div>
  );
}
