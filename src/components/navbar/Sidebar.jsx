'use client';

import { useAuth } from "../../AuthContext";
import NavItem from "./SidebarItem";
import SidebarGroup from "./SidebarGroup";

function Sidebar() {
  const { profile, logout } = useAuth();

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
                  <NavItem to="/admin" label="PAINEL DO ADMIN" />

                  <SidebarGroup title="PROFISSIONAL DE SAÚDE">
                    <NavItem to="/CadastroProfissional" label="Cadastrar Profissional" />
                    <NavItem to="/PesquisaProfissional" label="Buscar Profissionais" />
                  </SidebarGroup>

                  <SidebarGroup title="PACIENTES">
                    <NavItem to="/CadastrarPacientes" label="Cadastrar Paciente" />
                    <NavItem to="/PesquisaPaciente" label="Buscar Pacientes" />
                    <NavItem to="/FiltroStatusPaciente" label="Fila / Status" />
                  </SidebarGroup>

                  <SidebarGroup title="PRONTUÁRIOS">
                    <NavItem to="/FiltroProntuario" label="Buscar Histórico" />
                  </SidebarGroup>

                  <SidebarGroup title="GERENCIAR UBS">
                    <NavItem to="/Instituicoes/ubs" label="Posto de Saúde (PSF)" />
                    <NavItem to="/onboarding" label="TV / Painel" />
                  </SidebarGroup>
                </>
              )}

              {profile === "ProfissionaldeSaude" && (
                <>
                  <NavItem to="/ProfissionalDeSaude" label="Início" />
                  
                  {/* Link da Agenda Adicionado */}
                  <NavItem to="/ProfissionalDeSaude/agenda" label="Minha Agenda" />
                  
                  {/* Corrigido: Aponta para a Fila que tem as abas de Recepção/Triagem */}
                  <NavItem to="/FiltroStatusPaciente" label="Fila de Atendimento" />
                  
                  {/* Corrigido: Aponta para a busca de pacientes/histórico */}
                  <NavItem to="/PesquisaPaciente" label="Encontrar Pacientes" />
                  
                  {/* Corrigido: Aponta para a página correta de Filtro/Visualização */}
                  <NavItem to="/FiltroProntuario" label="Histórico Prontuários" />
                </>
              )}
            </>
          )}

          {profile === "Paciente" && (
            <>
              <NavItem to="/Paciente" label="Painel do Paciente" />
              <NavItem to="/Paciente/fila" label="Fila" />
            </>
          )}

          {!profile && <li className="text-gray-400 text-sm p-2">Faça login para ver o menu.</li>}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-blue-700">
        <p className="mb-2 text-xs text-gray-200">
          Perfil: <span className='capitalize font-bold'>{profile || 'Convidado'}</span>
        </p>

        <button
          onClick={logout}
          className="w-full py-2 px-4 rounded text-base font-medium bg-blue-800 hover:bg-blue-700 text-white transition duration-150"
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