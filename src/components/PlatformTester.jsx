import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Copy, ExternalLink } from 'lucide-react';
import { supportedPlatforms } from '../utils/platforms';
import { useToastContext } from './ToastProvider';

const PlatformTester = ({ onUrlSelect }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const { success } = useToastContext();

  const testUrls = {
    'TikTok': [
      'https://vt.tiktok.com/ZSNvs6h6o',
      'https://www.tiktok.com/@nikenandalusia/video/7480894024082050309',
      'https://vm.tiktok.com/ZMhQQQQQQ/',
    ],
    'YouTube': [
      'https://www.youtube.com/watch?v=fKRtnMYMW08',
      'https://youtu.be/dQw4w9WgXcQ',
    ],
    'Facebook': [
      'https://www.facebook.com/100000959749712/posts/pfbid0288xi44nvodK9d7r3wf4LHeM3dtEsVghQXmz5t59axwz7KdLStYyg4qfvTVrAL27Ll/?app=fbl',
      'https://www.facebook.com/share/r/176Gd2Y3F5/',
    ],
    'X (Twitter)': [
      'https://twitter.com/TeamAbhiSha/status/1743351410761019794?t=vms8wxcU0mQuhVxwGCHjFw&s=19',
      'https://twitter.com/mosidik/status/1475812845249957889',
    ],
    'Instagram': [
      'https://www.instagram.com/p/ABC123/',
      'https://www.instagram.com/reel/DEF456/',
    ],
    'Pinterest': [
      'https://www.pinterest.com/pin/1234567890/',
      'https://pin.it/example123',
    ]
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    success('URL copiée dans le presse-papiers !');
  };

  const handleUseUrl = (url) => {
    onUrlSelect(url);
    success('URL sélectionnée !');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card mt-8"
    >
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Play className="h-5 w-5 text-neon-blue" />
        Tester avec des URLs d'exemple
      </h3>
      
      <p className="text-white/60 mb-6">
        Sélectionnez une plateforme pour voir des URLs de test et tester l'API
      </p>

      {/* Sélection de plateforme */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {supportedPlatforms.map((platform) => (
          <motion.button
            key={platform.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedPlatform(platform.name)}
            className={`p-3 rounded-xl border-2 transition-all duration-300 ${
              selectedPlatform === platform.name
                ? 'border-neon-blue bg-neon-blue/20'
                : 'border-white/20 hover:border-white/40 bg-white/5'
            }`}
          >
            <div className={`p-2 rounded-lg bg-gradient-to-r ${platform.color} mb-2 mx-auto w-fit`}>
              <platform.icon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-white">{platform.name}</span>
          </motion.button>
        ))}
      </div>

      {/* URLs d'exemple */}
      {selectedPlatform && testUrls[selectedPlatform] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          <h4 className="text-white font-medium">URLs de test pour {selectedPlatform} :</h4>
          
          {testUrls[selectedPlatform].map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-3 flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-sm font-mono truncate">{url}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleCopyUrl(url)}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Copier l'URL"
                >
                  <Copy className="h-4 w-4 text-white/80" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleUseUrl(url)}
                  className="p-2 bg-neon-blue/20 hover:bg-neon-blue/30 rounded-lg transition-colors"
                  title="Utiliser cette URL"
                >
                  <ExternalLink className="h-4 w-4 text-neon-blue" />
                </motion.button>
              </div>
            </motion.div>
          ))}
          
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-100 text-sm">
              💡 <strong>Astuce :</strong> Cliquez sur l'icône de lien pour utiliser directement l'URL dans le champ de téléchargement.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PlatformTester;