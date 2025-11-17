import { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children, activeTab, setActiveTab, onLogout, admin }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'}}>
      {/* Sidebar */}
      <AdminSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        admin={admin}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <motion.div
        className={`transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-72'
        }`}
        layout
      >
        {/* Top Bar */}
        <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white capitalize">
                {activeTab === 'dashboard' && 'Tableau de bord'}
                {activeTab === 'reports' && 'Gestion des rapports'}
                {activeTab === 'ratings' && 'Notations utilisateurs'}
                {activeTab === 'stats' && 'Statistiques détaillées'}
                {activeTab === 'users' && 'Gestion des utilisateurs'}
                {activeTab === 'database' && 'Base de données'}
                {activeTab === 'settings' && 'Paramètres système'}
              </h2>
              <p className="text-gray-400 text-sm">
                {activeTab === 'dashboard' && 'Vue d\'ensemble de l\'activité'}
                {activeTab === 'reports' && 'Suivi et résolution des erreurs'}
                {activeTab === 'ratings' && 'Avis et évaluations des utilisateurs'}
                {activeTab === 'stats' && 'Analyses et métriques avancées'}
                {activeTab === 'users' && 'Administration des comptes'}
                {activeTab === 'database' && 'Maintenance et optimisation'}
                {activeTab === 'settings' && 'Configuration de l\'application'}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white text-sm font-medium">
                  {new Date().toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-gray-400 text-xs">
                  {new Date().toLocaleTimeString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default AdminLayout;