// import React, { useState } from 'react';
// import { User, Settings, LogOut, ChevronDown, Notebook } from 'lucide-react';
// import Link from 'next/link';
// import Image from 'next/image';
// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="w-full bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 py-2">
//         <div className="flex items-center justify-between">
//           {/* Logo Section - Hidden on mobile */}
//           <div className="hidden md:block">
           
//               <Link href='/'>
//                 <Image
//                   src="/logo_lex.png"
//                   alt="Lex Genie"
//                   width={150}
//                   height={100}
//                   className="h-10 w-auto object-contain"
//                 />
//               </Link>
       

//           </div>

//           {/* Profile Section */}
//           <div className="relative ml-auto">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg"
//             >
//               <div className="flex flex-col items-end">
//                 <span className="font-medium text-gray-900">Thomas Anree</span>
//                 {/* <span className="text-sm text-gray-500">UX Designer</span> */}
//               </div>
//               <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
//                 <Image
//                   src="/user-01.png"
//                   alt="Profile"
//                   width={150}
//                   height={100}
//                   className="h-full w-full object-cover"
//                 />
//               </div>
//               <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//             </button>

//             {/* Dropdown Menu */}
//             {isOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
//                 <button className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50">
//                   <User className="w-5 h-5 text-gray-500" />
//                   <span className="text-gray-700"> <Link href="/profile"> My Profile</Link></span>
//                 </button>
//                 <button className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50">
//                   <Notebook className="w-5 h-5 text-gray-500" />
//                   <span className="text-gray-700">My Contacts</span>
//                 </button>
//                 <button className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50">
//                   <Settings className="w-5 h-5 text-gray-500" />
//                   <span className="text-gray-700">Account Settings</span>
//                 </button>
//                 <div className="border-t border-gray-100 my-1"></div>
//                 <button className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50">
//                   <LogOut className="w-5 h-5 text-gray-500" />
//                   <span className="text-gray-700">Log Out</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;



import React, { useState } from 'react';
import { Bell, Calendar, ChevronLeft, ChevronRight, Search, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { removeToken } from '@/lib/auth';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    removeToken(); // This will remove both localStorage token and cookie
    router.push('/login');
  };

  return (
    <div className="w-full bg-purple-900 text-white">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation Section */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center">
                <span className="text-white font-bold">feature</span>
                <span className="text-white">flow</span>
              </div>
            </Link>

            {/* Navigation Buttons */}
            <div className="flex items-center ml-4 space-x-2">
              <button className="p-2 text-white rounded-lg hover:bg-purple-800">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 text-white rounded-lg hover:bg-purple-800">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-purple-800 text-white rounded-lg py-2 px-4 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Search className="h-5 w-5 text-gray-300" />
              </div>
            </div>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-white rounded-lg hover:bg-purple-800">
              <Bell className="w-5 h-5" />
            </button>
            
            {/* Calendar */}
            <button className="p-2 text-white rounded-lg hover:bg-purple-800">
              <Calendar className="w-5 h-5" />
            </button>
            
            {/* New Button */}
            <button className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg">
              New
            </button>
            
            {/* User Profile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center hover:bg-purple-800 p-2 rounded-lg"
            >
              <div className="h-8 w-8 rounded-full bg-white text-purple-900 overflow-hidden flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
            </button>

            {/* Dropdown Menu (kept from original) */}
            {isOpen && (
              <div className="absolute right-4 top-14 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                <Link href="/profile" className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">My Profile</span>
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-50"
                >
                  <span className="text-gray-700">Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;