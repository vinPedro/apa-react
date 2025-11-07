"use client"

import { useState } from "react";

export default function Formulario({ initialValues, onSubmit, children }) {
    const [formData, setFormData] = useState(initialValues);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit(formData);
    }

    return (
        <div className="px-6 py-3">
            <form onSubmit={handleSubmit} className="flex flex-col min-w-[300px] max-w-[700px] w-full space-y-5">
               {children({ formData, handleChange })}
            </form>
        </div>
    )
}