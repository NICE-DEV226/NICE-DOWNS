import axios from 'axios';

// Configuration de la nouvelle API (plus simple et plus rapide)
const BASE_URL = 'https://api-aswin-sparky.koyeb.app/api/downloader';

// Instance axios configurée
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Détecte la plateforme depuis une URL
 */
export const detectPlatformFromUrl = (url) => {
  const platformMap = {
    'tiktok.com': 'tiktok',
    'vm.tiktok.com': 'tiktok',
    'vt.tiktok.com': 'tiktok',
    'facebook.com': 'facebook',
    'fb.com': 'facebook',
    'm.facebook.com': 'facebook',
    'twitter.com': 'twitter',
    'x.com': 'twitter',
    'www.x.com': 'twitter',
    't.co': 'twitter',
    'instagram.com': 'instagram',
    'www.instagram.com': 'instagram',
    'reddit.com': 'reddit',
    'www.reddit.com': 'reddit'
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
 * Télécharge du contenu depuis TikTok
 */
export const downloadTikTok = async (url) => {
  try {
    const response = await apiClient.get(`/tiktok?url=${encodeURIComponent(url)}`);
    
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
        author: typeof data.author === 'object' ? (data.author.nickname || data.author.unique_id || '@utilisateur') : (data.author || '@utilisateur'),
        duration: data.duration || '0:15'
      };
    }
    
    throw new Error('Aucune donnée trouvée');
  } catch (error) {
    console.error('Erreur TikTok API:', error);
    throw new Error('Impossible de télécharger depuis TikTok');
  }
};

/**
 * Télécharge du contenu depuis Facebook avec la nouvelle API
 */
export const downloadFacebook = async (url) => {
  try {
    const FACEBOOK_API_KEY = '245a700c28adcfc11f';
    const response = await axios.get(`https://api.nexoracle.com/downloader/facebook2?apikey=${FACEBOOK_API_KEY}&url=${encodeURIComponent(url)}`);
    
    console.log('Facebook API Response:', response.data); // Debug
    
    if (response.data && response.data.status === 200 && response.data.result) {
      const data = response.data.result;
      
      return {
        platform: 'Facebook',
        title: data.title || 'Vidéo Facebook',
        thumbnail: 'https://via.placeholder.com/300x200/1877F2/FFFFFF?text=Facebook+Video',
        formats: [
          {
            type: 'MP4',
            url: data.videoUrl,
            size: data.size || 'Taille inconnue',
            quality: 'HD',
            format: 'mp4'
          }
        ],
        author: 'Utilisateur Facebook',
        duration: null
      };
    }
    
    throw new Error('Aucune donnée trouvée dans la réponse API');
  } catch (error) {
    console.error('Erreur Facebook API:', error);
    
    // Retourner des données de fallback pour que l'aperçu s'affiche
    return {
      platform: 'Facebook',
      title: 'Contenu Facebook',
      thumbnail: 'https://via.placeholder.com/300x200/1877F2/FFFFFF?text=Facebook+Video',
      formats: [
        {
          type: 'MP4',
          url: url, // Utiliser l'URL originale
          size: 'Taille inconnue',
          quality: 'HD',
          format: 'mp4'
        }
      ],
      author: 'Utilisateur Facebook',
      duration: null,
      error: 'API temporairement indisponible - le lien s\'ouvrira dans un nouvel onglet'
    };
  }
};

/**
 * Télécharge du contenu depuis Twitter avec la nouvelle API
 */
export const downloadTwitter = async (url) => {
  try {
    const TWITTER_API_KEY = '245a700c28adcfc11f';
    const response = await axios.get(`https://api.nexoracle.com/downloader/twitter?apikey=${TWITTER_API_KEY}&url=${encodeURIComponent(url)}`);
    
    console.log('Twitter API Response:', response.data); // Debug
    
    if (response.data && response.data.status === 200 && response.data.result) {
      const data = response.data.result;
      
      const formats = [];
      
      // Ajouter la vidéo si disponible
      if (data.video) {
        formats.push({
          type: 'MP4',
          url: data.video,
          size: 'Vidéo',
          quality: 'HD',
          format: 'mp4'
        });
      }
      
      return {
        platform: 'X (Twitter)',
        title: data.caption || 'Tweet avec média',
        thumbnail: data.thumbnail || 'https://via.placeholder.com/300x200/000000/FFFFFF?text=X+Media',
        formats: formats,
        author: `@${data.username || 'utilisateur'}`,
        duration: null
      };
    }
    
    throw new Error('Aucune donnée trouvée dans la réponse API');
  } catch (error) {
    console.error('Erreur Twitter API:', error);
    
    // Retourner des données de fallback pour que l'aperçu s'affiche
    return {
      platform: 'X (Twitter)',
      title: 'Tweet avec média',
      thumbnail: 'https://via.placeholder.com/300x200/000000/FFFFFF?text=X+Media',
      formats: [
        {
          type: 'MP4',
          url: url, // Utiliser l'URL originale
          size: 'Média Twitter',
          quality: 'HD',
          format: 'mp4'
        }
      ],
      author: '@utilisateur',
      duration: null,
      error: 'API temporairement indisponible - le lien s\'ouvrira dans un nouvel onglet'
    };
  }
};

/**
 * Télécharge du contenu depuis Instagram avec la nouvelle API
 */
