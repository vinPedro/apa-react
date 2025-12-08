"use client";

import { useState } from "react";

export default function FormularioSinaisVitais({ onSalvar, onCancelar }) {

  /* ============================
     STATE DO FORMULÁRIO
     👉 Dados que serão enviados ao backend
     ============================ */
  const [formData, setFormData] = useState({
    paciente: "",
    ficha: "",
    peso: "",
    altura: "",
    pressao: "",
    temperatura: "",
    sintomas: "",
  });

  /* ============================
     HANDLER GENÉRICO
     Atualiza os campos do formulário
     ============================ */
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  /* ============================
     SUBMIT
     👉 AQUI É ONDE CONECTA COM O BACKEND
     ============================ */
  async function handleSubmit(e) {
    e.preventDefault();

    // ✅ Aqui você pode validar antes de enviar
    // if (!formData.paciente || !formData.ficha) return;

    // ✅ EXEMPLO DE CONEXÃO COM BACKEND
    // Substitua a URL pela sua API
    /*
    await fetch("http://localhost:8080/sinais-vitais", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": "Bearer SEU_TOKEN_JWT"
      },
      body: JSON.stringify(formData),
    });
    */

    // ✅ Ou apenas enviar os dados para o componente pai
    if (onSalvar) {
      onSalvar(formData);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 md:p-12"
      >

        {/* ============================
            CABEÇALHO
           ============================ */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Cadastro de Sinais Vitais
          </h1>
          <p className="text-gray-500 mt-2">
            Informe corretamente os dados do paciente
          </p>
        </header>

        {/* ============================
            IDENTIFICAÇÃO DO PACIENTE
           ============================ */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-5">
            Identificação do Paciente
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ✅ Campo enviado ao backend */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Paciente
              </label>
              <input
                type="text"
                name="paciente"
                value={formData.paciente}
                onChange={handleChange}
                placeholder="Nome completo"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* ✅ Campo alfanumérico enviado ao backend */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Número da Ficha
              </label>
              <input
                type="text"
                name="ficha"
                value={formData.ficha}
                onChange={(e) => {
                  const valor = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                  setFormData(prev => ({ ...prev, ficha: valor }));
                }}
                placeholder="Ex: AB1023"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* ============================
            MEDIDAS CORPORAIS
           ============================ */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-5">
            Medidas Corporais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ✅ Peso enviado ao backend */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                step="0.1"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* ✅ Altura enviada ao backend */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Altura (m)
              </label>
              <input
                type="number"
                step="0.01"
                name="altura"
                value={formData.altura}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* ============================
            SINAIS VITAIS
           ============================ */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-5">
            Sinais Vitais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ✅ Pressão enviada ao backend */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Pressão Arterial
              </label>
              <input
                type="text"
                name="pressao"
                value={formData.pressao}
                onChange={handleChange}
                placeholder="120/80"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* ✅ Temperatura enviada ao backend */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Temperatura (°C)
              </label>
              <input
                type="number"
                step="0.1"
                name="temperatura"
                value={formData.temperatura}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* ============================
            SINTOMAS
           ============================ */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold text-gray-700 mb-5">
            Sintomas Relatados
          </h2>

          {/* ✅ Texto livre enviado ao backend */}
          <textarea
            name="sintomas"
            value={formData.sintomas}
            onChange={handleChange}
            rows={5}
            placeholder="Descreva os sintomas do paciente"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </section>

        {/* ============================
            BOTÕES
            👉 Nenhuma lógica de backend aqui
           ============================ */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancelar}
            className="px-6 py-2.5 rounded-lg border border-gray-400 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow"
          >
            Salvar Cadastro
          </button>
        </div>

      </form>
    </div>
  );
}
