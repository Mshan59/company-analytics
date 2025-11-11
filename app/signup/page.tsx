// "use client"
// import React, { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
// import Link from 'next/link';

// const SignupPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e: { preventDefault: () => void; }) => {
//     e.preventDefault();
//     // Handle signup logic here
//   };

//   return (
//     <div className="min-h-screen relative flex items-center justify-center bg-black/10">
//       <div className="relative z-10 w-full max-w-md p-8 rounded-lg backdrop-blur-sm bg-white/20 shadow-xl border border-white/30">
//         <div className="text-center space-y-2 mb-8">
//           <h1 className="text-2xl font-bold ">Feature Flow</h1>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="space-y-2">
//             <label htmlFor="name" className="block text-sm font-medium ">Name</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <User className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 id="name"
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/30 rounded-md 
//                           focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent
//                            placeholder-gray-300 backdrop-blur-sm"
//                 placeholder="Enter your name"
//                 required
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="email" className="block text-sm font-medium ">Email Address</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Mail className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/30 rounded-md 
//                           focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent
//                            placeholder-gray-300 backdrop-blur-sm"
//                 placeholder="Enter your email"
//                 required
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="password" className="block text-sm font-medium ">Password</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Lock className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 id="password"
//                 type={showPassword ? 'text' : 'password'}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="block w-full pl-10 pr-10 py-2 bg-white/10 border border-white/30 rounded-md 
//                           focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent
//                            placeholder-gray-300 backdrop-blur-lg"
//                 placeholder="Enter your password"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//               >
//                 {showPassword ? (
//                   <EyeOff className="h-5 w-5 text-gray-300" />
//                 ) : (
//                   <Eye className="h-5 w-5 text-gray-300" />
//                 )}
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 type="checkbox"
//                 className="h-4 w-4 bg-white/10 border-white/30 rounded focus:ring-2 focus:ring-white/50"
//               />
//               <label htmlFor="remember-me" className="ml-2 block text-sm ">
//                 Remember me
//               </label>
//             </div>
//             <div className="text-sm">
//               <a href="#" className="font-medium  hover:text-gray-200">
//                 Forgot your password?
//               </a>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
//                      text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 
//                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
//           >
//             Sign up
//           </button>
//         </form>

        // <p className="mt-6 text-center text-sm ">
        //   Already have an account?{' '}
        //   <Link href="/login" className="font-medium  hover:text-gray-200">
        //     Sign in
        //   </Link>
        // </p>
//       </div>
//     </div>
//   );
// };

// export default SignupPage;



"use client";
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

//   const handleSubmit = async (e: { preventDefault: () => void; }) => {
//     e.preventDefault();

//     const res = await fetch('/api/auth/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name, email, password }),
//       });
      
//     const data = await res.json();

//     if (res.ok) {
//       alert('Signup successful!');
//       setName('');
//       setEmail('');
//       setPassword('');
//     } else {
//       alert(data.error || 'Signup failed!');
//     }
//   };
const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
  
    const data = await res.json();
  
    if (res.ok) {
      console.log('Signup successful:', data);
    } else {
      console.error('Signup error:', data.error);
    }
  };
  
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black/10">
      <div className="relative z-10 w-full max-w-md p-8 rounded-lg backdrop-blur-sm bg-white/20 shadow-xl border border-white/30">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl font-bold ">Feature Flow</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium ">Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/30 rounded-md 
                          focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent
                           placeholder-gray-300 backdrop-blur-sm"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium ">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/30 rounded-md 
                          focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent
                           placeholder-gray-300 backdrop-blur-sm"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium ">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 bg-white/10 border border-white/30 rounded-md 
                          focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent
                           placeholder-gray-300 backdrop-blur-lg"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-300" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                     text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            Sign up
          </button>
        </form>
        <p className="mt-6 text-center text-sm ">
          Already have an account?{' '}
          <Link href="/login" className="font-medium  hover:text-gray-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;