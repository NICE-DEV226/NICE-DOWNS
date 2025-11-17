// Configuration de l'application NICE-Downs

export const APP_CONFIG = {
  name: 'NICE-Downs',
  version: '1.0.0',
  description: 'Téléchargeur multiplateforme gratuit',
  author: 'NICE-Downs Team',
  website: 'https://nice-downs.com',
  repository: 'https://github.com/nice-downs/nice-downs'
};

export const API_CONFIG = {
  baseUrl: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api`,
  timeout: 30000,
  retryAttempts: 3
};

export const SUPPORTED_FORMATS = {
  video: ['MP4', 'WEBM', 'AVI', 'MOV'],
  audio: ['MP3', 'WAV', 'AAC', 'OGG'],
  image: ['JPG', 'PNG', 'GIF', 'WEBP'],
  document: ['PDF', 'DOC', 'DOCX']
};

export const PLATFORM_LIMITS = {
  maxFileSize: 500 * 1024 * 1024, // 500MB
  maxDuration: 3600, // 1 heure en secondes
  dailyDownloads: 100,
  concurrentDownloads: 3
};

export const UI_CONFIG = {
  animations: {
    duration: 300,
    easing: 'ease-in-out'
  },
  toast: {
    duration: 4000,
    maxToasts: 5
  },
  loader: {
    minDisplayTime: 1000 // Temps minimum d'affichage du loader
  }
};

export const ROUTES = {
  home: '/',
  result: '/result',
  about: '/about',
  contact: '/contact',
  privacy: '/privacy',
  terms: '/terms'
};

export const SOCIAL_LINKS = {
  github: 'https://github.com/nice-downs',
  twitter: 'https://twitter.com/nicedowns',
  discord: 'https://discord.gg/nicedowns',
  email: 'contact@nice-downs.com'
};

export const ANALYTICS = {
  googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN
};

// Messages d'erreur standardisés
export const ERROR_MESSAGES = {
  invalidUrl: 'URL invalide. Veuillez entrer une URL valide.',
  unsupportedPlatform: 'Plateforme non supportée. Vérifiez que l\'URL provient d\'une plateforme supportée.',
  networkError: 'Erreur de connexion. Vérifiez votre connexion internet.',
  serverError: 'Erreur serveur. Veuillez réessayer plus tard.',
  fileTooLarge: 'Fichier trop volumineux. Taille maximale autorisée : 500MB.',
  dailyLimitReached: 'Limite quotidienne atteinte. Revenez demain !',
  concurrentLimitReached: 'Trop de téléchargements simultanés. Attendez qu\'un téléchargement se termine.',
  contentNotFound: 'Contenu introuvable. Vérifiez que le lien est correct et que le contenu est public.',
  contentPrivate: 'Contenu privé. Impossible de télécharger du contenu privé.',
  rateLimited: 'Trop de requêtes. Veuillez patienter avant de réessayer.'
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  downloadStarted: 'Téléchargement démarré !',
  downloadCompleted: 'Téléchargement terminé avec succès !',
  linkCopied: 'Lien copié dans le presse-papiers !',
  messageSent: 'Message envoyé avec succès !',
  subscribed: 'Inscription réussie !'
};

// Configuration des plateformes
export const PLATFORM_CONFIG = {
  tiktok: {
    name: 'TikTok',
    domains: ['tiktok.com', 'vm.tiktok.com'],
    supportedFormats: ['MP4', 'MP3'],
    maxDuration: 600, // 10 minutes
    apiEndpoint: '/api/tiktok'
  },
  instagram: {
    name: 'Instagram',
    domains: ['instagram.com', 'instagr.am'],
    supportedFormats: ['JPG', 'MP4'],
    maxDuration: 3600, // 1 heure
    apiEndpoint: '/api/instagram'
  },
  youtube: {
    name: 'YouTube',
    domains: ['youtube.com', 'youtu.be', 'm.youtube.com'],
    supportedFormats: ['MP4', 'MP3', 'WEBM'],
    maxDuration: 7200, // 2 heures
    apiEndpoint: '/api/youtube'
  },
  facebook: {
    name: 'Facebook',
    domains: ['facebook.com', 'fb.com', 'm.facebook.com'],
    supportedFormats: ['MP4', 'JPG'],
    maxDuration: 3600, // 1 heure
    apiEndpoint: '/api/facebook'
  },
  pinterest: {
    name: 'Pinterest',
    domains: ['pinterest.com', 'pin.it'],
    supportedFormats: ['JPG', 'PNG'],
    maxDuration: 0, // Images uniquement
    apiEndpoint: '/api/pinterest'
  },
  twitter: {
    name: 'X (Twitter)',
    domains: ['twitter.com', 'x.com', 't.co'],
    supportedFormats: ['MP4', 'GIF', 'JPG'],
    maxDuration: 140, // 2 minutes 20 secondes
    apiEndpoint: '/api/twitter'
  }
};