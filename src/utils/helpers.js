// Fonctions utilitaires pour NICE-Downs

/**
 * Formate la taille d'un fichier en format lisible
 * @param {number} bytes - Taille en bytes
 * @returns {string} Taille formatée (ex: "1.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Formate une durée en secondes vers un format lisible
 * @param {number} seconds - Durée en secondes
 * @returns {string} Durée formatée (ex: "2:30" ou "1:05:30")
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Valide une URL
 * @param {string} url - URL à valider
 * @returns {boolean} True si l'URL est valide
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Nettoie une URL (supprime les paramètres de tracking, etc.)
 * @param {string} url - URL à nettoyer
 * @returns {string} URL nettoyée
 */
export const cleanUrl = (url) => {
  try {
    const urlObj = new URL(url);
    
    // Paramètres de tracking courants à supprimer
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'ref', 'source', 'campaign'
    ];
    
    trackingParams.forEach(param => {
      urlObj.searchParams.delete(param);
    });
    
    return urlObj.toString();
  } catch {
    return url;
  }
};

/**
 * Génère un nom de fichier sécurisé
 * @param {string} title - Titre original
 * @param {string} extension - Extension du fichier
 * @returns {string} Nom de fichier sécurisé
 */
export const generateSafeFilename = (title, extension) => {
  // Supprime les caractères non autorisés
  const safeName = title
    .replace(/[<>:"/\\|?*]/g, '') // Caractères interdits Windows
    .replace(/[^\w\s-_.]/g, '') // Garde seulement alphanumériques, espaces, tirets, underscores, points
    .replace(/\s+/g, '_') // Remplace les espaces par des underscores
    .replace(/_+/g, '_') // Supprime les underscores multiples
    .trim()
    .substring(0, 100); // Limite à 100 caractères
  
  return `${safeName}.${extension.toLowerCase()}`;
};

/**
 * Détecte la plateforme depuis une URL
 * @param {string} url - URL à analyser
 * @returns {string|null} Nom de la plateforme ou null
 */
export const detectPlatformFromUrl = (url) => {
  if (!isValidUrl(url)) return null;
  
  const hostname = new URL(url).hostname.toLowerCase();
  
  const platformMap = {
    'tiktok.com': 'tiktok',
    'vm.tiktok.com': 'tiktok',
    'instagram.com': 'instagram',
    'instagr.am': 'instagram',
    'youtube.com': 'youtube',
    'youtu.be': 'youtube',
    'm.youtube.com': 'youtube',
    'facebook.com': 'facebook',
    'fb.com': 'facebook',
    'm.facebook.com': 'facebook',
    'pinterest.com': 'pinterest',
    'pin.it': 'pinterest',
    'twitter.com': 'twitter',
    'x.com': 'twitter',
    't.co': 'twitter'
  };
  
  // Recherche exacte
  if (platformMap[hostname]) {
    return platformMap[hostname];
  }
  
  // Recherche avec sous-domaines
  for (const [domain, platform] of Object.entries(platformMap)) {
    if (hostname.endsWith(`.${domain}`)) {
      return platform;
    }
  }
  
  return null;
};

/**
 * Copie du texte dans le presse-papiers
 * @param {string} text - Texte à copier
 * @returns {Promise<boolean>} True si la copie a réussi
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback pour les navigateurs plus anciens
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('Erreur lors de la copie:', error);
    return false;
  }
};

/**
 * Debounce une fonction
 * @param {Function} func - Fonction à debouncer
 * @param {number} wait - Délai d'attente en ms
 * @returns {Function} Fonction debouncée
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle une fonction
 * @param {Function} func - Fonction à throttler
 * @param {number} limit - Limite en ms
 * @returns {Function} Fonction throttlée
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Génère un ID unique
 * @returns {string} ID unique
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Formate une date en format local
 * @param {Date|string|number} date - Date à formater
 * @returns {string} Date formatée
 */
export const formatDate = (date) => {
  try {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Date invalide';
  }
};

/**
 * Vérifie si l'utilisateur est sur mobile
 * @returns {boolean} True si mobile
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Vérifie si le navigateur supporte une fonctionnalité
 * @param {string} feature - Nom de la fonctionnalité
 * @returns {boolean} True si supportée
 */
export const supportsFeature = (feature) => {
  switch (feature) {
    case 'clipboard':
      return navigator.clipboard && window.isSecureContext;
    case 'share':
      return navigator.share;
    case 'webp':
      return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    case 'localStorage':
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    default:
      return false;
  }
};

/**
 * Retarde l'exécution
 * @param {number} ms - Délai en millisecondes
 * @returns {Promise} Promise qui se résout après le délai
 */
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};