import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Send, CheckCircle, X } from 'lucide-react';
import { sendErrorReport } from '../services/errorReportService';

const ErrorReportButton = ({ url, platform, error, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reportData = {
        url,
        platform,
        error,
        description,
        userDescription: description
      };

      const result = await sendErrorReport(reportData);
      
      if (result.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          onClose && onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-lg text-green-300"
      >
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Rapport envoyé !</span>
      </motion.div>
    );
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all font-medium"
      >
        <AlertTriangle className="h-4 w-4" />
        <span>Signaler l'erreur</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 max-w-md w-full border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Signaler une erreur</h3>
                    <p className="text-gray-400 text-sm">Aidez-nous à améliorer le service</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Plateforme
                  </label>
                  <div className="px-3 py-2 bg-purple-500/10 border border-purple-400/30 rounded-lg text-purple-300 text-sm font-medium">
                    {platform}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL concernée
                  </label>
                  <div className="px-3 py-2 bg-gray-700/50 rounded-lg text-gray-300 text-sm break-all max-h-20 overflow-y-auto">
                    {url}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message d'erreur
                  </label>
                  <div className="px-3 py-2 bg-red-500/10 border border-red-400/30 rounded-lg text-red-300 text-sm">
                    {error}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Décrivez le problème <span className="text-gray-500">(optionnel)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Que s'est-il passé exactement ? Avez-vous des détails supplémentaires ?"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                    rows={3}
                    maxLength="500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {description.length}/500 caractères
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center justify-center gap-2 font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Envoyer le rapport
                    </>
                  )}
                </button>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-gray-700 text-center">
                <p className="text-xs text-gray-500">
                  🇧🇫 Votre rapport nous aide à améliorer NICE-Downs
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ErrorReportButton;