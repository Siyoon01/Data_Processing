import React from "react";

/**
 * items: [{ label, value }] 형태
 * columns: 2|3|4
 */
export default function KeyValueGrid({ items = [], columns = 2, dense = false, align = "left" }) {
  const gap = dense ? 8 : 12;
  const textAlign =
    align === "center" ? "center" : align === "right" ? "right" : "left";

  return (
    <div
      className="kvgrid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap,
      }}
    >
      {items.map(({ label, value }, i) => (
        <div key={i} className="kvgrid__cell" style={{ textAlign }}>
          <div className="kvgrid__label" style={{ fontSize: 12, color: "#6b7280" }}>
            {label}
          </div>
          <div className="kvgrid__value" style={{ fontWeight: 600 }}>
            {value ?? "-"}
          </div>
        </div>
      ))}
    </div>
  );
}
