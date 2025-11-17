import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, AlertTriangle, CheckCircle, X } from 'lucide-react';
// Pas besoin d'importer apiClient pour ce composant

const ApiStatus = () => {
  const [status, setStatus] = useState('checking'); // checking, online, offline, error
  const [lastCheck, setLastCheck] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  const checkApiStatus = async () => {
    try {
      setStatus('checking');
      
      // Test simple avec timeout manuel
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      // Test avec une requête simple vers l'API
      const response = await fetch('https://api.neoxr.eu/api/youtube?url=test&apikey=yVGABy', {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      // Si on reçoit une réponse (même une erreur), l'API est en ligne
      if (response) {
        const data = await response.json();
        // L'API répond avec une structure, même si c'est une erreur
        if (data && typeof data === 'object') {
          setStatus('online');
        } else {
          setStatus('error');
        }
      } else {
        setStatus('error');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setStatus('offline');
      } else {
        // L'API répond mais avec une erreur
        setStatus('error');
      }
    } finally {
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkApiStatus();
    
    // Vérifier le statut toutes les 30 secondes
    const interval = setInterval(checkApiStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          text: 'API en ligne',
          description: 'Tous les services fonctionnent normalement'
        };
      case 'offline':
        return {
          icon: WifiOff,
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          text: 'API hors ligne',
          description: 'Mode simulation activé automatiquement'
        };
      case 'error':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
          text: 'API instable',
          description: 'Certains services peuvent être indisponibles'
        };
      default:
        return {
          icon: Wifi,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
          text: 'Vérification...',
          description: 'Test de connexion en cours'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (!isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3 mb-4`}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={status === 'checking' ? { rotate: 360 } : {}}
          transition={{ duration: 1, repeat: status === 'checking' ? Infinity : 0, ease: "linear" }}
        >
          <Icon className={`h-5 w-5 ${config.color}`} />
        </motion.div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className={`font-medium ${config.color}`}>
              {config.text}
            </span>
            {lastCheck && (
              <span className="text-xs text-white/60">
                {lastCheck.toLocaleTimeString()}
              </span>
            )}
          </div>
          <p className="text-xs text-white/60 mt-1">
            {config.description}
          </p>
        </div>
        
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={checkApiStatus}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Actualiser le statut"
          >
            <Wifi className="h-4 w-4 text-white/60" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Masquer le statut API"
          >
            <X className="h-4 w-4 text-white/60" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ApiStatus;