export const downloadInstagram = async (url) => {
  try {
    const INSTAGRAM_API_KEY = '245a700c28adcfc11f';
    const response = await axios.get(`https://api.nexoracle.com/downloader/insta?apikey=${INSTAGRAM_API_KEY}&url=${encodeURIComponent(url)}`);
    
    console.log('Instagram API Response:', response.data); // Debug
    
    if (response.data && response.data.status === 200 && response.data.result) {
      const data = response.data.result;
      
      // Extraire les informations du post
      const postInfo = data.post_info || {};
      const mediaDetails = data.media_details || [];
      const urlList = data.url_list || [];
      
      // Créer les formats disponibles
      const formats = [];
      
      // Ajouter les URLs de la liste principale
      urlList.forEach((mediaUrl, index) => {
        const mediaDetail = mediaDetails[index] || {};
        
        // Essayer de calculer la taille approximative depuis les dimensions
        let estimatedSize = 'Taille inconnue';
        if (mediaDetail.dimensions) {
          const { width, height } = mediaDetail.dimensions;
          if (mediaDetail.type === 'video') {
            // Estimation pour vidéo HD (approximation)
            const pixels = width * height;
            const estimatedMB = Math.round((pixels * 0.0001) * 10) / 10; // Approximation
            estimatedSize = `~${estimatedMB}MB`;
          } else {
            // Estimation pour image
            const estimatedKB = Math.round((width * height * 0.003));
            estimatedSize = estimatedKB > 1000 ? `~${Math.round(estimatedKB/100)/10}MB` : `~${estimatedKB}KB`;
          }
        }
        
        formats.push({
          type: mediaDetail.type === 'video' ? 'MP4' : 'JPG',
          url: mediaUrl,
          size: mediaDetail.type === 'video' ? 'Vidéo HD' : 'Image HD',
          quality: `${mediaDetail.dimensions?.width || ''}x${mediaDetail.dimensions?.height || ''} HD`,
          format: mediaDetail.type === 'video' ? 'mp4' : 'jpg',
          realSize: estimatedSize,
          dimensions: mediaDetail.dimensions
        });
      });
      
      // Si pas de formats, ajouter depuis media_details
      if (formats.length === 0 && mediaDetails.length > 0) {
        mediaDetails.forEach((media, index) => {
          if (media.url) {
            formats.push({
              type: media.type === 'video' ? 'MP4' : 'JPG',
              url: media.url,
              size: media.type === 'video' ? 'Vidéo HD' : 'Image HD',
              quality: 'HD',
              format: media.type === 'video' ? 'mp4' : 'jpg'
            });
          }
        });
      }
      
      return {
        platform: 'Instagram',
        title: postInfo.caption || 'Contenu Instagram',
        thumbnail: mediaDetails[0]?.thumbnail || 'https://via.placeholder.com/300x200/E4405F/FFFFFF?text=Instagram+Media',
        formats: formats,
        author: `@${postInfo.owner_username || 'utilisateur'}`,
        duration: null,
        views: mediaDetails[0]?.video_view_count || null,
        likes: postInfo.likes || null
      };
    }
    
    throw new Error('Aucune donnée trouvée dans la réponse API');
  } catch (error) {
    console.error('Erreur Instagram API:', error);
    
    // Retourner des données de fallback pour que l'aperçu s'affiche
    return {
      platform: 'Instagram',
      title: 'Contenu Instagram',
      thumbnail: 'https://via.placeholder.com/300x200/E4405F/FFFFFF?text=Instagram+Media',
      formats: [
        {
          type: 'MP4',
          url: url, // Utiliser l'URL originale
          size: 'Média Instagram',
          quality: 'HD',
          format: 'mp4'
        }
      ],
      author: '@utilisateur',
      duration: null,
      error: 'API temporairement indisponible - le lien s\'ouvrira dans un nouvel onglet'
    };
  }
};

/**
 * Télécharge des stories Instagram par nom d'utilisateur
 */
export const downloadInstagramStory = async (username) => {
  try {
    const response = await apiClient.get(`/story?search=${encodeURIComponent(username)}`);
    
    if (response.data && response.data.status) {
      const data = response.data.data || response.data;
      
      if (data.stories && Array.isArray(data.stories)) {
        return {
          platform: 'Instagram Stories',
          title: `Stories de @${username}`,
          thumbnail: data.stories[0]?.thumbnail || 'https://via.placeholder.com/300x200/E4405F/FFFFFF?text=Instagram+Stories',
          formats: data.stories.map((story, index) => ({
            type: story.type === 'video' ? 'MP4' : 'JPG',
            url: story.url,
            size: story.type === 'video' ? 'Vidéo' : 'Image',
            quality: `Story ${index + 1}`
          })),
          author: `@${username}`,
          duration: null,
          count: data.stories.length
        };
      }
    }
    
    throw new Error('Aucune story trouvée');
  } catch (error) {
    console.error('Erreur Instagram Stories API:', error);
    throw new Error('Impossible de télécharger les stories Instagram');
  }
};



/**
 * Télécharge du contenu depuis Reddit avec la nouvelle API
 */
