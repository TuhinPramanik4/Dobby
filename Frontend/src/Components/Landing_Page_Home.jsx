import React from "react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

function LandingPageHome() {
  const handleLogin = () => {
    window.open("https://dobby-fbxy.onrender.com/auth/google", "_self");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <div className="flex flex-col-reverse md:flex-row w-full max-w-5xl h-full md:h-[90%] shadow-2xl backdrop-blur-md bg-white rounded-3xl overflow-hidden gap-8 md:gap-0">
        {/* Right Section (On top in mobile) */}
        <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center relative p-10 md:p-0 bg-blue-700 text-white">
        <motion.div 
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1 }}
  className="absolute w-40 h-40 md:w-72 md:h-72 bg-white rounded-full shadow-2xl overflow-hidden flex items-center justify-center"
>

</motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1 }}
            className="text-3xl md:text-5xl font-bold drop-shadow-lg z-10 text-center"
          >
            {/* Your Healthcare Companion */}
            <img src="https://pbs.twimg.com/media/GmeDJKga8AIvmBg?format=png&name=360x360" alt="Doctor" className="w-full h-full object-cover" />
          </motion.h2>
        </div>

        {/* Left Section */}
        <div className="w-full md:w-1/2 h-full bg-zinc-100 flex flex-col items-center justify-center p-10 md:p-12 text-black">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold mb-6 text-center"
          >
            Welcome Back
          </motion.h1>
          <p className="text-lg md:text-xl text-center text-gray-600 mb-8">
            Sign in to access your personalized healthcare dashboard.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin} 
            className="flex items-center gap-4 bg-white text-blue-700 px-6 md:px-10 py-3 md:py-4 rounded-xl shadow-xl hover:bg-blue-700 hover:text-white transition duration-300 border border-blue-700"
          >
            <FcGoogle className="text-2xl md:text-3xl" /> Sign in with Google
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default LandingPageHome;