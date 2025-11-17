import { motion } from 'framer-motion';
import { Settings, Clock, Shield, Wrench, ArrowLeft } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'}}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl p-8 text-center"
      >
        {/* Logo et icône de maintenance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <Settings className="h-12 w-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <Wrench className="h-4 w-4 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Titre principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Maintenance en cours
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            NICE-Downs est temporairement indisponible
          </p>
        </motion.div>

        {/* Message détaillé */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Amélioration en cours</h2>
          </div>
          
          <p className="text-gray-300 leading-relaxed mb-6">
            Nous effectuons actuellement des améliorations sur notre plateforme pour vous offrir 
            une meilleure expérience de téléchargement. Cette maintenance permettra d'optimiser 
            les performances et d'ajouter de nouvelles fonctionnalités.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-green-400">
              <Shield className="h-4 w-4" />
              <span>Sécurité renforcée</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Settings className="h-4 w-4" />
              <span>Optimisations</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Wrench className="h-4 w-4" />
              <span>Nouvelles fonctionnalités</span>
            </div>
          </div>
        </motion.div>

        {/* Informations de contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-white mb-3">Besoin d'aide ?</h3>
          <p className="text-gray-400 text-sm mb-4">
            Si vous avez des questions urgentes, n'hésitez pas à nous contacter
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="mailto:nicedev226@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              <span>📧</span>
              Nous contacter
            </a>
            <a 
              href="https://x.com/NiceDEVbf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              <span>🐦</span>
              Suivre les mises à jour
            </a>
          </div>
        </motion.div>

        {/* Estimation de temps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-400 text-sm mb-4">
            Temps estimé de maintenance : <span className="text-yellow-400 font-medium">En cours...</span>
          </p>
          <p className="text-xs text-gray-500">
            Cette page se mettra à jour automatiquement une fois la maintenance terminée
          </p>
        </motion.div>

        {/* Footer avec signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">🇧🇫 Développé avec ❤️ par <span className="font-semibold text-purple-400">NICE-DEV</span></p>
            <p>Burkina Faso - 2025 • Merci pour votre patience</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Animation de particules en arrière-plan */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MaintenancePage;