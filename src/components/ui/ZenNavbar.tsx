// 'use client';

// import { motion } from 'framer-motion';

// export default function ZenNavbar() {
//   return (
//     <motion.nav
//       initial={{ y: -100, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.8, delay: 0.5 }}
//       className="fixed top-0 left-0 right-0 z-40 p-4 backdrop-blur-md bg-white/5 border-b border-white/10"
//     >
//       <div className="max-w-7xl mx-auto flex items-center justify-between">
//         {/* Logo */}
//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           className="font-bold text-xl text-white"
//         >
//           ZenFlow
//         </motion.div>
        
//         {/* Navigation Links */}
//         <div className="hidden md:flex items-center space-x-8">
//           <motion.a
//             href="#features"
//             whileHover={{ y: -2 }}
//             className="text-gray-300 hover:text-white transition-colors duration-200"
//           >
//             Features
//           </motion.a>
//           <motion.a
//             href="#about"
//             whileHover={{ y: -2 }}
//             className="text-gray-300 hover:text-white transition-colors duration-200"
//           >
//             About
//           </motion.a>
//           <motion.a
//             href="#contact"
//             whileHover={{ y: -2 }}
//             className="text-gray-300 hover:text-white transition-colors duration-200"
//           >
//             Contact
//           </motion.a>
//         </div>
        
//         {/* Mobile Menu Button */}
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="md:hidden text-white"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 6h16M4 12h16M4 18h16"
//             />
//           </svg>
//         </motion.button>
//       </div>
//     </motion.nav>
//   );
// }
