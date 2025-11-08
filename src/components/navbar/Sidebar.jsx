
'use client'; 

import { useAuth } from "../../AuthContext"; 
import NavItem from "./SidebarItem";             

function Sidebar() {
  const { profile } = useAuth(); 

  return (

    <aside className="w-64 min-h-screen bg-blue-900 text-white p-4 flex flex-col shadow-xl sticky top-0">
      
      
      <div className="text-2xl font-extrabold mb-8 p-2 border-b border-blue-700">
        Painel - APA
      </div>
      
      
      <nav className="flex-1">
        <ul>
          
          {(profile === "admin" || profile === "ProfissionaldeSaude") && (
            <>
              
            
              {profile === "admin" && (
                <>
                  <NavItem to="/" label="Painel Admin" />
                  <NavItem to="/Instituicoes/ubs" label="Cadastrar Posto de Saúde (PSF)" />
                  <NavItem to="/CadastroProfissional" label="Cadastro de Profissional de Saúde" />
                  <NavItem to="/Especialidades" label="Especialidades Médicas" />
                </>
              )}
              
              {profile === "ProfissionaldeSaude" && (
                <>
                  <NavItem to="/ProfissionaldeSaude" label="Painel do Profissional" />
                  <NavItem to="/CadastrarPacientes" label="Cadastrar Pacientes" />
                  <NavItem to="/FichasAtivas" label="Visualizar Fichas Ativas" />
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

     
      <div className="mt-auto pt-4 border-t border-blue-700 text-xs">
        <p className="mb-1 text-gray-200">Perfil: <span className='capitalize font-bold'>{profile || 'Convidado'}</span></p>
        <p className='text-gray-400'>&copy; {new Date().getFullYear()} APA</p>
      </div>
    </aside>
  );
}


export default Sidebar;