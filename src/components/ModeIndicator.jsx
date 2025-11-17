import { motion } from 'framer-motion';
import { Zap, TestTube, Info } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const ModeIndicator = () => {
  const { useRealAPI, setUseRealAPI } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${
        useRealAPI 
          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      }`}
    >
      {useRealAPI ? (
        <Zap className="h-4 w-4" />
      ) : (
        <TestTube className="h-4 w-4" />
      )}
      
      <span>
        Mode {useRealAPI ? 'API' : 'Simulation'}
      </span>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setUseRealAPI(!useRealAPI)}
        className="p-1 hover:bg-white/10 rounded transition-colors"
        title={`Basculer vers le mode ${useRealAPI ? 'Simulation' : 'API'}`}
      >
        <Info className="h-3 w-3" />
      </motion.button>
    </motion.div>
  );
};

export default ModeIndicator;