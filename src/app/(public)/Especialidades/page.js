
import EspecialidadeCadastroForm from '@/components/forms/EspecialidadeCadastroForm';


export default function CadastroEspecialidadePage() {
  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Cadastrar Nova Especialidade Médica
        </h1>
        <p className="text-gray-600">
          Defina o nome e a descrição da nova especialidade para uso no sistema. Acesso restrito ao Administrador.
        </p>
      </div>

      
      <div className="max-w-3xl mx-auto">
        <EspecialidadeCadastroForm />
      </div>

    </div>
  );
}