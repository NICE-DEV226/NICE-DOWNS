import axios from 'axios';

// Configuration des nouvelles APIs
const NEW_API_BASE_URL = 'https://api-aswin-sparky.koyeb.app/api/downloader';
const OLD_API_BASE_URL = 'https://api.neoxr.eu/api';
const OLD_API_KEY = import.meta.env.VITE_API_KEY || 'yVGABy';

// Instance axios pour les nouvelles APIs
const newApiClient = axios.create({
  baseURL: NEW_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Instance axios pour les anciennes APIs (fallback)
const oldApiClient = axios.create({
  baseURL: OLD_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteurs pour les erreurs
[newApiClient, oldApiClient].forEach(client => {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );
});

/**
 * Détecte la plateforme depuis une URL
 */
export const detectPlatformFromUrl = (url) => {
  const platformMap = {
    'tiktok.com': 'tiktok',
    'vm.tiktok.com': 'tiktok',
    'vt.tiktok.com': 'tiktok',
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

  try {
    const hostname = new URL(url).hostname.toLowerCase();
    
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
  } catch {
    return null;
  }
};

/**
 * Télécharge du contenu depuis TikTok (nouvelle API)
 */
export const downloadTikTokNew = async (url) => {
  try {
    const response = await newApiClient.get(`/tiktok?url=${encodeURIComponent(url)}`);
    
    if (response.data && response.data.status) {
      const data = response.data.data || response.data;
      
      return {
        platform: 'TikTok',
        title: data.title || data.desc || 'Vidéo TikTok',
        thumbnail: data.cover || data.thumbnail || 'https://via.placeholder.com/300x200/FF0080/FFFFFF?text=TikTok+Video',
        formats: [
          ...(data.video ? [{
            type: 'MP4',
            url: data.video,
            size: data.size || 'Taille inconnue',
            quality: 'HD'
          }] : []),
          ...(data.music ? [{
            type: 'MP3',
            url: data.music,
            size: 'Audio',
            quality: 'Audio'
          }] : [])
        ],
        author: data.author || '@utilisateur',
        duration: data.duration || '0:15',
        apiSource: 'new'
      };
    }
    
    throw new Error('Aucune donnée trouvée');
  } catch (error) {
    console.error('Erreur TikTok New API:', error);
    throw new Error('Impossible de télécharger depuis TikTok (nouvelle API)');
  }
};

/**
 * Télécharge du contenu depuis Facebook (nouvelle API)
 */
export const downloadFacebookNew = async (url) => {
  try {
    const response = await newApiClient.get(`/fbdl?url=${encodeURIComponent(url)}`);
    
    if (response.data && response.data.status) {
      const data = response.data.data || response.data;
      
      return {
        platform: 'Facebook',
        title: data.title || 'Vidéo Facebook',
        thumbnail: data.thumbnail || 'https://via.placeholder.com/300x200/1877F2/FFFFFF?text=Facebook+Video',
        formats: [
          ...(data.hd ? [{
            type: 'MP4',
            url: data.hd,
            size: data.size || 'Taille inconnue',
            quality: 'HD'
          }] : []),
          ...(data.sd ? [{
            type: 'MP4',
            url: data.sd,
            size: 'SD',
            quality: 'SD'
          }] : []),
          ...(data.video ? [{
            type: 'MP4',
            url: data.video,
            size: data.size || 'Taille inconnue',
            quality: 'Standard'
          }] : [])
        ],
        author: data.author || 'Utilisateur Facebook',
        duration: data.duration || null,
        apiSource: 'new'
      };
    }
    
    throw new Error('Aucune donnée trouvée');
  } catch (error) {
    console.error('Erreur Facebook New API:', error);
    throw new Error('Impossible de télécharger depuis Facebook (nouvelle API)');
  }
};

/**
 * Télécharge du contenu depuis Twitter (nouvelle API)
 */
export const downloadTwitterNew = async (url) => {
  try {
    const response = await newApiClient.get(`/twiter?url=${encodeURIComponent(url)}`);
    
    if (response.data && response.data.status) {
      const data = response.data.data || response.data;
      
      return {
        platform: 'X (Twitter)',
        title: data.title || data.text || 'Tweet avec média',
        thumbnail: data.thumbnail || 'https://via.placeholder.com/300x200/000000/FFFFFF?text=X+Media',
        formats: [
          ...(data.video ? [{
            type: 'MP4',
            url: data.video,
            size: data.size || 'Taille inconnue',
            quality: 'HD'
          }] : []),
          ...(data.images && Array.isArray(data.images) ? data.images.map((img, index) => ({
            type: 'JPG',
            url: img,
            size: 'Image',
            quality: `Image ${index + 1}`
          })) : [])
        ],
        author: data.author || '@utilisateur',
        duration: data.duration || null,
        apiSource: 'new'
      };
    }
    
    throw new Error('Aucune donnée trouvée');
  } catch (error) {
    console.error('Erreur Twitter New API:', error);
    throw new Error('Impossible de télécharger depuis Twitter (nouvelle API)');
  }
};

/**
 * Fonction principale pour télécharger du contenu avec les nouvelles APIs
 */
export const downloadContentNew = async (url) => {
  const platform = detectPlatformFromUrl(url);
  
  if (!platform) {
    throw new Error('Plateforme non supportée ou URL invalide');
  }
  
  try {
    switch (platform) {
      case 'tiktok':
        return await downloadTikTokNew(url);
      case 'facebook':
        return await downloadFacebookNew(url);
      case 'twitter':
        return await downloadTwitterNew(url);
      default:
        throw new Error(`Plateforme ${platform} non supportée par les nouvelles APIs`);
    }
  } catch (error) {
    // Fallback vers les anciennes APIs si disponible
    console.log('Tentative avec les anciennes APIs...');
    throw error; // Pour l'instant, on laisse l'erreur remonter
  }
};

/**
 * Télécharge un fichier depuis une URL
 */
export const downloadFile = async (url, filename) => {
  try {
    // Créer un lien de téléchargement
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    
    // Déclencher le téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Erreur de téléchargement:', error);
    return false;
  }
};

/**
 * Test de connectivité des nouvelles APIs
 */
export const testNewApiConnectivity = async () => {
  try {
    const testUrl = 'https://vt.tiktok.com/ZSNvs6h6o';
    const response = await newApiClient.get(`/tiktok?url=${encodeURIComponent(testUrl)}`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};