export const downloadReddit = async (url) => {
  try {
    const REDDIT_API_KEY = '245a700c28adcfc11f';
    const response = await axios.get(`https://api.nexoracle.com/downloader/reddit?apikey=${REDDIT_API_KEY}&url=${encodeURIComponent(url)}`);
    
    console.log('Reddit API Response:', response.data); // Debug
    
    if (response.data && response.data.status === 200 && response.data.result) {
      const data = response.data.result;
      
      return {
        platform: 'Reddit',
        title: data.title || 'Contenu Reddit',
        thumbnail: 'https://via.placeholder.com/300x200/FF4500/FFFFFF?text=Reddit+Video',
        formats: [
          {
            type: 'MP4',
            url: data.url,
            size: data.size || 'Taille inconnue',
            quality: data.quality || 'HD',
            format: data.format || 'mp4',
            realSize: data.size // Vraie taille de l'API
          }
        ],
        author: 'Reddit User',
        duration: null
      };
    }
    
    throw new Error('Aucune donnée trouvée dans la réponse API');
  } catch (error) {
    console.error('Erreur Reddit API:', error);
    
    // Retourner des données de fallback pour que l'aperçu s'affiche
    return {
      platform: 'Reddit',
      title: 'Contenu Reddit',
      thumbnail: 'https://via.placeholder.com/300x200/FF4500/FFFFFF?text=Reddit+Video',
      formats: [
        {
          type: 'MP4',
          url: url, // Utiliser l'URL originale
          size: 'Vidéo Reddit',
          quality: 'HD',
          format: 'mp4'
        }
      ],
      author: 'Reddit User',
      duration: null,
      error: 'API temporairement indisponible - le lien s\'ouvrira dans un nouvel onglet'
    };
  }
};

/**
 * Détecte si l'input est un nom d'utilisateur Instagram pour les stories
 */
export const isInstagramUsername = (input) => {
  // Vérifie si c'est un nom d'utilisateur Instagram (pas une URL)
  const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
  return usernameRegex.test(input) && !input.includes('http') && !input.includes('.');
};

/**
 * Fonction principale pour télécharger du contenu
 */
export const downloadContent = async (input) => {
  // Vérifier si c'est un nom d'utilisateur Instagram pour les stories
  if (isInstagramUsername(input)) {
    return await downloadInstagramStory(input);
  }
  
  // Sinon, traiter comme une URL normale
  const platform = detectPlatformFromUrl(input);
  
  if (!platform) {
    throw new Error('Plateforme non supportée ou URL invalide. Pour les stories Instagram, entrez juste le nom d\'utilisateur (ex: sparky.drip)');
  }
  
  switch (platform) {
    case 'tiktok':
      return await downloadTikTok(input);
    case 'facebook':
      return await downloadFacebook(input);
    case 'twitter':
      return await downloadTwitter(input);
    case 'instagram':
      return await downloadInstagram(input);
    case 'reddit':
      return await downloadReddit(input);
    default:
      throw new Error(`Plateforme ${platform} non supportée`);
  }
};

/**
 * Télécharge un fichier en utilisant différentes méthodes
 */
export const downloadFile = async (url, filename) => {
  try {
    // Pour les URLs TikTok, Instagram, etc. avec restrictions CORS
    if (url.includes('tiktokcdn.com') || url.includes('cdninstagram.com') || url.includes('fbcdn.net')) {
      return await downloadWithSpecialHandling(url, filename);
    }
    
    // Méthode 1: Essayer avec un proxy CORS
    await downloadWithProxy(url, filename);
    return true;
  } catch (proxyError) {
    console.log('Proxy failed, trying direct download...');
    
    try {
      // Méthode 2: Téléchargement direct avec fetch
      await downloadDirect(url, filename);
      return true;
    } catch (directError) {
      console.log('Direct download failed, using fallback...');
      
      // Méthode 3: Fallback - forcer le téléchargement avec des headers spéciaux
      return downloadFallback(url, filename);
    }
  }
};

/**
 * Gestion spéciale pour les URLs avec restrictions CORS
 */
const downloadWithSpecialHandling = async (url, filename) => {
  try {
    // Essayer avec un proxy différent spécialement pour les médias
    const proxyUrl = `https://cors-proxy.htmldriven.com/?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'video/mp4,image/*,*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.ok) {
      const blob = await response.blob();
      downloadBlob(blob, filename);
      return true;
    }
    
    throw new Error('Special proxy failed');
  } catch (error) {
    console.log('Special handling failed, using iframe method...');
    
    // Méthode iframe avec instructions automatiques
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    iframe.onload = () => {
      // Instructions automatiques après chargement
      setTimeout(() => {
        alert(`Fichier prêt à télécharger !\n\n📁 Nom : ${filename}\n\n🔧 Instructions :\n1. Le fichier est ouvert dans l'iframe\n2. Faites Ctrl+S pour sauvegarder\n3. Ou clic droit → "Enregistrer sous"\n\n💡 Astuce : Le fichier se trouve dans l'onglet qui vient de s'ouvrir`);
      }, 2000);
    };
    
    document.body.appendChild(iframe);
    
    // Nettoyer après 10 secondes
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 10000);
    
    // Aussi ouvrir dans un nouvel onglet comme backup
    setTimeout(() => {
      window.open(url, '_blank');
    }, 1000);
    
    return true;
  }
};

/**
 * Télécharge via un proxy CORS
 */
const downloadWithProxy = async (url, filename) => {
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
  
  const response = await fetch(proxyUrl);
  if (!response.ok) throw new Error('Proxy failed');
  
  const blob = await response.blob();
  downloadBlob(blob, filename);
};

