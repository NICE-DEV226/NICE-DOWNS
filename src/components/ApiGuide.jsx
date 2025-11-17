import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const ApiGuide = () => {
  const [isOpen, setIsOpen] = useState(false);

  const faqs = [
    {
      question: "Pourquoi l'API semble 'hors ligne' mais les téléchargements fonctionnent ?",
      answer: "Le test de statut API utilise une vérification simple qui peut échouer même si l'API fonctionne. Les téléchargements utilisent des endpoints spécifiques qui peuvent être disponibles.",
      icon: AlertTriangle,
      color: "text-yellow-400"
    },
    {
      question: "Quelle est la différence entre mode API et Simulation ?",
      answer: "Mode API : téléchargements réels avec vraies données. Mode Simulation : données mockées pour tester l'interface sans utiliser l'API.",
      icon: Info,
      color: "text-blue-400"
    },
    {
      question: "Comment savoir si mes téléchargements sont réels ?",
      answer: "Regardez les badges 'API' sur les formats de téléchargement et testez avec le bouton 'Tester l'API' sur la page d'accueil.",
      icon: CheckCircle,
      color: "text-green-400"
    }
  ];

  return (
    <>
      {/* Bouton d'aide */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3 bg-neon-blue rounded-full shadow-lg hover:shadow-xl transition-shadow"
        title="Aide sur l'API"
      >
        <HelpCircle className="h-6 w-6 text-white" />
      </motion.button>

      {/* Modal d'aide */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50"
            >
              <div className="bg-slate-900/95 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-h-full overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Guide de l'API NICE-Downs
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-white/80" />
                  </motion.button>
                </div>

                {/* FAQ */}
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3">
                        <faq.icon className={`h-5 w-5 ${faq.color} flex-shrink-0 mt-0.5`} />
                        <div>
                          <h3 className="font-semibold text-white mb-2">
                            {faq.question}
                          </h3>
                          <p className="text-white/80 text-sm leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(false)}
                    className="btn-primary flex-1"
                  >
                    Compris !
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsOpen(false);
                      // Scroll vers le testeur d'API
                      document.querySelector('[data-testid="api-tester"]')?.scrollIntoView({ 
                        behavior: 'smooth' 
                      });
                    }}
                    className="btn-secondary flex-1"
                  >
                    Tester l'API
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ApiGuide;