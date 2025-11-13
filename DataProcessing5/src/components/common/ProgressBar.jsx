import React from "react";

export default function ProgressBar({ value = 0, height = 8, bg = "#eee", fg = "#111" }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className="progressbar"
      style={{
        width: "100%",
        height,
        background: bg,
        borderRadius: 999,
        overflow: "hidden",
      }}
      aria-label="progress"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      role="progressbar"
    >
      <div
        className="progressbar__bar"
        style={{
          width: `${v}%`,
          height: "100%",
          background: fg,
          borderRadius: 999,
          transition: "width .2s ease",
        }}
      />
    </div>
  );
}
