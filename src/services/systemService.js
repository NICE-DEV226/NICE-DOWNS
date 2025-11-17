// Service pour gérer les paramètres système
class SystemService {
  constructor() {
    this.settings = this.loadSettings();
    this.listeners = [];
  }

  // Charger les paramètres depuis localStorage
  loadSettings() {
    try {
      const saved = localStorage.getItem('nice_downs_system_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
    
    // Paramètres par défaut
    return {
      maintenanceMode: false,
      emailNotifications: true,
      errorAlerts: true,
      dailyReports: false,
      lastUpdated: new Date().toISOString()
    };
  }

  // Sauvegarder les paramètres
  saveSettings(newSettings) {
    try {
      this.settings = {
        ...this.settings,
        ...newSettings,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('nice_downs_system_settings', JSON.stringify(this.settings));
      
      // Notifier les listeners
      this.listeners.forEach(listener => listener(this.settings));
      
      console.log('✅ Paramètres système sauvegardés:', this.settings);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des paramètres:', error);
      return false;
    }
  }

  // Obtenir un paramètre spécifique
  getSetting(key) {
    return this.settings[key];
  }

  // Vérifier si le mode maintenance est activé
  isMaintenanceMode() {
    return this.settings.maintenanceMode === true;
  }

  // Activer/désactiver le mode maintenance
  setMaintenanceMode(enabled) {
    return this.saveSettings({ maintenanceMode: enabled });
  }

  // Écouter les changements de paramètres
  onSettingsChange(callback) {
    this.listeners.push(callback);
    
    // Retourner une fonction pour supprimer le listener
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Obtenir tous les paramètres
  getAllSettings() {
    return { ...this.settings };
  }

  // Réinitialiser aux paramètres par défaut
  resetToDefaults() {
    const defaultSettings = {
      maintenanceMode: false,
      emailNotifications: true,
      errorAlerts: true,
      dailyReports: false,
      lastUpdated: new Date().toISOString()
    };
    
    return this.saveSettings(defaultSettings);
  }
}

// Instance singleton
const systemService = new SystemService();

export default systemService;