
'use client'; 


import Sidebar from "../navbar/Sidebar"; 



function DashboardLayout({ children }) {
    
  
    
  return (
    
    <div className="flex min-h-screen w-full">

      
      
      <Sidebar />
      
     
      <main className="flex-1 p-8 bg-gray-100">

        {children} 
      </main>
      
      
    </div>
  );
}

export default DashboardLayout;