/**
 * Téléchargement direct
 */
const downloadDirect = async (url, filename) => {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Accept': '*/*',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
  });
  
  if (!response.ok) throw new Error('Direct download failed');
  
  const blob = await response.blob();
  downloadBlob(blob, filename);
};

/**
 * Méthode fallback qui force le téléchargement
 */
const downloadFallback = (url, filename) => {
  try {
    // Pour les URLs avec restrictions CORS (comme TikTok), utiliser directement window.open
    // avec des instructions pour l'utilisateur
    if (url.includes('tiktokcdn.com') || url.includes('fbcdn.net') || url.includes('pinimg.com')) {
      // Ouvrir dans un nouvel onglet avec instructions
      const newWindow = window.open(url, '_blank');
      
      // Afficher des instructions à l'utilisateur
      setTimeout(() => {
        alert(`Le fichier s'est ouvert dans un nouvel onglet.\n\nPour le télécharger :\n1. Faites clic droit sur la vidéo/image\n2. Sélectionnez "Enregistrer sous..." ou "Télécharger"\n3. Choisissez l'emplacement de sauvegarde\n\nNom suggéré : ${filename}`);
      }, 1000);
      
      return true;
    }
    
    // Pour les autres URLs, essayer le téléchargement direct
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Ajouter des attributs pour forcer le téléchargement
    link.setAttribute('download', filename);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Fallback failed:', error);
    // Dernier recours : ouvrir dans un nouvel onglet
    window.open(url, '_blank');
    return false;
  }
};

/**
 * Télécharge un blob
 */
const downloadBlob = (blob, filename) => {
  const blobUrl = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Nettoyer l'URL temporaire après un délai
  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl);
  }, 1000);
};

/**
 * Génère un nom de fichier basé sur le titre et le type
 */
export const generateFilename = (title, type, platform) => {
  // Nettoyer le titre pour le nom de fichier
  const cleanTitle = title
    .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
    .replace(/\s+/g, '_') // Remplacer les espaces par des underscores
    .substring(0, 50); // Limiter la longueur
  
  const extension = type.toLowerCase().replace('jpg', 'jpeg');
  const timestamp = Date.now();
  
  return `${platform}_${cleanTitle}_${timestamp}.${extension}`;
};

/**
 * Alternative de téléchargement qui utilise un service de conversion
 */
export const downloadWithConverter = async (url, filename, type) => {
  try {
    // Utiliser un service de conversion/proxy
    const converterUrl = `https://cors-anywhere.herokuapp.com/${url}`;
    
    const response = await fetch(converterUrl, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      }
    });
    
    if (response.ok) {
      const blob = await response.blob();
      downloadBlob(blob, filename);
      return true;
    }
    
    throw new Error('Converter service failed');
  } catch (error) {
    console.error('Converter download failed:', error);
    return false;
  }
};

/**
 * Téléchargement simple et direct
 */
export const downloadFileDirect = (url, filename) => {
  // Créer un lien avec attributs de téléchargement forcé
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  
  // Attributs supplémentaires pour forcer le téléchargement
  link.setAttribute('download', filename);
  link.setAttribute('type', 'application/octet-stream');
  
  // Style invisible
  link.style.display = 'none';
  link.style.position = 'absolute';
  link.style.left = '-9999px';
  
  // Ajouter au DOM
  document.body.appendChild(link);
  
  // Déclencher le téléchargement
  link.click();
  
  // Nettoyer après un délai
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
  }, 1000);
  
  return true;
};

/**
 * Téléchargement intelligent avec conversion côté serveur
 */
export const downloadWithSmartHandling = async (url, filename) => {
  try {
    // Détecter le type d'URL pour choisir la meilleure méthode
    const isTikTokUrl = url.includes('tiktokcdn.com') || url.includes('muscdn.com');
    const isInstagramUrl = url.includes('cdninstagram.com') || url.includes('fbcdn.net');
    const isFacebookUrl = url.includes('fbcdn.net') || url.includes('facebook.com');
    const isTwitterUrl = url.includes('pbs.twimg.com') || url.includes('video.twimg.com');
    
    // Pour TikTok, utiliser une méthode spéciale de conversion
    if (isTikTokUrl) {
      return await downloadTikTokWithConverter(url, filename);
    }
    
    // Pour les autres URLs avec restrictions CORS
    if (isInstagramUrl || isFacebookUrl || isTwitterUrl) {
      return await downloadWithServerProxy(url, filename);
    }
    
    // Pour les autres URLs, essayer le téléchargement direct
    return await downloadDirectWithFallback(url, filename);
    
  } catch (error) {
    console.error('Smart download failed:', error);
    return downloadFallbackMethod(url, filename);
  }
};

/**
 * Téléchargement TikTok avec service de conversion
 */
const downloadTikTokWithConverter = async (url, filename) => {
  try {
    // Utiliser un service de conversion qui peut gérer TikTok
    const converters = [
      `https://api.cobalt.tools/api/json`,
      `https://co.wuk.sh/api/json`
    ];
    
    for (const converterUrl of converters) {
      try {
        const response = await fetch(converterUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            url: url,
            vCodec: 'h264',
            vQuality: '720',
            aFormat: 'mp3',
            filenamePattern: 'classic',
            isAudioOnly: false
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success' && data.url) {
            // Télécharger depuis l'URL convertie
            return await downloadDirectFile(data.url, filename);
          }
        }
      } catch (error) {
        console.log(`Converter ${converterUrl} failed, trying next...`);
        continue;
      }
    }
    
    // Si les convertisseurs échouent, essayer une méthode alternative
    return await downloadTikTokAlternative(url, filename);
    
  } catch (error) {
    console.error('TikTok converter failed:', error);
    return downloadFallbackMethod(url, filename);
  }
};

