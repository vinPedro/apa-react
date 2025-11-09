
import UbsCadastroForm from '@/components/forms/UbsCadastroForm';


export default function UbsCadastroContainer() {
  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      
     
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Cadastrar Nova Unidade Básica de Saúde (UBS)
        </h1>
        <p className="text-gray-600">
          Preencha os dados básicos da nova UBS para registro no sistema.
        </p>
      </div>

     
      <div className="max-w-3xl mx-auto">
       
        <UbsCadastroForm />
      </div>

    </div>
  );
}