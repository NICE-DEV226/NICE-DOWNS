import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  Shield,
  Users,
  Database,
  Activity,
  Wrench
} from 'lucide-react';
import systemService from '../../services/systemService';

// Composant pour l'indicateur de maintenance
const MaintenanceIndicator = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    setIsMaintenanceMode(systemService.isMaintenanceMode());
    
    const unsubscribe = systemService.onSettingsChange((settings) => {
      setIsMaintenanceMode(settings.maintenanceMode);
    });

    return unsubscribe;
  }, []);

  if (!isMaintenanceMode) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-yellow-400 mb-2 p-2 bg-yellow-500/10 rounded-lg border border-yellow-400/30">
      <Wrench className="h-3 w-3 animate-pulse" />
      <span>Mode maintenance</span>
    </div>
  );
};

const AdminSidebar = ({ activeTab, setActiveTab, onLogout, admin, isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Vue d\'ensemble'
    },
    {
      id: 'reports',
      label: 'Rapports',
      icon: AlertTriangle,
      description: 'Gestion des erreurs'
    },
    {
      id: 'ratings',
      label: 'Notations',
      icon: Activity,
      description: 'Avis utilisateurs'
    },
    {
      id: 'stats',
      label: 'Statistiques',
      icon: BarChart3,
      description: 'Analyses détaillées'
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: Users,
      description: 'Gestion des comptes'
    },
    {
      id: 'database',
      label: 'Base de données',
      icon: Database,
      description: 'Maintenance DB'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration'
    }
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={`fixed left-0 top-0 h-full bg-gray-900/95 backdrop-blur-sm border-r border-gray-700 z-50 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">NICE-Admin</h1>
                <p className="text-gray-400 text-xs">Dashboard</p>
              </div>
            </motion.div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Admin Info */}
      {!isCollapsed && admin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 p-4 border-b border-gray-700"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {admin.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{admin.name}</p>
              <p className="text-gray-400 text-xs truncate">{admin.email}</p>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full" title="En ligne"></div>
          </div>
        </motion.div>
      )}

      {/* Navigation - Zone scrollable */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4">
          {!isCollapsed && (
            <div className="text-xs text-gray-500 mb-3 px-2">
              {menuItems.length} onglets disponibles
            </div>
          )}
          <div className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    console.log(`Clic sur l'onglet: ${item.id}`); // Debug
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 text-white' 
                      : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-purple-400' : 'group-hover:text-purple-400'}`} />
                  
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs opacity-70">{item.description}</p>
                    </div>
                  )}
                  
                  {isActive && !isCollapsed && (
                    <motion.div
                      layoutId="activeTab"
                      className="w-1 h-6 bg-purple-400 rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Status */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-shrink-0 p-4 border-t border-gray-700"
        >
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <Activity className="h-4 w-4 text-green-400" />
            <span>Système opérationnel</span>
          </div>
          {/* Indicateur de maintenance */}
          <MaintenanceIndicator />
          <div className="text-xs text-gray-500">
            <p>🇧🇫 NICE-DEV © 2025</p>
            <p>Burkina Faso</p>
          </div>
        </motion.div>
      )}

      {/* Logout */}
      <div className="flex-shrink-0 p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Déconnexion' : ''}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="font-medium">Déconnexion</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;