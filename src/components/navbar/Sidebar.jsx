'use client'; 

// --- 1. Importar o 'logout' do contexto ---
import { useAuth } from "../../AuthContext"; 
import NavItem from "./SidebarItem";             

function Sidebar() {
  // --- 2. Obter a função 'logout' ---
  const { profile, logout } = useAuth(); 

  return (
    <aside className="w-64 min-h-screen bg-blue-900 text-white p-4 flex flex-col shadow-xl sticky top-0">
      <div className="text-2xl font-extrabold mb-8 p-2 border-b border-blue-700">
        Painel - APA
      </div>
      
      <nav className="flex-1">
        <ul>
          {/* O resto do seu menu (Admin, Profissional, Paciente) fica igual */}
          {(profile === "admin" || profile === "ProfissionaldeSaude") && (
            <>
              {profile === "admin" && (
                <>
                  <NavItem to="/admin" label="Painel Admin" />
                  <NavItem to="/Instituicoes/ubs" label="Cadastrar Posto de Saúde (PSF)" />
                  <NavItem to="/CadastroProfissional" label="Cadastro de Profissional de Saúde" />
                  <NavItem to="/PesquisaPaciente" label="Encontrar Pacientes" />
                  <NavItem to="/PesquisaProfissional" label="Encontrar Profissionais de Saúde" />


                </>
              )}
              
              {profile === "ProfissionaldeSaude" && (
                <>
                  <NavItem to="/ProfissionalDeSaude" label="Painel do Profissional" />
                  <NavItem to="/CadastrarPacientes" label="Cadastrar Pacientes" />
                  <NavItem to="/FichasAtivas" label="Visualizar Fichas Ativas" />
                  <NavItem to="/PesquisaPaciente" label="Encontrar Pacientes" />
                  <NavItem to="/VisualizarProntuarios" label="Visualizar Prontuários" />
                </>
              )}
            </>
          )}

          {profile === "Paciente" && (
            <NavItem to="/Paciente" label="Painel do Paciente" />
          )}

          {!profile && <li className="text-gray-400 text-sm p-2">Faça login para ver o menu.</li>}
        </ul>
      </nav>

      {/* Botão "Sair" adicionado aqui em baixo --- */}
      <div className="mt-auto pt-4 border-t border-blue-700">
        <p className="mb-2 text-xs text-gray-200">
          Perfil: <span className='capitalize font-bold'>{profile || 'Convidado'}</span>
        </p>
        
        <button
          onClick={logout} // Chama a função de logout do AuthContext
          className="
            w-full py-2 px-4 rounded 
            text-base font-medium 
            bg-blue-800 hover:bg-blue-700 
            text-white 
            transition duration-150
          "
        >
          Sair
        </button>
        
        <p className='text-gray-400 text-xs text-center mt-3'>
          &copy; {new Date().getFullYear()} APA
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;