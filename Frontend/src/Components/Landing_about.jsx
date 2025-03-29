import { Card, CardContent } from "./ui/Card";
import { FaHeartbeat, FaRobot, FaClock, FaHospital } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 min-h-screen p-6 sm:p-12 text-white flex flex-col justify-center items-center">
      <motion.h1 
        className="text-3xl sm:text-5xl font-extrabold text-center mb-6 sm:mb-10 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        About Us
      </motion.h1>
      
      <motion.p 
        className="text-base sm:text-lg text-center max-w-xl sm:max-w-3xl mx-auto mb-8 sm:mb-12 text-gray-100 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Our AI-driven healthcare platform revolutionizes patient care, offering seamless medical assistance, hospital management, and emergency services through intelligent features.
      </motion.p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 max-w-lg sm:max-w-3xl mx-auto justify-center items-center">
        {[  
          { icon: <FaRobot className="text-blue-300 text-6xl" />, title: "AI Chatbot Assistance", description: "Instant medical guidance and reliable healthcare suggestions at your fingertips." },
          { icon: <FaClock className="text-green-300 text-6xl" />, title: "Medicine Reminders", description: "Stay on track with smart medication reminders tailored to your needs." },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Card className="bg-white/20 backdrop-blur-md shadow-2xl p-6 rounded-xl flex flex-col items-center text-center hover:bg-white/30 transition duration-300 w-full sm:w-72">
              {item.icon}
              <h2 className="text-xl sm:text-2xl font-semibold mt-4 text-white drop-shadow-sm">{item.title}</h2>
              <p className="text-gray-100 mt-3 leading-relaxed text-sm sm:text-base">{item.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-12 sm:mt-16 text-center max-w-xl sm:max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold drop-shadow-lg">Why Choose Us?</h2>
        <p className="text-base sm:text-lg text-gray-100 mt-4 leading-relaxed">
          By integrating AI with healthcare, we provide an intelligent, seamless, and accessible medical experience. From automated prescriptions to intelligent hospital suggestions, our platform ensures a stress-free journey for both patients and healthcare professionals.
        </p>
      </motion.div>
    </div>
  );
}