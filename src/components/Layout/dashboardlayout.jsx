
'use client'; 


import Sidebar from "../navbar/Sidebar"; 
import NavItem from "../navbar/SidebarItem";


function DashboardLayout({ children }) {
    
  
    
  return (
    
    <div className="flex min-h-screen">
      
      
      <Sidebar />
      
     
      <main className="flex-1 p-8 bg-gray-50">
        {children} 
      </main>
      
      
    </div>
  );
}

export default DashboardLayout;