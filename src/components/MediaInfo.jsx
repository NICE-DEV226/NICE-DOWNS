import { motion } from 'framer-motion';
import { Eye, Calendar, Play, User } from 'lucide-react';

const MediaInfo = ({ previewData }) => {
  if (!previewData) return null;

  const infoItems = [];

  // Vues (YouTube principalement)
  if (previewData.views) {
    infoItems.push({
      icon: Eye,
      label: 'Vues',
      value: previewData.views,
      color: 'text-blue-400'
    });
  }

  // Date de publication
  if (previewData.publishDate) {
    infoItems.push({
      icon: Calendar,
      label: 'Publié',
      value: previewData.publishDate,
      color: 'text-green-400'
    });
  }

  // Durée
  if (previewData.duration) {
    infoItems.push({
      icon: Play,
      label: 'Durée',
      value: previewData.duration,
      color: 'text-purple-400'
    });
  }

  // Auteur/Chaîne
  if (previewData.author) {
    infoItems.push({
      icon: User,
      label: 'Auteur',
      value: previewData.author,
      color: 'text-yellow-400'
    });
  }

  if (infoItems.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/5 rounded-xl p-4 mt-4"
    >
      <h3 className="text-white font-medium mb-3 text-sm">Informations du média</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {infoItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className={`p-2 rounded-lg bg-white/10 ${item.color}`}>
              <item.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-white/60 text-xs">{item.label}</p>
              <p className="text-white text-sm font-medium">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MediaInfo;