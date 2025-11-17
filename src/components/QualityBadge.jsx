import { motion } from 'framer-motion';
import { Zap, Shield, Star } from 'lucide-react';

const QualityBadge = ({ quality, size }) => {
  if (!quality) return null;

  const getQualityConfig = (quality) => {
    const q = quality.toLowerCase();
    
    if (q.includes('1080') || q.includes('hd')) {
      return {
        icon: Star,
        color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        label: 'HD'
      };
    } else if (q.includes('720')) {
      return {
        icon: Shield,
        color: 'bg-green-500/20 text-green-400 border-green-500/30',
        label: 'HD'
      };
    } else if (q.includes('480')) {
      return {
        icon: Zap,
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        label: 'SD'
      };
    } else {
      return {
        icon: Zap,
        color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        label: quality
      };
    }
  };

  const config = getQualityConfig(quality);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
    >
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
      {size && <span className="opacity-75">• {size}</span>}
    </motion.div>
  );
};

export default QualityBadge;