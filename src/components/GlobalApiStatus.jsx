import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

const GlobalApiStatus = () => {
  const [newApiStatus, setNewApiStatus] = useState('checking');
  const [oldApiStatus, setOldApiStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkNewApi = async () => {
    try {
      const response = await fetch('https://api-aswin-sparky.koyeb.app/api/downloader/tiktok?url=https://vt.tiktok.com/ZSNvs6h6o', {
        method: 'GET',
        signal: AbortSignal.timeout(8000)
      });
      
      if (response.ok) {
        const data = await response.json();
        return data && typeof data === 'object' ? 'online' : 'error';
      }
      return 'error';
    } catch (error) {
      return 'offline';
    }
  };

  const checkOldApi = async () => {
    try {
      const response = await fetch('https://api.neoxr.eu/api/youtube?url=test&apikey=yVGABy', {
        method: 'GET',
        signal: AbortSignal.timeout(8000)
      });
      
      if (response.ok) {
        const data = await response.json();
        return data && typeof data === 'object' ? 'online' : 'error';
      }
      return 'error';
    } catch (error) {
      return 'offline';
    }
  };

  const checkAllApis = async () => {
    setIsChecking(true);
    setNewApiStatus('checking');
    setOldApiStatus('checking');

    try {
      const [newStatus, oldStatus] = await Promise.all([
        checkNewApi(),
        checkOldApi()
      ]);

      setNewApiStatus(newStatus);
      setOldApiStatus(oldStatus);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Erreur lors de la vérification des APIs:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAllApis();
    
    // Vérifier toutes les 60 secondes
    const interval = setInterval(checkAllApis, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'online':
        return {
          icon: CheckCircle,
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          text: 'En ligne'
        };
      case 'offline':
        return {
          icon: WifiOff,
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          text: 'Hors ligne'
        };
      case 'error':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          text: 'Instable'
        };
      default:
        return {
          icon: Wifi,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          text: 'Vérification...'
        };
    }
  };

  const newConfig = getStatusConfig(newApiStatus);
  const oldConfig = getStatusConfig(oldApiStatus);

  const overallStatus = () => {
    if (newApiStatus === 'online' || oldApiStatus === 'online') {
      return 'Au moins une API fonctionne';
    } else if (newApiStatus === 'checking' || oldApiStatus === 'checking') {
      return 'Vérification en cours...';
    } else {
      return 'Toutes les APIs sont indisponibles';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          État des APIs
        </h3>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={checkAllApis}
          disabled={isChecking}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
          title="Actualiser le statut"
        >
          <RefreshCw className={`h-4 w-4 text-white/60 ${isChecking ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Nouvelle API */}
        <div className={`${newConfig.bgColor} rounded-lg p-3`}>
          <div className="flex items-center gap-3">
            <motion.div
              animate={newApiStatus === 'checking' ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: newApiStatus === 'checking' ? Infinity : 0, ease: "linear" }}
            >
              <newConfig.icon className={`h-5 w-5 ${newConfig.color}`} />
            </motion.div>
            
            <div className="flex-1">
              <h4 className="font-medium text-white">Nouvelle API</h4>
              <p className="text-xs text-white/60">api-aswin-sparky.koyeb.app</p>
            </div>
            
            <span className={`text-xs font-medium ${newConfig.color}`}>
              {newConfig.text}
            </span>
          </div>
        </div>

        {/* Ancienne API */}
        <div className={`${oldConfig.bgColor} rounded-lg p-3`}>
          <div className="flex items-center gap-3">
            <motion.div
              animate={oldApiStatus === 'checking' ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: oldApiStatus === 'checking' ? Infinity : 0, ease: "linear" }}
            >
              <oldConfig.icon className={`h-5 w-5 ${oldConfig.color}`} />
            </motion.div>
            
            <div className="flex-1">
              <h4 className="font-medium text-white">Ancienne API</h4>
              <p className="text-xs text-white/60">api.neoxr.eu</p>
            </div>
            
            <span className={`text-xs font-medium ${oldConfig.color}`}>
              {oldConfig.text}
            </span>
          </div>
        </div>
      </div>

      {/* Statut global */}
      <div className="text-center">
        <p className="text-white/80 text-sm mb-2">
          {overallStatus()}
        </p>
        
        {lastCheck && (
          <p className="text-white/40 text-xs">
            Dernière vérification : {lastCheck.toLocaleTimeString()}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default GlobalApiStatus;