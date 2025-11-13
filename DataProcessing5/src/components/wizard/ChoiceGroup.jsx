import React from "react";
import Button from "../common/Button";

/**
 * type: "multi" | "binary"
 * options: string[]  또는  { a: string, b: string }
 * active: 현재 선택된 값(하이라이트)
 * onSelect(val): 클릭 시 호출
 * block: true면 버튼을 가로로 넓게
 */
export default function ChoiceGroup({
  type = "multi",
  options = [],
  active,
  onSelect,
  block = false,
}) {
  const list = Array.isArray(options) ? options : [options.a, options.b];

  return (
    <div className="choicegroup" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {list.map((label) => (
        <Button
          key={label}
          onClick={() => onSelect?.(label)}
          variant={active === label ? "solid" : "outline"}
          style={{
            minWidth: 120,
            flex: block ? "1 1 200px" : "0 0 auto",
            justifyContent: "center",
          }}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