/**
 * Méthode alternative pour TikTok
 */
const downloadTikTokAlternative = async (url, filename) => {
  try {
    // Utiliser un service de téléchargement spécialisé
    const response = await fetch('https://tikdown.org/api/ajaxSearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: `q=${encodeURIComponent(url)}&lang=en`
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'ok' && data.data) {
        // Extraire l'URL de téléchargement depuis la réponse HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.data, 'text/html');
        const downloadLink = doc.querySelector('a[download]');
        
        if (downloadLink) {
          return await downloadDirectFile(downloadLink.href, filename);
        }
      }
    }
    
    throw new Error('Alternative method failed');
  } catch (error) {
    console.error('TikTok alternative failed:', error);
    return downloadFallbackMethod(url, filename);
  }
};

/**
 * Téléchargement avec proxy serveur
 */
const downloadWithServerProxy = async (url, filename) => {
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.ok) {
      const blob = await response.blob();
      downloadBlob(blob, filename);
      showDownloadNotification(filename, 'Téléchargement réussi !');
      return true;
    }
  } catch (error) {
    console.log('Server proxy failed, using fallback method');
  }
  
  return downloadFallbackMethod(url, filename);
};

/**
 * Téléchargement direct d'un fichier
 */
const downloadDirectFile = async (url, filename) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.ok) {
      const blob = await response.blob();
      downloadBlob(blob, filename);
      showDownloadNotification(filename, 'Téléchargement réussi !');
      return true;
    }
    
    throw new Error('Direct file download failed');
  } catch (error) {
    console.error('Direct file download error:', error);
    return downloadFallbackMethod(url, filename);
  }
};

/**
 * Téléchargement direct avec fallback
 */
const downloadDirectWithFallback = async (url, filename) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': '*/*'
      }
    });
    
    if (response.ok) {
      const blob = await response.blob();
      downloadBlob(blob, filename);
      showDownloadNotification(filename, 'Téléchargement réussi !');
      return true;
    }
    
    throw new Error('Direct download failed');
  } catch (error) {
    return downloadFallbackMethod(url, filename);
  }
};

/**
 * Méthode fallback qui force le téléchargement
 */
