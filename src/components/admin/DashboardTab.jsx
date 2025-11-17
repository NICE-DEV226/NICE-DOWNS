import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Activity,
  Users,
  Server,
  Zap,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const DashboardTab = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const quickStats = [
    {
      title: 'Total des erreurs',
      value: stats?.total || 0,
      icon: Activity,
      color: 'purple',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Nouveaux rapports',
      value: stats?.nouveaux || 0,
      icon: AlertTriangle,
      color: 'red',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'En cours de traitement',
      value: stats?.enCours || 0,
      icon: Clock,
      color: 'yellow',
      change: '-8%',
      trend: 'down'
    },
    {
      title: 'Résolus aujourd\'hui',
      value: stats?.resolus || 0,
      icon: CheckCircle,
      color: 'green',
      change: '+15%',
      trend: 'up'
    }
  ];

  const systemStats = [
    {
      title: 'Serveur API',
      status: 'Opérationnel',
      icon: Server,
      color: 'green',
      uptime: '99.9%'
    },
    {
      title: 'Base de données',
      status: 'Optimale',
      icon: Activity,
      color: 'green',
      uptime: '100%'
    },
    {
      title: 'Performances',
      status: 'Excellentes',
      icon: Zap,
      color: 'green',
      uptime: '98.5%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            purple: 'from-purple-500 to-purple-600',
            red: 'from-red-500 to-red-600',
            yellow: 'from-yellow-500 to-yellow-600',
            green: 'from-green-500 to-green-600'
          };

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[stat.color]} rounded-xl flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.title}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6">Erreurs par plateforme</h3>
          <div className="space-y-4">
            {stats?.plateformes && Object.entries(stats.plateformes).map(([platform, count]) => {
              const percentage = (count / Math.max(...Object.values(stats.plateformes))) * 100;
              return (
                <div key={platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">{platform}</span>
                    <span className="text-white font-bold">{count}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Weekly Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6">Évolution cette semaine</h3>
          <div className="space-y-3">
            {stats?.derniereSemaine?.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">
                  {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-20 bg-gray-700 rounded-full h-1.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.erreurs / 30) * 100}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1.5 rounded-full"
                    />
                  </div>
                  <span className="text-white font-medium w-6 text-right">{day.erreurs}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-6">État du système</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {systemStats.map((system, index) => {
            const Icon = system.icon;
            return (
              <div key={system.title} className="flex items-center gap-4">
                <div className={`w-10 h-10 bg-${system.color}-500/20 rounded-xl flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 text-${system.color}-400`} />
                </div>
                <div>
                  <p className="text-white font-medium">{system.title}</p>
                  <p className={`text-${system.color}-400 text-sm`}>{system.status}</p>
                  <p className="text-gray-400 text-xs">Uptime: {system.uptime}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold text-white mb-6">Activité récente</h3>
        <div className="space-y-4">
          {[
            { action: 'Nouveau rapport d\'erreur', platform: 'TikTok', time: 'Il y a 2 minutes', type: 'error' },
            { action: 'Rapport résolu', platform: 'Instagram', time: 'Il y a 15 minutes', type: 'success' },
            { action: 'Mise à jour système', platform: 'API', time: 'Il y a 1 heure', type: 'info' },
            { action: 'Nouveau rapport d\'erreur', platform: 'Facebook', time: 'Il y a 2 heures', type: 'error' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'error' ? 'bg-red-400' :
                activity.type === 'success' ? 'bg-green-400' : 'bg-blue-400'
              }`}></div>
              <div className="flex-1">
                <p className="text-white text-sm">{activity.action}</p>
                <p className="text-gray-400 text-xs">{activity.platform} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardTab;