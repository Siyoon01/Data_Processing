import React from "react";

export default function Button({
    children,
    onClick,
    disabled,
    variant = "primary",   
    size,                 
    type = "button",
    className = "",
    ...rest
}) {
    const mapped =
        variant === "solid" ? "primary" :
        variant === "outline" ? "ghost" : variant;

    const sizeClass = size === "sm" ? "small" : "";
    const cls = `btn ${mapped} ${sizeClass} ${className}`.trim();

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={cls} {...rest}>
            {children}
        </button>
    );
}