const downloadFallbackMethod = (url, filename) => {
  try {
    // Méthode 1: Essayer avec un iframe invisible qui force le téléchargement
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    
    // Créer une page HTML qui force le téléchargement
    const downloadHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Téléchargement</title>
      </head>
      <body>
        <script>
          window.onload = function() {
            const link = document.createElement('a');
            link.href = '${url}';
            link.download = '${filename}';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            
            // Fermer après téléchargement
            setTimeout(() => {
              window.close();
            }, 2000);
          };
        </script>
        <p>Téléchargement en cours...</p>
      </body>
      </html>
    `;
    
    iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(downloadHTML);
    document.body.appendChild(iframe);
    
    // Nettoyer l'iframe après 5 secondes
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 5000);
    
    // Méthode 2: Aussi essayer le téléchargement direct
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Attributs supplémentaires pour forcer le téléchargement
      link.setAttribute('download', filename);
      link.setAttribute('type', 'application/octet-stream');
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 500);
    
    // Instructions pour l'utilisateur
    setTimeout(() => {
      showDownloadInstructions(filename);
    }, 1500);
    
    return true;
  } catch (error) {
    console.error('Fallback method failed:', error);
    
    // Dernier recours : ouvrir dans un nouvel onglet
    window.open(url, '_blank');
    showDownloadInstructions(filename);
    return false;
  }
};

/**
 * Affiche une notification de téléchargement
 */
const showDownloadNotification = (filename, message) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(message, {
      body: `Fichier: ${filename}`,
      icon: '/favicon.ico'
    });
  }
};

/**
 * Affiche les instructions de téléchargement
 */
const showDownloadInstructions = (filename) => {
  // Créer une notification personnalisée dans l'interface
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-lg shadow-xl z-50 max-w-sm border border-purple-400/30';
  notification.style.animation = 'slideInRight 0.3s ease-out';
  
  notification.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        <svg class="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
        </svg>
      </div>
      <div class="flex-1">
        <h4 class="font-semibold mb-1">📥 Fichier ouvert dans un nouvel onglet</h4>
        <p class="text-sm opacity-90 mb-2">Pour télécharger :</p>
        <div class="text-xs opacity-90 space-y-1">
          <div>🖱️ <strong>Clic droit → "Enregistrer sous"</strong></div>
          <div>⌨️ Ou appuyez sur <strong>Ctrl+S</strong></div>
          <div class="mt-2 p-2 bg-black/20 rounded text-xs">
            📁 ${filename}
          </div>
        </div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="text-white/70 hover:text-white transition-colors">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  `;
  
  // Ajouter les styles d'animation
  if (!document.getElementById('download-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'download-notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Supprimer automatiquement après 10 secondes
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 10000);
};

/**
 * Téléchargement intelligent qui évite les fichiers vides
 */
export const downloadWithSmartValidation = async (url, filename) => {
  try {
    // Détecter les plateformes et types d'URLs
    const isTikTokUrl = url.includes('tiktokcdn.com') || url.includes('muscdn.com');
    const isInstagramCDN = url.includes('cdninstagram.com') || url.includes('fbcdn.net');
    const isFacebookCDN = url.includes('fbcdn.net') || url.includes('facebook.com');
    const isTwitterCDN = url.includes('pbs.twimg.com') || url.includes('video.twimg.com');
    const isProxyUrl = url.includes('snapcdn.app') || url.includes('dl.') || url.includes('proxy');
    
    // TikTok fonctionne bien, on garde la méthode ultime
    if (isTikTokUrl) {
      console.log('🎵 TikTok detected, using ultimate download method');
      return await downloadUltimate(url, filename);
    }
    
    // Pour les URLs de proxy (comme snapcdn.app), essayer le téléchargement direct
    if (isProxyUrl) {
      console.log('🔗 Proxy URL detected, attempting direct download');
      return await downloadProxyUrl(url, filename);
    }
    
    // Pour les CDN Instagram/Facebook/Twitter originaux - ouvrir directement
    if (isInstagramCDN || isFacebookCDN || isTwitterCDN) {
      console.log('🔄 Detected restricted CDN, opening media directly');
      return openMediaInNewTab(url, filename);
    }
    
    // Pour les autres URLs, essayer le téléchargement normal
    return await downloadUltimate(url, filename);
    
  } catch (error) {
    console.log('❌ Smart validation failed, using fallback');
    return downloadFallbackMethod(url, filename);
  }
};

/**
 * Gestion spécialisée pour les URLs de proxy
 */
const downloadProxyUrl = async (url, filename) => {
  try {
    console.log('🔗 Proxy URL detected, opening directly:', url);
    
    // Les URLs de proxy avec tokens JWT fonctionnent mieux en ouverture directe
    // Ouvrir dans un nouvel onglet où le token sera valide
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Afficher des instructions spécialisées pour les proxies
    setTimeout(() => {
      showProxyInstructions(filename, url);
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Proxy URL opening failed:', error);
    return openMediaInNewTab(url, filename);
  }
};

/**
 * Instructions spécialisées pour les URLs de proxy
 */
const showProxyInstructions = (filename, url) => {
  // Créer une notification spécialisée pour les proxies
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white p-5 rounded-xl shadow-2xl z-50 max-w-sm border border-green-400/30';
  notification.style.animation = 'slideInRight 0.4s ease-out';
  
  notification.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        <div class="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-green-900" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
        </div>
      </div>
      <div class="flex-1">
        <h4 class="font-bold mb-2 text-green-300">✅ Média ouvert dans un nouvel onglet</h4>
        <div class="text-sm opacity-95 mb-3">
          <p class="mb-2"><strong>Le téléchargement va démarrer automatiquement !</strong></p>
          <div class="text-xs opacity-90 leading-relaxed">
            • Le fichier se télécharge automatiquement<br>
            • Vérifiez votre dossier "Téléchargements"<br>
            • Si rien : clic droit → "Enregistrer sous"<br>
            • Si page vide : le token a expiré, réessayez l'extraction
          </div>
        </div>
        <div class="mt-3 p-2 bg-black/20 rounded-lg">
          <p class="text-xs text-green-200">📁 <strong>Nom du fichier :</strong></p>
          <p class="text-xs text-white font-mono break-all">${filename}</p>
        </div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="text-white/70 hover:text-white transition-colors flex-shrink-0">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Supprimer automatiquement après 12 secondes
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.animation = 'slideOutRight 0.4s ease-in';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 400);
    }
  }, 12000);
};

/**
 * Ouvre le média dans un nouvel onglet avec instructions optimisées
 */
