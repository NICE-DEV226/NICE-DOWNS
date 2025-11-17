// Service pour gérer les rapports d'erreur localement
class ReportsService {
  constructor() {
    this.reports = this.loadReports();
    this.listeners = [];
  }

  // Charger les rapports depuis localStorage
  loadReports() {
    try {
      const saved = localStorage.getItem('nice_downs_error_reports');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rapports:', error);
    }
    
    // Rapports de test par défaut
    return [
      {
        id: 1,
        uuid: 'test-001',
        created_at: '2025-01-17T10:30:00Z',
        url: 'https://x.com/example/status/123456',
        platform: 'X (Twitter)',
        error_message: 'API temporairement indisponible',
        user_description: 'La vidéo ne se télécharge pas',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        browser_info: { language: 'fr-FR', platform: 'Win32' },
        status: 'nouveau'
      },
      {
        id: 2,
        uuid: 'test-002',
        created_at: '2025-01-17T09:45:00Z',
        url: 'https://www.facebook.com/video/123456',
        platform: 'Facebook',
        error_message: 'Impossible de télécharger depuis Facebook',
        user_description: 'Erreur 400 lors du téléchargement',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        browser_info: { language: 'fr-FR', platform: 'Win32' },
        status: 'en_cours'
      },
      {
        id: 3,
        uuid: 'test-003',
        created_at: '2025-01-16T16:20:00Z',
        url: 'https://www.instagram.com/reel/ABC123/',
        platform: 'Instagram',
        error_message: 'Contenu privé ou supprimé',
        user_description: 'Le lien ne fonctionne plus',
        user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',
        browser_info: { language: 'fr-FR', platform: 'iPhone' },
        status: 'resolu'
      },
      {
        id: 4,
        uuid: 'test-004',
        created_at: '2025-01-16T14:10:00Z',
        url: 'https://www.tiktok.com/@user/video/789',
        platform: 'TikTok',
        error_message: 'Vidéo non disponible dans votre région',
        user_description: 'Message d\'erreur géolocalisation',
        user_agent: 'Mozilla/5.0 (Android 11; Mobile)',
        browser_info: { language: 'fr-FR', platform: 'Linux armv8l' },
        status: 'nouveau'
      }
    ];
  }

  // Sauvegarder les rapports
  saveReports() {
    try {
      localStorage.setItem('nice_downs_error_reports', JSON.stringify(this.reports));
      
      // Notifier les listeners
      this.listeners.forEach(listener => listener(this.reports));
      
      console.log('✅ Rapports sauvegardés:', this.reports.length, 'rapports');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des rapports:', error);
      return false;
    }
  }

  // Obtenir tous les rapports
  getAllReports() {
    return [...this.reports];
  }

  // Obtenir un rapport par UUID
  getReportByUuid(uuid) {
    return this.reports.find(report => report.uuid === uuid);
  }

  // Ajouter un nouveau rapport
  addReport(reportData) {
    const newReport = {
      id: Date.now(),
      uuid: reportData.uuid || `report-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: 'nouveau',
      ...reportData
    };
    
    this.reports.unshift(newReport); // Ajouter au début
    this.saveReports();
    
    return newReport;
  }

  // Mettre à jour le statut d'un rapport
  updateReportStatus(uuid, newStatus) {
    const reportIndex = this.reports.findIndex(report => report.uuid === uuid);
    
    if (reportIndex === -1) {
      console.error('❌ Rapport non trouvé:', uuid);
      return false;
    }
    
    this.reports[reportIndex] = {
      ...this.reports[reportIndex],
      status: newStatus,
      updated_at: new Date().toISOString()
    };
    
    this.saveReports();
    console.log(`✅ Statut mis à jour: ${uuid} -> ${newStatus}`);
    
    return true;
  }

  // Supprimer un rapport
  deleteReport(uuid) {
    const initialLength = this.reports.length;
    this.reports = this.reports.filter(report => report.uuid !== uuid);
    
    if (this.reports.length < initialLength) {
      this.saveReports();
      console.log(`🗑️ Rapport supprimé: ${uuid}`);
      return true;
    }
    
    console.error('❌ Rapport non trouvé pour suppression:', uuid);
    return false;
  }

  // Supprimer plusieurs rapports
  deleteReports(uuids) {
    const initialLength = this.reports.length;
    this.reports = this.reports.filter(report => !uuids.includes(report.uuid));
    
    const deletedCount = initialLength - this.reports.length;
    
    if (deletedCount > 0) {
      this.saveReports();
      console.log(`🗑️ ${deletedCount} rapport(s) supprimé(s)`);
      return { success: true, deletedCount };
    }
    
    return { success: false, deletedCount: 0 };
  }

  // Obtenir les statistiques
  getStats() {
    const total = this.reports.length;
    const nouveaux = this.reports.filter(r => r.status === 'nouveau').length;
    const enCours = this.reports.filter(r => r.status === 'en_cours').length;
    const resolus = this.reports.filter(r => r.status === 'resolu').length;
    
    // Compter par plateforme
    const plateformes = {};
    this.reports.forEach(report => {
      plateformes[report.platform] = (plateformes[report.platform] || 0) + 1;
    });
    
    // Évolution des 7 derniers jours
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayReports = this.reports.filter(r => 
        r.created_at.split('T')[0] === dateStr
      );
      
      last7Days.push({
        date: dateStr,
        erreurs: dayReports.length
      });
    }
    
    return {
      total,
      nouveaux,
      enCours,
      resolus,
      plateformes,
      derniereSemaine: last7Days
    };
  }

  // Écouter les changements
  onReportsChange(callback) {
    this.listeners.push(callback);
    
    // Retourner une fonction pour supprimer le listener
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Réinitialiser aux données de test
  resetToTestData() {
    this.reports = this.loadReports();
    localStorage.removeItem('nice_downs_error_reports');
    this.saveReports();
    return this.reports;
  }
}

// Instance singleton
const reportsService = new ReportsService();

export default reportsService;