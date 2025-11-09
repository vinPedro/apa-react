
'use client'; 

import Link from 'next/link';

import { usePathname } from 'next/navigation'; 


export default function NavItem({ to, label }) {
  

  const pathname = usePathname();
  

  const isActive = pathname === to; 

  
  const baseClasses = "block py-2 px-4 rounded transition duration-150 text-base font-medium flex items-center";
  
 
  const activeClasses = isActive
    ? "bg-blue-700 text-white shadow-md"           
    : "hover:bg-blue-800 text-gray-200";           

  return (
    <li className="mb-2">
      
      <Link href={to} className={`${baseClasses} ${activeClasses}`}>
      
        <span className="ml-3">{label}</span>
      </Link>
    </li>
  );
}