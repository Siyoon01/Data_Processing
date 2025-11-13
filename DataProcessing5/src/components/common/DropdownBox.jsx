import React, { useState, useRef, useEffect } from "react";

function toOption(o) {
  return typeof o === "string" ? { label: o, value: o } : o;
}

export default function DropdownBox({ label, options = [], value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const normalized = options.map(toOption);
  const current = normalized.find(o => o.value === value) || null;

  useEffect(() => {
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="dropdown" ref={ref}>
      <button className="dropdown-toggle" onClick={() => setOpen(!open)}>
        <span className="truncate">{label}: {current ? current.label : (value ?? "선택")}</span>
        <span className="caret">▾</span>
      </button>
      {open && (
        <div className="dropdown-menu">
          {normalized.map((opt) => (
            <button
              key={String(opt.value)}
              className="dropdown-item"
              onClick={() => { onChange?.(opt.value); setOpen(false); }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
