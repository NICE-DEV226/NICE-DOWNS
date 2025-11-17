import axios from 'axios';

// Configuration du backend
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const API_BASE = `${BACKEND_URL}/api`;

// Instance axios avec configuration
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Envoie un rapport d'erreur au backend
 */
export const sendErrorReport = async (errorData) => {
  try {
    const reportData = {
      url: errorData.url,
      platform: errorData.platform,
      error: errorData.error,
      description: errorData.description || errorData.userDescription,
      userAgent: navigator.userAgent,
      browserInfo: {
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height
        }
      }
    };

    const response = await apiClient.post('/error-reports', reportData);

    console.log('✅ Rapport d\'erreur envoyé:', response.data);
    return { 
      success: true, 
      id: response.data.reportId,
      message: response.data.message
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi du rapport:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
};

/**
 * Récupère tous les rapports d'erreurs (pour le dashboard admin)
 */
export const getErrorReports = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.platform) params.append('platform', filters.platform);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);

    const response = await apiClient.get(`/error-reports?${params.toString()}`);
    
    return {
      success: true,
      reports: response.data.reports,
      total: response.data.total,
      limit: response.data.limit,
      offset: response.data.offset
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des rapports:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
};

/**
 * Met à jour le statut d'un rapport d'erreur
 */
export const updateErrorReportStatus = async (reportUuid, newStatus) => {
  try {
    const response = await apiClient.put(`/error-reports/${reportUuid}/status`, {
      status: newStatus
    });
    
    console.log(`📝 Mise à jour du rapport ${reportUuid} vers ${newStatus}`);
    return { 
      success: true, 
      message: response.data.message 
    };
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
};

/**
 * Statistiques des erreurs pour le dashboard
 */
export const getErrorStats = async () => {
  try {
    const response = await apiClient.get('/stats');
    
    return {
      success: true,
      stats: response.data.stats
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des stats:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
};

/**
 * Connexion admin
 */
export const loginAdmin = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password
    });
    
    if (response.data.success) {
      localStorage.setItem('admin_token', response.data.token);
      localStorage.setItem('admin_info', JSON.stringify(response.data.admin));
    }
    
    return {
      success: true,
      token: response.data.token,
      admin: response.data.admin
    };
  } catch (error) {
    console.error('❌ Erreur lors de la connexion:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
};

/**
 * Vérification du token admin
 */
export const verifyAdminToken = async () => {
  try {
    const response = await apiClient.get('/auth/verify');
    
    return {
      success: true,
      admin: response.data.admin
    };
  } catch (error) {
    // Token invalide, supprimer du localStorage
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
    
    return {
      success: false,
      error: error.response?.data?.error || error.message
    };
  }
};

/**
 * Déconnexion admin
 */
export const logoutAdmin = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  } finally {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_info');
  }
};

/**
 * Supprimer un rapport d'erreur
 */
export const deleteErrorReport = async (reportUuid) => {
  try {
    const response = await apiClient.delete(`/error-reports/${reportUuid}`);
    
    console.log(`🗑️ Rapport supprimé: ${reportUuid}`);
    return { 
      success: true, 
      message: response.data.message 
    };
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
};

/**
 * Supprimer plusieurs rapports d'erreur
 */
export const deleteErrorReports = async (reportUuids) => {
  try {
    const deletePromises = reportUuids.map(uuid => deleteErrorReport(uuid));
    const results = await Promise.all(deletePromises);
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    return {
      success: failed === 0,
      successful,
      failed,
      message: `${successful} rapport(s) supprimé(s)${failed > 0 ? `, ${failed} échec(s)` : ''}`
    };
  } catch (error) {
    console.error('❌ Erreur lors de la suppression multiple:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Envoyer une notation utilisateur
 */
export const sendUserRating = async (ratingData) => {
  try {
    const response = await apiClient.post('/ratings', ratingData);

    console.log('✅ Notation envoyée:', response.data);
    return { 
      success: true, 
      id: response.data.ratingId,
      message: response.data.message
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de la notation:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
};

/**
 * Récupérer les notations (ADMIN SEULEMENT)
 */
export const getRatings = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.rating) params.append('rating', filters.rating);
    if (filters.category) params.append('category', filters.category);
    if (filters.platform) params.append('platform', filters.platform);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);

    const response = await apiClient.get(`/ratings?${params.toString()}`);
    
    return {
      success: true,
      ratings: response.data.ratings,
      total: response.data.total,
      average: response.data.average,
      distribution: response.data.distribution
    };
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des notations:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || error.message 
    };
  }
};