import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Link as LinkIcon, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { supportedPlatforms, validateUrl, getPlatformFromUrl } from '../utils/platforms';
import { isInstagramUsername } from '../services/apiService';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { useToastContext } from '../components/ToastProvider';

const Home = () => {
  const navigate = useNavigate();
  const [inputUrl, setInputUrl] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState(null);
  const { success } = useToastContext();
  
  const { 
    isLoading, 
    error, 
    downloadContent, 
    clearError, 
    setUrl,
    detectPlatform
  } = useAppStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputUrl.trim()) return;

    // Vérifier si c'est un nom d'utilisateur Instagram pour les stories
    const isUsername = isInstagramUsername(inputUrl.trim());
    
    if (!isUsername && !validateUrl(inputUrl)) {
      useAppStore.getState().setError('URL invalide ou nom d\'utilisateur Instagram invalide. Veuillez entrer une URL valide ou un nom d\'utilisateur Instagram.');
      return;
    }

    if (!isUsername) {
      const platform = getPlatformFromUrl(inputUrl);
      if (!platform) {
        useAppStore.getState().setError('Plateforme non supportée. Vérifiez que l\'URL provient d\'une plateforme supportée.');
        return;
      }
    }

    setUrl(inputUrl);
    await downloadContent(inputUrl);
    
    if (isUsername) {
      success('Stories Instagram extraites ! ', 5000);
    } else {
      success('Vidéo extraite avec succès ! ', 5000);
    }
    navigate('/result');
  };

  // Fonction pour détecter la plateforme et mettre à jour le badge
  const handleInputChange = (value) => {
    setInputUrl(value);
    
    // Détecter la plateforme si c'est une URL
    if (value.trim() && !isInstagramUsername(value.trim())) {
      const platform = getPlatformFromUrl(value);
      setDetectedPlatform(platform);
    } else {
      setDetectedPlatform(null);
    }
  };

  const handlePlatformClick = (platform) => {
    const exampleUrls = {
      'TikTok': 'https://vt.tiktok.com/ZSNvs6h6o',
      'Instagram': 'https://www.instagram.com/reel/C2RszEzplgq/?igsh=MzRlODBiNWFlZA==',
      'Facebook': 'https://www.facebook.com/100000959749712/posts/pfbid0288xi44nvodK9d7r3wf4LHeM3dtEsVghQXmz5t59axwz7KdLStYyg4qfvTVrAL27Ll/?app=fbl',
      'X (Twitter)': 'https://x.com/elonmusk/status/1234567890',
      'Reddit': 'https://www.reddit.com/r/videography/comments/18wfyjy/my_updated_2024_demo_reel_would_love_some_feedback'
    };
    
    // Pour Instagram, alterner entre URL et nom d'utilisateur pour stories
    if (platform.name === 'Instagram') {
      const examples = [
        'https://www.instagram.com/reel/C2RszEzplgq/?igsh=MzRlODBiNWFlZA==',
        'sparky.drip'
      ];
      const randomExample = examples[Math.floor(Math.random() * examples.length)];
      handleInputChange(randomExample);
    } else {
      handleInputChange(exampleUrls[platform.name] || '');
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Ultra Rapide',
      description: 'Téléchargements instantanés avec notre technologie optimisée',
      color: 'text-yellow-600'
    },
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Vos données sont protégées, aucune information stockée',
      color: 'text-green-600'
    },
    {
      icon: Globe,
      title: 'Multi-plateformes',
      description: 'Support de TikTok, Facebook, Twitter et bien plus',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen pt-16" style={{background: 'linear-gradient(to right, #222035 0%, #222035 100%)'}}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern futuriste */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-80 h-80 bg-cyan-500/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        {/* Grille futuriste */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative container-section section-padding">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 badge-primary mb-8"
            >
              <Sparkles className="h-4 w-4" />
              Téléchargement Multiplateforme Gratuit
            </motion.div>

            {/* Titre principal */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="heading-xl mb-6"
            >
              Téléchargez vos contenus{' '}
              <span className="gradient-text">préférés</span>{' '}
              en un clic
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lead mb-12 max-w-2xl mx-auto"
            >
              Téléchargez facilement vos vidéos et images depuis TikTok, Facebook, 
              Twitter et Instagram. Simple, rapide et gratuit.
            </motion.p>

            {/* Formulaire */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto mb-16"
            >
              {error && (
                <div className="mb-6">
                  <ErrorMessage
                    message={error}
                    onClose={clearError}
                    onRetry={() => clearError()}
                    url={inputUrl}
                    platform={detectedPlatform?.name || 'Inconnue'}
                  />
                </div>
              )}

              {isLoading ? (
                <div className="card p-8">
                  <Loader message="Extraction en cours..." />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="relative mb-6">
                    <LinkIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                    <input
                      type="text"
                      value={inputUrl}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder="Collez votre lien ici ou nom d'utilisateur Instagram pour stories (ex: sparky.drip)"
                      className="input pl-14 pr-6 text-lg h-16 w-full"
                      required
                    />
                    
                    {/* Badge intelligent de détection de plateforme */}
                    {detectedPlatform && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={`absolute -bottom-12 left-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium shadow-xl border border-white/20 bg-gradient-to-r ${detectedPlatform.color} z-50`}
                        style={{
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(139, 92, 246, 0.2)'
                        }}
                      >
                        <div className="w-4 h-4 flex items-center justify-center bg-white/20 rounded-full">
                          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d={detectedPlatform.iconPath} />
                          </svg>
                        </div>
                        <span className="text-white font-semibold">{detectedPlatform.name}</span>
                        <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse"></div>
                      </motion.div>
                    )}
                  </div>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!inputUrl.trim() || isLoading}
                    className="btn-primary w-full h-16 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative z-10"
                  >
                    <Sparkles className="h-6 w-6" />
                    <span>Télécharger</span>
                    <ArrowRight className="h-5 w-5 ml-1" />
                  </motion.button>
                </form>
              )}

              {/* Indicateurs de confiance */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-10 text-sm">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/10 border border-green-400/20"
                >
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-green-300 font-medium">100% Gratuit</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-500/10 border border-blue-400/20"
                >
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 font-medium">Aucune inscription</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-purple-500/10 border border-purple-400/20"
                >
                  <CheckCircle className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-300 font-medium">Sécurisé</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Plateformes supportées */}
      <section className="section-padding" style={{background: 'rgba(42, 45, 71, 0.3)'}}>
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">
              Plateformes Supportées
            </h2>
            <p className="text-lead max-w-2xl mx-auto">
              Téléchargez depuis vos plateformes préférées
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {supportedPlatforms.map((platform, index) => (
              <motion.button
                key={platform.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -8,
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 }
                }}
                onClick={() => handlePlatformClick(platform)}
                className="platform-card"
              >
                <div className={`platform-icon bg-gradient-to-r ${platform.color}`}>
                  <svg className="h-6 w-6 sm:h-7 sm:w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d={platform.iconPath} />
                  </svg>
                </div>
                <h3 className="font-semibold text-white mb-1 text-xs sm:text-sm">{platform.name}</h3>
                <p className="text-xs text-gray-400 hidden sm:block">
                  {platform.formats.join(', ')}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="section-padding">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">
              Pourquoi choisir NICE-Downs ?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="card-hover p-8 text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${feature.color}`} 
                     style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="heading-md mb-4 text-xl">
                  {feature.title}
                </h3>
                <p className="text-body">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-purple-600 to-indigo-600 relative overflow-hidden">
        {/* Effets de fond futuristes */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/5 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-400/10 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container-section text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prêt à télécharger ?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers d'utilisateurs qui font confiance à NICE-Downs
            </p>
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(255, 255, 255, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.querySelector('input[type="url"]')?.focus()}
              className="bg-white/90 backdrop-blur-sm text-purple-600 font-semibold px-8 py-4 rounded-xl hover:bg-white transition-all duration-300 shadow-2xl border border-white/20"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7))',
                backdropFilter: 'blur(10px)'
              }}
            >
              Commencer maintenant
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;