"use client";

import { useState, useEffect } from "react";

// Adicionei a prop 'isLoading' e 'patient'
export default function FormularioSinaisVitais({ onSalvar, onCancelar, patient, isLoading }) {

  const [formData, setFormData] = useState({
    paciente: "",
    ficha: "",
    peso: "",
    altura: "",
    pressao: "",
    temperatura: "",
    sintomas: "",
  });

  // Efeito para preencher dados vindos do componente pai (Page)
  useEffect(() => {
    if (patient) {
      setFormData(prev => ({
        ...prev,
        paciente: patient.nome || "",
        ficha: patient.senha || ""
      }));
    }
  }, [patient]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (onSalvar) {
      onSalvar(formData);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12"
      >
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Triagem / Sinais Vitais
          </h1>
          <p className="text-gray-500 mt-2">
            Registro clínico inicial do paciente
          </p>
        </header>

        {/* IDENTIFICAÇÃO (Agora ReadOnly para garantir integridade com o ID da URL) */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-5">
            Identificação
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Paciente
              </label>
              <input
                type="text"
                name="paciente"
                value={formData.paciente}
                onChange={handleChange}
                disabled={true} // Travado pois vem da seleção anterior
                className="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2.5 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Senha / Ficha (Opcional)
              </label>
              <input
                type="text"
                name="ficha"
                value={formData.ficha}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* MEDIDAS */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-5">
            Dados Clínicos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                name="peso"
                required
                value={formData.peso}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Altura (m)</label>
              <input
                type="number"
                step="0.01"
                name="altura"
                required
                value={formData.altura}
                onChange={handleChange}
                placeholder="Ex: 1.75"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">PA (mmHg)</label>
              <input
                type="text"
                name="pressao"
                required
                value={formData.pressao}
                onChange={handleChange}
                placeholder="Ex: 12/8"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Temp (°C)</label>
              <input
                type="number"
                step="0.1"
                name="temperatura"
                required
                value={formData.temperatura}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-700 mb-5">Sintomas / Queixa</h2>
          <textarea
            name="sintomas"
            value={formData.sintomas}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </section>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancelar}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2.5 rounded-lg text-white font-semibold shadow transition
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            `}
          >
            {isLoading ? "Salvando..." : "Salvar Triagem"}
          </button>
        </div>
      </form>
    </div>
  );
}