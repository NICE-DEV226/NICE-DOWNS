import { motion } from 'framer-motion';
import { Info, Zap, TestTube } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const ApiExplanation = () => {
  const { useRealAPI } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${
        useRealAPI 
          ? 'bg-green-500/10 border-green-500/30' 
          : 'bg-blue-500/10 border-blue-500/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          useRealAPI ? 'bg-green-500/20' : 'bg-blue-500/20'
        }`}>
          {useRealAPI ? (
            <Zap className="h-5 w-5 text-green-400" />
          ) : (
            <TestTube className="h-5 w-5 text-blue-400" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold mb-2 ${
            useRealAPI ? 'text-green-100' : 'text-blue-100'
          }`}>
            {useRealAPI ? 'Mode API Activé' : 'Mode Simulation Activé'}
          </h3>
          
          <p className={`text-sm ${
            useRealAPI ? 'text-green-200' : 'text-blue-200'
          }`}>
            {useRealAPI ? (
              <>
                Les téléchargements utilisent les vraies API des plateformes. 
                Si le statut indique "hors ligne", les téléchargements peuvent quand même fonctionner.
              </>
            ) : (
              <>
                Les téléchargements sont simulés avec des données d'exemple. 
                Parfait pour tester l'interface sans consommer l'API.
              </>
            )}
          </p>
          
          <div className="mt-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-white/60" />
            <span className="text-xs text-white/60">
              Utilisez le bouton d'aide (?) en bas à droite pour plus d'informations
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApiExplanation;