import { motion } from 'framer-motion';
import { AlertCircle, X, RefreshCw } from 'lucide-react';
import ErrorReportButton from './ErrorReportButton';

const ErrorMessage = ({
  message,
  onClose,
  onRetry,
  type = 'error',
  url = '',
  platform = 'Inconnue'
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'warning':
        return {
          icon: AlertCircle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-800'
        };
      case 'info':
        return {
          icon: AlertCircle,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-800'
        };
      default:
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          textColor: 'text-red-800'
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`${config.bgColor} ${config.borderColor} ${config.textColor} border rounded-xl p-4 shadow-sm`}
    >
      <div className="flex items-start space-x-3">
        {/* Icône */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0"
        >
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </motion.div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {message}
          </p>
          
          {/* Suggestions d'erreur communes */}
          {type === 'error' && (
            <div className="mt-3">
              <div className="text-xs opacity-80 mb-3">
                <p>Vérifiez que :</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>L'URL est valide et accessible</li>
                  <li>La plateforme est supportée (TikTok, Facebook, Twitter)</li>
                  <li>Le contenu est public</li>
                </ul>
              </div>
              
              {/* Bouton de rapport d'erreur */}
              {url && (
                <div className="flex justify-start">
                  <ErrorReportButton
                    url={url}
                    platform={platform}
                    error={message}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRetry}
              className="p-1 hover:bg-black/5 rounded transition-colors"
              title="Réessayer"
            >
              <RefreshCw className="h-4 w-4" />
            </motion.button>
          )}
          
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-1 hover:bg-black/5 rounded transition-colors"
              title="Fermer"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorMessage;