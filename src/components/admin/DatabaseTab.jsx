import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  HardDrive, 
  Trash2, 
  Download, 
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Settings,
  Zap
} from 'lucide-react';

const DatabaseTab = () => {
  const [dbStats, setDbStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    loadDatabaseStats();
  }, []);

  const loadDatabaseStats = () => {
    setLoading(true);
    // Simuler le chargement des stats de la DB
    setTimeout(() => {
      setDbStats({
        size: '2.4 MB',
        tables: [
          { name: 'error_reports', rows: 156, size: '1.2 MB' },
          { name: 'admins', rows: 2, size: '8 KB' },
          { name: 'admin_sessions', rows: 12, size: '24 KB' },
          { name: 'stats', rows: 84, size: '156 KB' }
        ],
        lastBackup: '2025-01-17T08:00:00Z',
        lastOptimization: '2025-01-16T02:00:00Z',
        performance: {
          avgQueryTime: '2.3ms',
          slowQueries: 0,
          connections: 1,
          uptime: '2 jours 14h'
        }
      });
      setLoading(false);
    }, 1000);
  };

  const optimizeDatabase = async () => {
    setIsOptimizing(true);
    // Simuler l'optimisation
    setTimeout(() => {
      setIsOptimizing(false);
      alert('Base de données optimisée avec succès !');
      loadDatabaseStats();
    }, 3000);
  };

  const exportDatabase = () => {
    // Simuler l'export
    const blob = new Blob(['-- Export de la base de données NICE-Downs\n-- ' + new Date().toISOString()], 
      { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nice-downs-backup-${new Date().toISOString().split('T')[0]}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearOldData = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer les données anciennes (> 30 jours) ?')) {
      alert('Données anciennes supprimées avec succès !');
      loadDatabaseStats();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Base de données</h3>
          <p className="text-gray-400 text-sm">Maintenance et optimisation SQLite</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={loadDatabaseStats}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
          
          <button
            onClick={optimizeDatabase}
            disabled={isOptimizing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-white transition-colors"
          >
            <Zap className="h-4 w-4" />
            {isOptimizing ? 'Optimisation...' : 'Optimiser'}
          </button>
        </div>
      </div>

      {/* Database Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Taille totale',
            value: dbStats.size,
            icon: HardDrive,
            color: 'blue'
          },
          {
            title: 'Tables',
            value: dbStats.tables.length,
            icon: Database,
            color: 'green'
          },
          {
            title: 'Temps de requête moyen',
            value: dbStats.performance.avgQueryTime,
            icon: Activity,
            color: 'purple'
          },
          {
            title: 'Uptime',
            value: dbStats.performance.uptime,
            icon: CheckCircle,
            color: 'yellow'
          }
        ].map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'from-blue-500 to-blue-600',
            green: 'from-green-500 to-green-600',
            purple: 'from-purple-500 to-purple-600',
            yellow: 'from-yellow-500 to-yellow-600'
          };

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[stat.color]} rounded-xl flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
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

      {/* Tables Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
      >
        <h4 className="text-lg font-bold text-white mb-6">Tables de la base de données</h4>
        
        <div className="space-y-4">
          {dbStats.tables.map((table, index) => (
            <div key={table.name} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Database className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h5 className="text-white font-medium">{table.name}</h5>
                  <p className="text-gray-400 text-sm">{table.rows} enregistrements</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-white font-medium">{table.size}</p>
                <p className="text-gray-400 text-sm">Taille</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
      >
        <h4 className="text-lg font-bold text-white mb-6">Performances</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{dbStats.performance.avgQueryTime}</p>
            <p className="text-gray-400 text-sm">Temps de requête moyen</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{dbStats.performance.slowQueries}</p>
            <p className="text-gray-400 text-sm">Requêtes lentes</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Settings className="h-8 w-8 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">{dbStats.performance.connections}</p>
            <p className="text-gray-400 text-sm">Connexions actives</p>
          </div>
        </div>
      </motion.div>

      {/* Maintenance Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
      >
        <h4 className="text-lg font-bold text-white mb-6">Actions de maintenance</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={exportDatabase}
            className="flex items-center gap-3 p-4 bg-blue-600/20 border border-blue-400/30 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-colors"
          >
            <Download className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">Exporter la base</p>
              <p className="text-sm opacity-70">Créer une sauvegarde SQL</p>
            </div>
          </button>
          
          <button
            className="flex items-center gap-3 p-4 bg-green-600/20 border border-green-400/30 rounded-lg text-green-300 hover:bg-green-600/30 transition-colors"
          >
            <Upload className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">Importer des données</p>
              <p className="text-sm opacity-70">Restaurer depuis un fichier</p>
            </div>
          </button>
          
          <button
            onClick={clearOldData}
            className="flex items-center gap-3 p-4 bg-yellow-600/20 border border-yellow-400/30 rounded-lg text-yellow-300 hover:bg-yellow-600/30 transition-colors"
          >
            <Trash2 className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">Nettoyer les anciennes données</p>
              <p className="text-sm opacity-70">Supprimer les données 30 jours</p>
            </div>
          </button>
          
          <button
            onClick={optimizeDatabase}
            disabled={isOptimizing}
            className="flex items-center gap-3 p-4 bg-purple-600/20 border border-purple-400/30 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-colors disabled:opacity-50"
          >
            <Zap className="h-5 w-5" />
            <div className="text-left">
              <p className="font-medium">Optimiser la base</p>
              <p className="text-sm opacity-70">VACUUM et réindexation</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Backup Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
      >
        <h4 className="text-lg font-bold text-white mb-4">Informations de sauvegarde</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">Dernière sauvegarde</p>
            <p className="text-white font-medium">
              {new Date(dbStats.lastBackup).toLocaleString('fr-FR')}
            </p>
          </div>
          
          <div>
            <p className="text-gray-400 text-sm mb-1">Dernière optimisation</p>
            <p className="text-white font-medium">
              {new Date(dbStats.lastOptimization).toLocaleString('fr-FR')}
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-blue-400" />
            <p className="text-blue-300 text-sm">
              Les sauvegardes automatiques sont effectuées quotidiennement à 2h00
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DatabaseTab;