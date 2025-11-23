import React, { useId, useState } from 'react';

export function ToggleSwitch({
    checked,
    defaultChecked,
    onChange,
    label,
    id,
    disabled = false,
    className = '',
}) {
    const internalId = id ?? `toggle-${useId()}`
    const [internal, setInternal] = useState(!!defaultChecked)
    const state = checked ?? internal


    function handleToggle() {
        if (disabled) return
        const next = !state
        if (onChange) onChange(next)
        if (checked === undefined) setInternal(next)
    }


    return (
        <div className={`inline-flex items-center gap-3 ${className}`}>
            {label && <label htmlFor={internalId} className={`text-sm ${disabled ? 'opacity-60' : ''}`}>{label}</label>}


            <button
            type='button'
                id={internalId}
                role="switch"
                aria-checked={state}
                onClick={handleToggle}
                disabled={disabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${state ? 'bg-sky-600' : 'bg-gray-300'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${state ? 'translate-x-5' : 'translate-x-1'}`}
                />
            </button>
        </div>
    )
}