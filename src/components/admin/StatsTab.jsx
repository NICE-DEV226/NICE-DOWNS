import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

const StatsTab = ({ stats, loading }) => {
  const [period, setPeriod] = useState('7d');
  const [chartType, setChartType] = useState('bar');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Statistiques détaillées</h3>
          <p className="text-gray-400 text-sm">Analyses et métriques avancées</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">3 derniers mois</option>
            <option value="1y">Dernière année</option>
          </select>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors">
            <Download className="h-4 w-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-white">Répartition par plateforme</h4>
            <BarChart3 className="h-5 w-5 text-purple-400" />
          </div>
          
          <div className="space-y-4">
            {stats?.plateformes && Object.entries(stats.plateformes).map(([platform, count]) => {
              const total = Object.values(stats.plateformes).reduce((a, b) => a + b, 0);
              const percentage = ((count / total) * 100).toFixed(1);
              
              return (
                <div key={platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">{platform}</span>
                    <div className="text-right">
                      <span className="text-white font-bold">{count}</span>
                      <span className="text-gray-400 text-sm ml-2">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.3, duration: 1 }}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-white">Statut des rapports</h4>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          
          <div className="space-y-4">
            {[
              { status: 'Nouveaux', count: stats?.nouveaux || 0, color: 'from-red-500 to-red-600' },
              { status: 'En cours', count: stats?.enCours || 0, color: 'from-yellow-500 to-yellow-600' },
              { status: 'Résolus', count: stats?.resolus || 0, color: 'from-green-500 to-green-600' }
            ].map((item, index) => {
              const total = (stats?.nouveaux || 0) + (stats?.enCours || 0) + (stats?.resolus || 0);
              const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
              
              return (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">{item.status}</span>
                    <div className="text-right">
                      <span className="text-white font-bold">{item.count}</span>
                      <span className="text-gray-400 text-sm ml-2">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 1 }}
                      className={`bg-gradient-to-r ${item.color} h-2 rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Weekly Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-bold text-white">Évolution temporelle</h4>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            <span className="text-gray-400 text-sm">Dernière semaine</span>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-4">
          {stats?.derniereSemaine?.map((day, index) => {
            const maxErrors = Math.max(...(stats.derniereSemaine?.map(d => d.erreurs) || [1]));
            const height = (day.erreurs / maxErrors) * 100;
            
            return (
              <div key={day.date} className="text-center">
                <div className="h-32 flex items-end justify-center mb-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg min-h-[4px]"
                  />
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                </div>
                <div className="text-sm font-bold text-white">{day.erreurs}</div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: 'Temps de résolution moyen',
            value: '2.4h',
            change: '-15%',
            trend: 'down',
            color: 'green'
          },
          {
            title: 'Taux de résolution',
            value: '87%',
            change: '+5%',
            trend: 'up',
            color: 'blue'
          },
          {
            title: 'Nouveaux rapports/jour',
            value: '12.3',
            change: '+8%',
            trend: 'up',
            color: 'purple'
          }
        ].map((metric, index) => (
          <div key={metric.title} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-gray-400 text-sm">{metric.title}</h5>
              <span className={`text-xs font-medium ${
                metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {metric.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default StatsTab;