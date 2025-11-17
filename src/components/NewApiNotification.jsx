import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowRight } from 'lucide-react';

const NewApiNotification = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu cette notification
    const hasSeenNotification = localStorage.getItem('nice-downs-new-api-notification');
    
    if (!hasSeenNotification) {
      // Afficher la notification après 3 secondes
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('nice-downs-new-api-notification', 'seen');
  };

  const handleLearnMore = () => {
    // Scroll vers le sélecteur d'API
    document.querySelector('[data-testid="api-selector"]')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
    handleClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50"
        >
          <div className="bg-gradient-to-r from-neon-blue/90 to-neon-purple/90 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex-shrink-0"
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">
                  🎉 Nouvelles APIs disponibles !
                </h3>
                <p className="text-white/90 text-sm mb-3">
                  Des APIs plus rapides et stables pour TikTok, Facebook et Twitter sont maintenant disponibles.
                </p>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLearnMore}
                    className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  >
                    Découvrir
                    <ArrowRight className="h-3 w-3" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 text-white" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NewApiNotification;