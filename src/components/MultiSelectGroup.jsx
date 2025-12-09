import React, { useId, useState, forwardRef } from "react";

export function MultiSelectGroup({
  values,
  defaultValues = [],
  onChange,
  children,
  className = "",
  ariaLabel = "Multiselect group",
}) {
  const [internalValues, setInternalValues] = useState(defaultValues);

  const selectedValues = values ?? internalValues;

  function toggleValue(v) {
    const exists = selectedValues.includes(v);

    const updated = exists
      ? selectedValues.filter((x) => x !== v)
      : [...selectedValues, v];

    if (onChange) onChange(updated);
    if (values === undefined) setInternalValues(updated);
  }

  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child, {
      selected: selectedValues,
      onToggle: toggleValue,
    });
  });

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`flex gap-2 flex-wrap ${className}`}
    >
      {items}
    </div>
  );
}

export const MultiSelectOption = forwardRef(
  ({ value, children, selected = [], onToggle, disabled = false, className = "" }, ref) => {
    const id = useId();
    const checked = selected.includes(value);

    function handleClick() {
      if (!disabled) onToggle?.(value);
    }

    return (
      <label
        ref={ref}
        htmlFor={id}
        className={`select-none cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-2xl border transition 
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${checked ? "shadow-md border-sky-500" : "border-gray-200"}
          ${className}`}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleClick}
          disabled={disabled}
          className="sr-only"
        />

        <span
          className={`w-4 h-4 rounded-md flex items-center justify-center border 
            ${checked ? "bg-sky-600 border-sky-600" : "bg-white border-gray-300"}`}
        >
          {checked && <span className="block w-2 h-2 rounded-sm bg-white" />}
        </span>

        <span className="text-sm">{children}</span>
      </label>
    );
  }
);

MultiSelectOption.displayName = "MultiSelectOption";
