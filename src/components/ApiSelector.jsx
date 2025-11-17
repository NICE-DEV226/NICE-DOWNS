import { motion } from 'framer-motion';
import { Zap, Cpu, Info } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const ApiSelector = () => {
  const { preferNewAPI, setPreferNewAPI } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
      data-testid="api-selector"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">
            Sélection des APIs
          </h3>
          <p className="text-white/60 text-sm">
            Choisissez quelle API utiliser en priorité
          </p>
        </div>
        
        <Info className="h-5 w-5 text-white/40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nouvelles APIs */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPreferNewAPI(true)}
          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
            preferNewAPI
              ? 'border-neon-blue bg-neon-blue/20'
              : 'border-white/20 hover:border-white/40 bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${
              preferNewAPI ? 'bg-neon-blue/30' : 'bg-white/10'
            }`}>
              <Zap className={`h-5 w-5 ${
                preferNewAPI ? 'text-neon-blue' : 'text-white/60'
              }`} />
            </div>
            <div>
              <h4 className={`font-semibold ${
                preferNewAPI ? 'text-neon-blue' : 'text-white'
              }`}>
                Nouvelles APIs
              </h4>
              <p className="text-xs text-white/60">
                api-aswin-sparky.koyeb.app
              </p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white/80">TikTok, Facebook, Twitter</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-white/80">Plus rapide et stable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-white/80">Pas de clé API requise</span>
            </div>
          </div>
        </motion.button>

        {/* Anciennes APIs */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPreferNewAPI(false)}
          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
            !preferNewAPI
              ? 'border-neon-purple bg-neon-purple/20'
              : 'border-white/20 hover:border-white/40 bg-white/5'
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${
              !preferNewAPI ? 'bg-neon-purple/30' : 'bg-white/10'
            }`}>
              <Cpu className={`h-5 w-5 ${
                !preferNewAPI ? 'text-neon-purple' : 'text-white/60'
              }`} />
            </div>
            <div>
              <h4 className={`font-semibold ${
                !preferNewAPI ? 'text-neon-purple' : 'text-white'
              }`}>
                Anciennes APIs
              </h4>
              <p className="text-xs text-white/60">
                api.neoxr.eu
              </p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-white/80">YouTube, Instagram, Pinterest</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span className="text-white/80">Plus de plateformes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="text-white/80">Clé API requise</span>
            </div>
          </div>
        </motion.button>
      </div>

      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-blue-100 text-sm">
          💡 <strong>Astuce :</strong> L'application essaiera automatiquement l'autre API si la première échoue.
        </p>
      </div>
    </motion.div>
  );
};

export default ApiSelector;