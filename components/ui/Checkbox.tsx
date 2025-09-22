import * as React from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  id?: string;
  checked?: boolean;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, className = "", onCheckedChange, checked = false, ...props }, ref) => {
    // Toggle helper: call the provided handler with the new boolean state
    const toggle = (next?: boolean) => {
      const nextVal = typeof next === "boolean" ? next : !checked;
      onCheckedChange?.(nextVal);
    };

    return (
      <label
        htmlFor={id}
        className={`inline-flex items-center cursor-pointer select-none ${className}`}
      >
        {/* keep native input for accessibility (visually hidden but focusable) */}
        <input
          id={id}
          ref={ref}
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="absolute opacity-0 w-0 h-0"
          aria-checked={checked}
          {...props}
        />

        {/* visible box */}
        <button
          type="button"
          onClick={() => toggle()}
          aria-pressed={checked}
          className={`flex items-center justify-center h-5 w-5 rounded-sm border transition-colors focus:outline-none
            ${checked ? "bg-sky-600 border-sky-600 text-white" : "bg-white border-gray-300 text-gray-800"}`}
        >
          {checked ? (
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M20.285 6.709a1 1 0 0 0-1.414-1.418L9 15.18l-3.871-3.87A1 1 0 1 0 3.715 13.93l4.586 4.586a1 1 0 0 0 1.414 0l11.57-11.807z" />
            </svg>
          ) : null}
        </button>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
