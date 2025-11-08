
'use client'; 



import { useAuth } from "../AuthContext"; 



const dashboardStats = [
  { title: 'Fichas Ativas', value: 4 },
  { title: 'Profissionais Disponíveis', value: 7 },
  { title: 'Instituições Online', value: 2 },
  { title: 'Atendimentos Pendentes', value: 15 }, 
];


export default function DashboardPage() {
  
  const { profile } = useAuth();
  
 
  let userName = 'Usuário'; 
  if (profile === 'admin') {
    userName = 'João '; 
  }

  


  
  
  if (profile == 'admin') {
  return (
    <div className="space-y-8">
      
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo(a), {userName}!</h1>
        <p className="text-gray-600">
          Neste Painel, todas as funcionalidades podem ser administradas por você!
        </p>
      </div>
      
    </div>
  );

}
  if (profile == 'ProfissionaldeSaude') {
  return (
    <div className="space-y-8">
      
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo(a), {userName}!</h1>
        <p className="text-gray-600">
          Neste Painel, você poderá fazer as funcionalidades de um Profissional de Saúde!
        </p>
      </div>
      
    </div>
  );

}
  if (profile == 'Paciente') {
  return (
    <div className="space-y-8">
      
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo(a), {userName}!</h1>
        <p className="text-gray-600">
          Neste Painel, todas as funcionalidades de Paciente podem ser visualizadas por você!
        </p>
      </div>
      
    </div>
  );

}
}