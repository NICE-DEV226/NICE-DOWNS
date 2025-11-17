import { create } from 'zustand';
import { downloadContent, detectPlatformFromUrl } from '../services/apiService';

const useAppStore = create((set, get) => ({
  // État de l'URL
  url: '',
  setUrl: (url) => set({ url }),
  
  // État de chargement
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  
  // Données de prévisualisation
  previewData: null,
  setPreviewData: (data) => set({ previewData: data, downloadResult: data }),
  
  // Résultat de téléchargement (pour compatibilité avec Result.jsx)
  downloadResult: null,
  
  // Statut de téléchargement
  downloadStatus: 'ready', // 'ready', 'downloading', 'completed', 'error'
  setDownloadStatus: (status) => set({ downloadStatus: status }),
  
  // Informations de téléchargement
  downloadInfo: null,
  setDownloadInfo: (info) => set({ downloadInfo: info }),
  
  // Fonction pour nettoyer les résultats
  clearResult: () => set({ 
    previewData: null, 
    downloadResult: null, 
    url: '', 
    error: null, 
    downloadStatus: 'ready',
    downloadInfo: null 
  }),
  
  // Erreurs
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  // Plateforme détectée
  detectedPlatform: null,
  setDetectedPlatform: (platform) => set({ detectedPlatform: platform }),
  
  // Mode de fonctionnement (mock ou real)
  useRealAPI: true,
  setUseRealAPI: (useReal) => set({ useRealAPI: useReal }),
  
  // Fonction pour détecter la plateforme depuis l'URL
  detectPlatform: (url) => {
    const platform = detectPlatformFromUrl(url);
    const platformNames = {
      'tiktok': 'TikTok',
      'instagram': 'Instagram',
      'facebook': 'Facebook',
      'pinterest': 'Pinterest',
      'youtube': 'YouTube',
      'twitter': 'X (Twitter)',
      'reddit': 'Reddit'
    };
    
    const displayName = platform ? platformNames[platform] : null;
    set({ detectedPlatform: displayName });
    return displayName;
  },
  
  // Fonction pour télécharger du contenu et démarrer le téléchargement automatiquement
  downloadContent: async (url) => {
    const { setLoading, setError, setPreviewData, useRealAPI } = get();
    
    setLoading(true);
    setError(null);
    
    try {
      if (useRealAPI) {
        // Utiliser la nouvelle API
        const data = await downloadContent(url);
        setPreviewData(data);
        
        // Les données sont maintenant disponibles dans Result.jsx
        // L'utilisateur peut choisir le format qu'il veut télécharger
      } else {
        // Mode simulation (fallback)
        await get().simulateDownload(url);
      }
    } catch (error) {
      console.error('Erreur de téléchargement:', error);
      setError(error.message || 'Une erreur est survenue lors du téléchargement');
      
      // En cas d'erreur API, basculer vers le mode simulation
      if (useRealAPI) {
        console.log('Basculement vers le mode simulation...');
        set({ useRealAPI: false });
        await get().simulateDownload(url);
      }
    } finally {
      setLoading(false);
    }
  },
  
  // Fonction pour simuler le téléchargement (fallback)
  simulateDownload: async (url) => {
    const { detectPlatform, setError, setPreviewData } = get();
    
    try {
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const platform = detectPlatform(url);
      
      if (!platform) {
        throw new Error('Plateforme non supportée ou URL invalide');
      }
      
      // Données mockées selon la plateforme
      const mockData = {
        'TikTok': {
          platform: 'TikTok',
          title: 'Danse de chat drôle 😹',
          thumbnail: 'https://via.placeholder.com/300x200/FF0080/FFFFFF?text=TikTok+Video',
          formats: [
            { type: 'MP4', url: '#', size: '~15MB' },
            { type: 'MP3', url: '#', size: '~3MB' }
          ],
          duration: '0:15',
          author: '@funnycats'
        },
        'Instagram': {
          platform: 'Instagram',
          title: 'Photo de coucher de soleil magnifique',
          thumbnail: 'https://via.placeholder.com/300x200/E4405F/FFFFFF?text=Instagram+Post',
          formats: [
            { type: 'JPG', url: '#', size: '~2MB' },
            { type: 'MP4', url: '#', size: '~10MB' }
          ],
          author: '@photographer'
        },
        'YouTube': {
          platform: 'YouTube',
          title: 'Tutoriel React - Hooks avancés',
          thumbnail: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=YouTube+Video',
          formats: [
            { type: 'MP4', url: '#', size: '~50MB' },
            { type: 'MP3', url: '#', size: '~5MB' }
          ],
          duration: '12:34',
          author: 'DevChannel'
        },
        'Facebook': {
          platform: 'Facebook',
          title: 'Vidéo de famille amusante',
          thumbnail: 'https://via.placeholder.com/300x200/1877F2/FFFFFF?text=Facebook+Video',
          formats: [
            { type: 'MP4', url: '#', size: '~25MB' }
          ],
          duration: '2:45',
          author: 'John Doe'
        },
        'Pinterest': {
          platform: 'Pinterest',
          title: 'Idées de décoration moderne',
          thumbnail: 'https://via.placeholder.com/300x200/BD081C/FFFFFF?text=Pinterest+Pin',
          formats: [
            { type: 'JPG', url: '#', size: '~2MB' }
          ],
          author: 'HomeDesign'
        },
        'X (Twitter)': {
          platform: 'X (Twitter)',
          title: 'Tweet viral avec vidéo',
          thumbnail: 'https://via.placeholder.com/300x200/000000/FFFFFF?text=X+Video',
          formats: [
            { type: 'MP4', url: '#', size: '~8MB' }
          ],
          duration: '0:30',
          author: '@viral_account'
        }
      };
      
      const data = mockData[platform] || {
        platform: platform,
        title: 'Contenu multimédia',
        thumbnail: 'https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Media+Content',
        formats: [{ type: 'MP4', url: '#', size: '~5MB' }],
        author: 'Unknown'
      };
      
      setPreviewData(data);
      
    } catch (error) {
      setError(error.message);
    }
  },
  
  // Reset de l'état
  reset: () => set({
    url: '',
    isLoading: false,
    previewData: null,
    error: null,
    detectedPlatform: null
  })
}));

export default useAppStore;