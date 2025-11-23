import React, { useId, useState, forwardRef } from 'react';

export function RadioGroup({
    value,
    defaultValue,
    onChange,
    children,
    ariaLabel = 'Radio group',
    name,
    className = '',
}) {
    const generatedName = useId()
    const internalName = name ?? `radio-${generatedName}`


    const [internalValue, setInternalValue] = useState(defaultValue)
    const selected = value ?? internalValue


    function handleChange(v) {
        if (onChange) onChange(v)
        if (value === undefined) setInternalValue(v)
    }


    const items = React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(child, {
            name: internalName,
            selected,
            onChange: handleChange,
        })
    })


    return (
        <div role="radiogroup" aria-label={ariaLabel} className={`flex gap-2 ${className}`}>
            {items}
        </div>
    )
}

export const RadioOption = forwardRef(({ value, children, disabled = false, className = '', name, selected, onChange }, ref) => {
    const id = useId()
    const checked = selected === value


    function handleInputChange() {
        if (!disabled) onChange?.(value)
    }


    return (
        <label
            ref={ref}
            htmlFor={id}
            className={`select-none cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-2xl border transition-shadow ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                } ${checked ? 'shadow-md border-sky-500' : 'border-gray-200'} ${className}`}
        >
            <input
                id={id}
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={handleInputChange}
                disabled={disabled}
                className="sr-only"
            />


            <span
                className={`w-4 h-4 rounded-full flex items-center justify-center border ${checked ? 'bg-sky-600 border-sky-600' : 'bg-white border-gray-300'
                    }`}
            >
                {checked && <span className="block w-2 h-2 rounded-full bg-white" />}
            </span>


            <span className="text-sm">{children}</span>
        </label>
    )
})
RadioOption.displayName = 'RadioOption'