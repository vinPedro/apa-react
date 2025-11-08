
import ProfissionalCadastroForm from '@/components/forms/ProfissionalCadastroForm';


export default function CadastroProfissionalPage() {
  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      
   
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Cadastrar Novo Profissional de Saúde
        </h1>
        <p className="text-gray-600">
          Preencha os dados do novo profissional para registro. Acesso restrito ao Administrador.
        </p>
      </div>

    
      <div className="max-w-4xl mx-auto">
        <ProfissionalCadastroForm />
      </div>

    </div>
  );
}