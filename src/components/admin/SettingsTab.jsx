import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Globe,
  Mail,
  Bell,
  Palette,
  Server,
  Key,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import systemService from '../../services/systemService';

const SettingsTab = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: 'NICE-Downs',
      siteDescription: 'Téléchargeur de médias sociaux',
      adminEmail: 'admin@nice-downs.com',
      timezone: 'Africa/Ouagadougou',
      language: 'fr'
    },
    security: {
      jwtSecret: 'your-secret-key',
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      requireStrongPasswords: true,
      enableTwoFactor: false
    },
    api: {
      rateLimit: 100,
      rateLimitWindow: 15,
      enableCors: true,
      allowedOrigins: window.location.origin,
      apiVersion: 'v1'
    },
    notifications: {
      emailNotifications: true,
      errorAlerts: true,
      dailyReports: false,
      maintenanceMode: false
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionDays: 30,
      backupLocation: './backups'
    }
  });

  const [loading, setLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Charger les paramètres système au démarrage
  useEffect(() => {
    const loadSettings = () => {
      try {
        // Charger les paramètres système
        const systemSettings = systemService.getAllSettings();
        
        // Charger les autres paramètres depuis localStorage
        const savedSettings = localStorage.getItem('nice_downs_admin_settings');
        let allSettings = settings;
        
        if (savedSettings) {
          allSettings = JSON.parse(savedSettings);
        }
        
        // Fusionner avec les paramètres système
        setSettings({
          ...allSettings,
          notifications: {
            ...allSettings.notifications,
            maintenanceMode: systemSettings.maintenanceMode,
            emailNotifications: systemSettings.emailNotifications,
            errorAlerts: systemSettings.errorAlerts,
            dailyReports: systemSettings.dailyReports
          }
        });
        
        console.log('✅ Paramètres chargés:', allSettings);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des paramètres:', error);
      }
    };
    
    loadSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Sauvegarder tous les paramètres dans localStorage
      localStorage.setItem('nice_downs_admin_settings', JSON.stringify(settings));
      
      // Sauvegarder les paramètres système spécifiques
      const systemSettings = {
        maintenanceMode: settings.notifications.maintenanceMode,
        emailNotifications: settings.notifications.emailNotifications,
        errorAlerts: settings.notifications.errorAlerts,
        dailyReports: settings.notifications.dailyReports
      };
      
      const success = systemService.saveSettings(systemSettings);
      
      setTimeout(() => {
        setLoading(false);
        if (success) {
          alert('✅ Paramètres sauvegardés avec succès !');
          console.log('Paramètres sauvegardés:', settings);
        } else {
          alert('❌ Erreur lors de la sauvegarde des paramètres');
        }
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setLoading(false);
      alert('❌ Erreur lors de la sauvegarde des paramètres');
    }
  };

  const handleInputChange = (section, field, value) => {
    console.log(`Changement: ${section}.${field} = ${value}`); // Debug
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      };
      console.log('Nouveaux paramètres:', newSettings); // Debug
      
      // Sauvegarde automatique pour certains paramètres critiques
      if (section === 'notifications' && field === 'maintenanceMode') {
        systemService.setMaintenanceMode(value);
        // Notification visuelle
        if (value) {
          console.log('🔧 Mode maintenance activé');
        } else {
          console.log('✅ Mode maintenance désactivé');
        }
      }
      
      // Sauvegarde automatique de tous les paramètres (avec délai)
      setTimeout(() => {
        try {
          localStorage.setItem('nice_downs_admin_settings', JSON.stringify(newSettings));
          console.log('💾 Paramètres sauvegardés automatiquement');
        } catch (error) {
          console.error('❌ Erreur sauvegarde auto:', error);
        }
      }, 500);
      
      return newSettings;
    });
  };

  const resetToDefaults = () => {
    if (confirm('Êtes-vous sûr de vouloir restaurer les paramètres par défaut ?')) {
      const defaultSettings = {
        general: {
          siteName: 'NICE-Downs',
          siteDescription: 'Téléchargeur de médias sociaux',
          adminEmail: 'admin@nice-downs.com',
          timezone: 'Africa/Ouagadougou',
          language: 'fr'
        },
        security: {
          jwtSecret: 'your-secret-key',
          sessionTimeout: 24,
          maxLoginAttempts: 5,
          requireStrongPasswords: true,
          enableTwoFactor: false
        },
        api: {
          rateLimit: 100,
          rateLimitWindow: 15,
          enableCors: true,
          allowedOrigins: window.location.origin,
          apiVersion: 'v1'
        },
        notifications: {
          emailNotifications: true,
          errorAlerts: true,
          dailyReports: false,
          maintenanceMode: false
        },
        backup: {
          autoBackup: true,
          backupFrequency: 'daily',
          retentionDays: 30,
          backupLocation: './backups'
        }
      };
      
      setSettings(defaultSettings);
      
      // Réinitialiser aussi les paramètres système
      systemService.resetToDefaults();
      
      // Supprimer les paramètres sauvegardés
      localStorage.removeItem('nice_downs_admin_settings');
      
      alert('✅ Paramètres restaurés aux valeurs par défaut');
    }
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'api', label: 'API', icon: Server },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'backup', label: 'Sauvegarde', icon: RefreshCw }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Nom du site</label>
        <input
          type="text"
          value={settings.general.siteName}
          onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
          rows="3"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Email administrateur</label>
        <input
          type="email"
          value={settings.general.adminEmail}
          onChange={(e) => handleInputChange('general', 'adminEmail', e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Fuseau horaire</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
          >
            <option value="Africa/Ouagadougou">Africa/Ouagadougou</option>
            <option value="Europe/Paris">Europe/Paris</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Langue</label>
          <select
            value={settings.general.language}
            onChange={(e) => handleInputChange('general', 'language', e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Clé secrète JWT</label>
        <div className="relative">
          <input
            type={showSecrets ? 'text' : 'password'}
            value={settings.security.jwtSecret}
            onChange={(e) => handleInputChange('security', 'jwtSecret', e.target.value)}
            className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
          />
          <button
            type="button"
            onClick={() => setShowSecrets(!showSecrets)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Durée de session (heures)</label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tentatives de connexion max</label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.security.requireStrongPasswords}
            onChange={(e) => handleInputChange('security', 'requireStrongPasswords', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <span className="text-white">Exiger des mots de passe forts</span>
        </label>
        
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.security.enableTwoFactor}
            onChange={(e) => handleInputChange('security', 'enableTwoFactor', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <span className="text-white">Activer l'authentification à deux facteurs</span>
        </label>
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Limite de requêtes</label>
          <input
            type="number"
            value={settings.api.rateLimit}
            onChange={(e) => handleInputChange('api', 'rateLimit', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
          />
          <p className="text-gray-400 text-xs mt-1">Requêtes par fenêtre de temps</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Fenêtre de temps (minutes)</label>
          <input
            type="number"
            value={settings.api.rateLimitWindow}
            onChange={(e) => handleInputChange('api', 'rateLimitWindow', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Origines autorisées (CORS)</label>
        <textarea
          value={settings.api.allowedOrigins}
          onChange={(e) => handleInputChange('api', 'allowedOrigins', e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
          rows="3"
          placeholder={`${window.location.origin}, https://your-domain.com`}
        />
        <p className="text-gray-400 text-xs mt-1">Séparez les domaines par des virgules</p>
      </div>
      
      <div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.api.enableCors}
            onChange={(e) => handleInputChange('api', 'enableCors', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <span className="text-white">Activer CORS</span>
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.notifications.emailNotifications}
            onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <span className="text-white">Notifications par email</span>
        </label>
        
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.notifications.errorAlerts}
            onChange={(e) => handleInputChange('notifications', 'errorAlerts', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <span className="text-white">Alertes d'erreur</span>
        </label>
        
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.notifications.dailyReports}
            onChange={(e) => handleInputChange('notifications', 'dailyReports', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <span className="text-white">Rapports quotidiens</span>
        </label>
        
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.notifications.maintenanceMode}
            onChange={(e) => handleInputChange('notifications', 'maintenanceMode', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <span className="text-white">Mode maintenance</span>
        </label>
      </div>
      
      {settings.notifications.maintenanceMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <p className="text-yellow-300 text-sm font-medium">
              Mode maintenance activé
            </p>
          </div>
          <p className="text-yellow-200 text-xs">
            Les utilisateurs voient maintenant la page de maintenance. 
            Seuls les admins peuvent accéder au dashboard.
          </p>
          <div className="mt-3 flex gap-2">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white transition-colors"
            >
              Voir la page maintenance
            </a>
          </div>
        </motion.div>
      )}
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            checked={settings.backup.autoBackup}
            onChange={(e) => handleInputChange('backup', 'autoBackup', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <span className="text-white">Sauvegarde automatique</span>
        </label>
      </div>
      
      {settings.backup.autoBackup && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fréquence</label>
            <select
              value={settings.backup.backupFrequency}
              onChange={(e) => handleInputChange('backup', 'backupFrequency', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
            >
              <option value="hourly">Toutes les heures</option>
              <option value="daily">Quotidienne</option>
              <option value="weekly">Hebdomadaire</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rétention (jours)</label>
            <input
              type="number"
              value={settings.backup.retentionDays}
              onChange={(e) => handleInputChange('backup', 'retentionDays', parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
            />
            <p className="text-gray-400 text-xs mt-1">Nombre de jours de conservation des sauvegardes</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Dossier de sauvegarde</label>
            <input
              type="text"
              value={settings.backup.backupLocation}
              onChange={(e) => handleInputChange('backup', 'backupLocation', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
            />
          </div>
        </>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'security': return renderSecuritySettings();
      case 'api': return renderApiSettings();
      case 'notifications': return renderNotificationSettings();
      case 'backup': return renderBackupSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Paramètres système</h3>
          <p className="text-gray-400 text-sm">Configuration de l'application</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Défaut
          </button>
          
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg text-white transition-colors"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
      >
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SettingsTab;