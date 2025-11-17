import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Download, Users, Zap } from 'lucide-react';

const DownloadStats = () => {
  const [stats, setStats] = useState({
    totalDownloads: 1250000,
    activeUsers: 15420,
    successRate: 98.5,
    avgSpeed: 2.3
  });

  // Simulation de mise à jour des stats en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalDownloads: prev.totalDownloads + Math.floor(Math.random() * 5),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        successRate: 98.5 + (Math.random() - 0.5) * 0.5,
        avgSpeed: 2.3 + (Math.random() - 0.5) * 0.3
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const statItems = [
    {
      icon: Download,
      label: 'Téléchargements',
      value: stats.totalDownloads.toLocaleString(),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      icon: Users,
      label: 'Utilisateurs actifs',
      value: stats.activeUsers.toLocaleString(),
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      icon: TrendingUp,
      label: 'Taux de succès',
      value: `${stats.successRate.toFixed(1)}%`,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20'
    },
    {
      icon: Zap,
      label: 'Vitesse moy.',
      value: `${stats.avgSpeed.toFixed(1)}s`,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="card"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          Statistiques en temps réel
        </h3>
        <p className="text-white/60">
          Performance de la plateforme NICE-Downs
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`${item.bgColor} rounded-xl p-4 text-center group hover:scale-105 transition-transform`}
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white/10 mb-3 group-hover:scale-110 transition-transform`}>
              <item.icon className={`h-6 w-6 ${item.color}`} />
            </div>
            
            <motion.div
              key={item.value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`text-2xl font-bold ${item.color} mb-1`}
            >
              {item.value}
            </motion.div>
            
            <p className="text-white/80 text-sm font-medium">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center gap-2 text-white/60 text-sm"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          Mise à jour automatique
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DownloadStats;