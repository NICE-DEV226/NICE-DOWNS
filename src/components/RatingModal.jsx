import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, X, Heart, ThumbsUp, MessageCircle } from 'lucide-react';

const RatingModal = ({ isOpen, onClose, onSubmit, downloadInfo }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Veuillez donner une note avant de soumettre');
      return;
    }

    setIsSubmitting(true);
    
    const ratingData = {
      rating,
      comment: comment.trim(),
      category,
      platform: downloadInfo?.platform,
      url: downloadInfo?.url,
      downloadTime: downloadInfo?.downloadTime,
      fileSize: downloadInfo?.fileSize,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      browserInfo: {
        language: navigator.language,
        platform: navigator.platform
      }
    };

    try {
      await onSubmit(ratingData);
      // Reset form
      setRating(0);
      setComment('');
      setCategory('general');
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (stars) => {
    switch (stars) {
      case 1: return 'Très mauvais';
      case 2: return 'Mauvais';
      case 3: return 'Correct';
      case 4: return 'Bon';
      case 5: return 'Excellent';
      default: return 'Cliquez pour noter';
    }
  };

  const categories = [
    { value: 'general', label: 'Expérience générale', icon: Heart },
    { value: 'speed', label: 'Vitesse de téléchargement', icon: ThumbsUp },
    { value: 'quality', label: 'Qualité du fichier', icon: Star },
    { value: 'interface', label: 'Interface utilisateur', icon: MessageCircle }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-4 sm:p-6 w-full max-w-md mx-4 relative max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Évaluez votre expérience</h3>
              <p className="text-gray-400 text-sm">
                Votre avis nous aide à améliorer NICE-Downs
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Que souhaitez-vous évaluer ?
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                          category === cat.value
                            ? 'bg-purple-600/20 border-purple-400/50 text-purple-300'
                            : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm font-medium text-left">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Star Rating */}
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Votre note
                </label>
                <div className="flex justify-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  {getRatingText(hoveredRating || rating)}
                </p>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre expérience avec NICE-Downs..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                  rows="3"
                  maxLength="500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {comment.length}/500 caractères
                </p>
              </div>

              {/* Download Info */}
              {downloadInfo && (
                <div className="p-3 bg-gray-700/30 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Téléchargement évalué :</p>
                  <p className="text-sm text-white font-medium">{downloadInfo.platform}</p>
                  {downloadInfo.downloadTime && (
                    <p className="text-xs text-gray-400">
                      Temps : {downloadInfo.downloadTime}s
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors font-medium"
                >
                  Plus tard
                </button>
                <button
                  type="submit"
                  disabled={rating === 0 || isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-all font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Envoyer la note
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-700 text-center">
              <p className="text-xs text-gray-500">
                🇧🇫 Merci de nous aider à améliorer NICE-Downs !
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RatingModal;