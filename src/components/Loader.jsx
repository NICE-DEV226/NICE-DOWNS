import { motion } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';

const Loader = ({ message = "Traitement en cours..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Animation principale */}
      <div className="relative mb-6">
        {/* Cercle extérieur qui tourne */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full"
        />
        
        {/* Icône centrale qui pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Download className="h-6 w-6 text-blue-600" />
        </motion.div>
      </div>

      {/* Message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-700 text-center mb-4 font-medium"
      >
        {message}
      </motion.p>

      {/* Points animés */}
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="w-2 h-2 bg-blue-600 rounded-full"
          />
        ))}
      </div>

      {/* Barre de progression simulée */}
      <div className="w-64 h-1 bg-gray-200 rounded-full mt-6 overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
        />
      </div>
    </div>
  );
};

export default Loader;