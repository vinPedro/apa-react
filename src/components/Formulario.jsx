"use client"

import { useState } from "react";

export default function Formulario({ initialValues, onSubmit, children, titulo, subTitulo}) {
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

    function handleSelectChange(name, value) {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    return (
        <div className="px-6 py-3">
            <h1 className="text-center !text-[clamp(25px,5vw,30px)] !font-bold mb-[clamp(10px,5vw,30px)]">{titulo}</h1>
            <h2 className="text-center !text-[clamp(15px,5vw,20px)] mb-[clamp(10px,5vw,30px)]">{subTitulo}</h2>
            <form onSubmit={handleSubmit} className="flex flex-col min-w-[300px] max-w-[700px] w-full space-y-5">
               {children({ formData, handleChange, handleSelectChange})}
            </form>
        </div>
    )
}