const openMediaInNewTab = (url, filename) => {
  try {
    // Ouvrir dans un nouvel onglet
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    
    // Afficher des instructions spécialisées
    setTimeout(() => {
      showOptimizedInstructions(filename, url);
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Failed to open media in new tab:', error);
    return false;
  }
};

/**
 * Instructions optimisées selon la plateforme
 */
const showOptimizedInstructions = (filename, url) => {
  // Vérifier que url est défini
  if (!url || typeof url !== 'string') {
    console.error('URL is undefined or not a string:', url);
    url = '';
  }
  
  let platformName = 'Média';
  let specificInstructions = '';
  
  if (url.includes('snapcdn.app') || url.includes('dl.')) {
    platformName = 'Instagram (Proxy)';
    specificInstructions = '• Le média s\'ouvre dans l\'onglet<br>• Le téléchargement peut démarrer automatiquement<br>• Sinon : clic droit → "Enregistrer sous"<br>• Si erreur : l\'URL proxy a peut-être expiré (réessayez l\'extraction)';
  } else if (url.includes('cdninstagram.com') || url.includes('fbcdn.net')) {
    platformName = 'Instagram/Facebook';
    specificInstructions = '• Le média s\'affiche dans l\'onglet ouvert<br>• Clic droit sur l\'image/vidéo → "Enregistrer sous"<br>• Pour les vidéos : clic droit → "Enregistrer la vidéo sous"<br>• Si rien ne s\'affiche, l\'URL a peut-être expiré';
  } else if (url.includes('pbs.twimg.com') || url.includes('video.twimg.com')) {
    platformName = 'Twitter/X';
    specificInstructions = '• Le média s\'affiche dans l\'onglet ouvert<br>• Clic droit sur l\'image/vidéo → "Enregistrer sous"<br>• Pour les vidéos : attendez le chargement puis clic droit<br>• Si page vide, l\'URL Twitter a peut-être expiré';
  } else {
    platformName = 'Média';
    specificInstructions = '• Le fichier s\'ouvre dans l\'onglet<br>• Clic droit → "Enregistrer sous"<br>• Ou utilisez Ctrl+S pour sauvegarder';
  }
  
  // Créer une notification personnalisée améliorée
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white p-5 rounded-xl shadow-2xl z-50 max-w-sm border border-purple-400/30';
  notification.style.animation = 'slideInRight 0.4s ease-out';
  
  notification.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        <div class="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
        </div>
      </div>
      <div class="flex-1">
        <h4 class="font-bold mb-2 text-yellow-300">📱 ${platformName} ouvert dans un nouvel onglet</h4>
        <div class="text-sm opacity-95 mb-3">
          <p class="mb-2"><strong>Comment télécharger :</strong></p>
          <div class="text-xs opacity-90 leading-relaxed">
            ${specificInstructions}
          </div>
        </div>
        <div class="mt-3 p-2 bg-black/20 rounded-lg">
          <p class="text-xs text-purple-200">📁 <strong>Nom suggéré :</strong></p>
          <p class="text-xs text-white font-mono break-all">${filename}</p>
        </div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="text-white/70 hover:text-white transition-colors flex-shrink-0">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  `;
  
  // Ajouter les styles d'animation si pas déjà présents
  if (!document.getElementById('download-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'download-notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  // Supprimer automatiquement après 15 secondes
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.animation = 'slideOutRight 0.4s ease-in';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 400);
    }
  }, 15000);
};

/**
 * Téléchargement avec notification à l'utilisateur (fonction de compatibilité)
 */
export const downloadWithNotification = async (url, filename) => {
  try {
    console.log('🔄 Download request for:', filename, 'URL:', url);
    
    // TIKTOK FONCTIONNE BIEN - GARDER LE TÉLÉCHARGEMENT AUTOMATIQUE
    const isTikTokUrl = url.includes('tiktokcdn.com') || url.includes('muscdn.com');
    
    // NOUVELLES URLs INSTAGRAM CDN DIRECTES - TÉLÉCHARGEMENT AUTOMATIQUE
    const isInstagramCDN = url.includes('scontent-') && url.includes('.cdninstagram.com');
    
    // NOUVELLES URLs FACEBOOK PROXY - TÉLÉCHARGEMENT AUTOMATIQUE
    const isFacebookProxy = url.includes('ssscdn.io');
    
    // NOUVELLES URLs TWITTER DIRECTES - TÉLÉCHARGEMENT AUTOMATIQUE
    const isTwitterDirect = url.includes('video.twimg.com') || url.includes('pbs.twimg.com');
    
    // NOUVELLES URLs REDDIT - OUVERTURE DIRECTE (CORS restrictif)
    const isRedditRapidsave = url.includes('rapidsave.com');
    
    if (isTikTokUrl) {
      console.log('🎵 TikTok detected - using automatic download');
      return await downloadUltimate(url, filename);
    }
    
    if (isInstagramCDN) {
      console.log('📸 Instagram CDN detected - using automatic download');
      return await downloadUltimate(url, filename);
    }
    
    if (isFacebookProxy) {
      console.log('📘 Facebook proxy detected - using automatic download');
      return await downloadUltimate(url, filename);
    }
    
    if (isRedditRapidsave) {
      console.log('🔴 Reddit Rapidsave detected - opening directly');
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => {
        showSimpleInstructions(filename, url);
      }, 1000);
      return true;
    }
    
    // Pour les autres plateformes, ouvrir dans un nouvel onglet
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Afficher des instructions selon le type d'URL
    setTimeout(() => {
      showSimpleInstructions(filename, url);
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    return false;
  }
};

/**
 * Instructions simples et efficaces
 */
const showSimpleInstructions = (filename, url) => {
  // Détecter le type de plateforme
  let platformName = 'Média';
  let instructions = '';
  
  if (url && typeof url === 'string') {
    if (url.includes('tiktokcdn.com')) {
      platformName = 'TikTok';
      instructions = '• La vidéo se lit dans l\'onglet ouvert<br>• Clic droit sur la vidéo → "Enregistrer la vidéo sous"<br>• Ou utilisez les outils développeur (F12) pour récupérer l\'URL';
    } else if (url.includes('snapcdn.app') || url.includes('dl.')) {
      platformName = 'Instagram';
      instructions = '• Le téléchargement peut démarrer automatiquement<br>• Sinon : clic droit → "Enregistrer sous"<br>• Si page vide : l\'URL a expiré, réessayez l\'extraction';
    } else if (url.includes('cdninstagram.com') || url.includes('fbcdn.net')) {
      platformName = 'Instagram/Facebook';
      instructions = '• Clic droit sur l\'image/vidéo → "Enregistrer sous"<br>• Pour les vidéos : "Enregistrer la vidéo sous"';
    } else if (url.includes('pbs.twimg.com') || url.includes('video.twimg.com')) {
      platformName = 'Twitter/X';
      instructions = '• Clic droit sur l\'image/vidéo → "Enregistrer sous"<br>• Attendez le chargement complet avant de sauvegarder';
    } else if (url.includes('rapidsave.com')) {
      platformName = 'Reddit';
      instructions = '• Le téléchargement peut démarrer automatiquement<br>• Sinon : clic droit → "Enregistrer sous"<br>• Vérifiez votre dossier "Téléchargements"';
    } else {
      instructions = '• Clic droit → "Enregistrer sous"<br>• Ou utilisez Ctrl+S pour sauvegarder';
    }
  } else {
    instructions = '• Clic droit → "Enregistrer sous"<br>• Ou utilisez Ctrl+S pour sauvegarder';
  }
  
  // Créer une notification simple et claire
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-4 rounded-xl shadow-2xl z-50 max-w-sm border border-blue-400/30';
  notification.style.animation = 'slideInRight 0.3s ease-out';
  
  notification.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0">
        <div class="w-7 h-7 bg-blue-400 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-blue-900" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
        </div>
      </div>
      <div class="flex-1">
        <h4 class="font-bold mb-2 text-blue-200">📱 ${platformName} ouvert</h4>
        <div class="text-sm mb-3">
          <p class="mb-2"><strong>Comment télécharger :</strong></p>
          <div class="text-xs leading-relaxed opacity-90">
            ${instructions}
          </div>
        </div>
        <div class="mt-2 p-2 bg-black/20 rounded">
          <p class="text-xs text-blue-200">📁 ${filename}</p>
        </div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="text-white/70 hover:text-white">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Supprimer après 10 secondes
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }
  }, 10000);
};
/**

 * Téléchargement par chunks pour contourner les restrictions
 */
const downloadWithChunks = async (url, filename) => {
  try {
    // Essayer de télécharger par petits chunks
    const response = await fetch(url, {
      method: 'HEAD' // D'abord vérifier si l'URL est accessible
    });
    
    if (!response.ok) {
      throw new Error('URL not accessible');
    }
    
    // Si accessible, essayer le téléchargement complet
    const fullResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.tiktok.com/',
        'Origin': 'https://www.tiktok.com'
      }
    });
    
    if (fullResponse.ok) {
      const blob = await fullResponse.blob();
      downloadBlob(blob, filename);
      showDownloadNotification(filename, 'Téléchargement réussi !');
      return true;
    }
    
    throw new Error('Chunk download failed');
  } catch (error) {
    console.error('Chunk download error:', error);
    return false;
  }
};

/**
 * Solution ultime : Téléchargement avec service worker
 */
const downloadWithServiceWorker = async (url, filename) => {
  try {
    // Créer un service worker temporaire pour gérer le téléchargement
    const swCode = `
      self.addEventListener('fetch', function(event) {
        if (event.request.url.includes('tiktokcdn.com')) {
          event.respondWith(
            fetch(event.request, {
              mode: 'cors',
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://www.tiktok.com/'
              }
            })
          );
        }
      });
    `;
    
    const blob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    // Enregistrer le service worker
    const registration = await navigator.serviceWorker.register(swUrl);
    
    // Attendre qu'il soit actif
    await new Promise((resolve) => {
      if (registration.active) {
        resolve();
      } else {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              resolve();
            }
          });
        });
      }
    });
    
    // Maintenant essayer le téléchargement
    const response = await fetch(url);
    if (response.ok) {
      const blob = await response.blob();
      downloadBlob(blob, filename);
      showDownloadNotification(filename, 'Téléchargement réussi !');
      
      // Nettoyer le service worker
      registration.unregister();
      URL.revokeObjectURL(swUrl);
      
      return true;
    }
    
    throw new Error('Service worker download failed');
  } catch (error) {
    console.error('Service worker download error:', error);
    return false;
  }
};

/**
 * Fonction de téléchargement ultime qui essaie toutes les méthodes
 */
export const downloadUltimate = async (url, filename) => {
  console.log('🚀 Starting ultimate download for:', filename);
  
  // Méthode 1: Téléchargement par chunks avec headers spéciaux
  try {
    const success = await downloadWithChunks(url, filename);
    if (success) {
      console.log('✅ Chunk download successful');
      return true;
    }
  } catch (error) {
    console.log('❌ Chunk download failed:', error.message);
  }
  
  // Méthode 2: Service Worker (si supporté)
  if ('serviceWorker' in navigator) {
    try {
      const success = await downloadWithServiceWorker(url, filename);
      if (success) {
        console.log('✅ Service worker download successful');
        return true;
      }
    } catch (error) {
      console.log('❌ Service worker download failed:', error.message);
    }
  }
  
  // Méthode 3: Téléchargement direct avec tous les headers possibles
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Accept': 'video/mp4,video/*,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Fetch-Dest': 'video',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (response.ok) {
      const blob = await response.blob();
      downloadBlob(blob, filename);
      showDownloadNotification(filename, 'Téléchargement réussi !');
      console.log('✅ Direct download with headers successful');
      return true;
    }
  } catch (error) {
    console.log('❌ Direct download with headers failed:', error.message);
  }
  
  // Méthode 4: Fallback avec instructions améliorées
  console.log('🔄 Using fallback method with enhanced instructions');
  return downloadFallbackMethod(url, filename);
};