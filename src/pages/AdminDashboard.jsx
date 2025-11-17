import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorReports, getErrorStats, updateErrorReportStatus, deleteErrorReport, deleteErrorReports, verifyAdminToken, logoutAdmin } from '../services/errorReportService';
import AdminLayout from '../components/admin/AdminLayout';
import DashboardTab from '../components/admin/DashboardTab';
import ReportsTab from '../components/admin/ReportsTab';
import RatingsTab from '../components/admin/RatingsTab';
import StatsTab from '../components/admin/StatsTab';
import UsersTab from '../components/admin/UsersTab';
import DatabaseTab from '../components/admin/DatabaseTab';
import SettingsTab from '../components/admin/SettingsTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const result = await verifyAdminToken();
      if (result.success) {
        setAdmin(result.admin);
        setIsAuthenticated(true);
        loadData();
      } else {
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      navigate('/admin/login');
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportsResult, statsResult] = await Promise.all([
        getErrorReports(),
        getErrorStats()
      ]);

      if (reportsResult.success) {
        setReports(reportsResult.reports || []);
      }
      if (statsResult.success) {
        setStats(statsResult.stats);
      }
      
      console.log('✅ Données chargées depuis la base de données');
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reportUuid, newStatus) => {
    try {
      const result = await updateErrorReportStatus(reportUuid, newStatus);
      if (result.success) {
        // Recharger les données
        loadData();
      } else {
        alert('❌ Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('❌ Erreur lors de la mise à jour du statut');
    }
  };

  const handleDeleteReport = async (reportUuid) => {
    try {
      const result = await deleteErrorReport(reportUuid);
      if (result.success) {
        // Recharger les données
        loadData();
        return true;
      } else {
        alert('❌ Erreur lors de la suppression');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('❌ Erreur lors de la suppression');
      return false;
    }
  };

  const handleDeleteReports = async (reportUuids) => {
    try {
      const result = await deleteErrorReports(reportUuids);
      if (result.success) {
        // Recharger les données
        loadData();
        return result;
      } else {
        alert('❌ Aucun rapport supprimé');
        return result;
      }
    } catch (error) {
      console.error('Erreur lors de la suppression multiple:', error);
      alert('❌ Erreur lors de la suppression');
      return { success: false, deletedCount: 0 };
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      navigate('/admin/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      navigate('/admin/login');
    }
  };



  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'}}>
        <div className="w-8 h-8 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab stats={stats} loading={loading} />;
      
      case 'reports':
        return (
          <ReportsTab 
            reports={reports} 
            loading={loading} 
            onStatusChange={handleStatusChange}
            onDeleteReport={handleDeleteReport}
            onDeleteReports={handleDeleteReports}
            onRefresh={loadData}
          />
        );
      
      case 'ratings':
        return <RatingsTab />;
      
      case 'stats':
        return <StatsTab stats={stats} loading={loading} />;
      
      case 'users':
        return <UsersTab />;
      
      case 'database':
        return <DatabaseTab />;
      
      case 'settings':
        return <SettingsTab />;
      
      case 'test':
        return (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Tests des fonctionnalités</h3>
              
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => {
                    const testReport = {
                      url: 'https://test.com/video/123',
                      platform: 'Test Platform',
                      error_message: 'Erreur de test',
                      user_description: 'Ceci est un test'
                    };
                    reportsService.addReport(testReport);
                    loadData();
                    alert('✅ Rapport de test ajouté');
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                >
                  Ajouter rapport test
                </button>
                
                <button
                  onClick={() => {
                    reportsService.resetToTestData();
                    loadData();
                    alert('✅ Données réinitialisées');
                  }}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white transition-colors"
                >
                  Réinitialiser données
                </button>
                
                <button
                  onClick={() => {
                    const stats = reportsService.getStats();
                    console.log('📊 Statistiques:', stats);
                    alert(`📊 ${stats.total} rapports total`);
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
                >
                  Voir stats
                </button>
              </div>
              
              <div className="text-sm text-gray-400">
                <p>• Les rapports sont maintenant persistants dans localStorage</p>
                <p>• Les changements de statut sont sauvegardés</p>
                <p>• Les suppressions sont définitives</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return <DashboardTab stats={stats} loading={loading} />;
    }
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
      admin={admin}
    >
      {renderTabContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;