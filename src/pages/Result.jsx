import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  CheckCircle, 
  ArrowLeft, 
  ExternalLink,
  FileVideo,
  FileAudio,
  FileImage,
  Clock,
  Eye,
  Share2,
  AlertTriangle,
  X
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { formatDuration, getFileSize } from '../utils/platforms';
import { generateFilename, downloadWithNotification } from '../services/apiService';
import { sendUserRating } from '../services/errorReportService';
import ErrorReportButton from '../components/ErrorReportButton';
import RatingModal from '../components/RatingModal';

const Result = () => {
  const navigate = useNavigate();
  const [downloadingFiles, setDownloadingFiles] = useState(new Set());
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showErrorReport, setShowErrorReport] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState(null);
  const { 
    downloadResult, 
    url, 
    isLoading, 
    error,
    downloadStatus,
    setDownloadStatus,
    downloadInfo: storeDownloadInfo,
    setDownloadInfo: setStoreDownloadInfo,
    clearResult 
  } = useAppStore();

  useEffect(() => {
    // Rediriger vers l'accueil si pas de résultat
    if (!downloadResult && !isLoading && !url) {
      navigate('/');
    }
  }, [downloadResult, isLoading, url, navigate]);

  const handleNewDownload = () => {
    clearResult();
    navigate('/');
  };

  const getFileIcon = (format) => {
    if (format?.includes('mp4') || format?.includes('video')) return FileVideo;
    if (format?.includes('mp3') || format?.includes('audio')) return FileAudio;
    return FileImage;
  };

  const getFileColor = (format) => {
    if (format?.includes('mp4') || format?.includes('video')) return 'text-red-600';
    if (format?.includes('mp3') || format?.includes('audio')) return 'text-green-600';
    return 'text-blue-600';
  };

  const handleDownload = async (url, title, type, platform, fileId) => {
    const startTime = Date.now();
    
    try {
      setDownloadingFiles(prev => new Set(prev).add(fileId));
      setDownloadStatus('downloading');
      
      const filename = generateFilename(title || 'media', type || 'mp4', platform || 'download');
      
      // Demander la permission pour les notifications
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      
      await downloadWithNotification(url, filename);
      
      const downloadTime = ((Date.now() - startTime) / 1000).toFixed(1);
      
      // Marquer comme téléchargé avec succès
      setDownloadStatus('completed');
      
      const downloadInfoData = {
        platform: platform || downloadResult?.platform,
        url: downloadResult?.url || url,
        title: title || downloadResult?.title,
        downloadTime: parseFloat(downloadTime),
        fileSize: getFileSize(type),
        filename
      };
      
      setDownloadInfo(downloadInfoData);
      setStoreDownloadInfo(downloadInfoData);
      
      // Afficher le modal de notation après un court délai
      setTimeout(() => {
        setShowRatingModal(true);
      }, 1500);
      
    } catch (error) {
      console.error('Erreur de téléchargement:', error);
      setDownloadStatus('error');
      
      // Afficher automatiquement le modal de signalement d'erreur
      const errorInfo = {
        platform: platform || downloadResult?.platform,
        url: downloadResult?.url || url,
        title: title || downloadResult?.title,
        error: error.message || 'Erreur lors du téléchargement',
        filename
      };
      
      setDownloadInfo(errorInfo);
      
      // Afficher le modal de signalement d'erreur après un court délai
      setTimeout(() => {
        setShowErrorReport(true);
      }, 500);
      
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handleRatingSubmit = async (ratingData) => {
    try {
      const result = await sendUserRating(ratingData);
      if (result.success) {
        console.log('✅ Notation envoyée avec succès');
      } else {
        console.error('❌ Erreur lors de l\'envoi de la notation:', result.error);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la notation:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16" style={{background: 'linear-gradient(to right, #222035 0%, #222035 100%)'}}>
        <div className="container-section section-padding">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-12"
            >
              <div className="w-16 h-16 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="heading-md mb-4">Extraction en cours...</h2>
              <p className="text-body">Veuillez patienter pendant que nous traitons votre demande.</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16" style={{background: 'linear-gradient(to right, #222035 0%, #222035 100%)'}}>
        <div className="container-section section-padding">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-12"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-6 border border-red-400/30">
                <ExternalLink className="h-8 w-8" />
              </div>
              <h2 className="heading-md mb-4 text-red-400">Erreur d'extraction</h2>
              <p className="text-body mb-8">{error}</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNewDownload}
                className="btn-primary"
              >
                <ArrowLeft className="h-5 w-5" />
                Essayer à nouveau
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (!downloadResult) {
    return (
      <div className="min-h-screen pt-16" style={{background: 'linear-gradient(to right, #222035 0%, #222035 100%)'}}>
        <div className="container-section section-padding">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-12"
            >
              <h2 className="heading-md mb-4">Aucun résultat</h2>
              <p className="text-body mb-8">Aucune extraction en cours.</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNewDownload}
                className="btn-primary"
              >
                <ArrowLeft className="h-5 w-5" />
                Retour à l'accueil
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{background: 'linear-gradient(to right, #222035 0%, #222035 100%)'}}>
      <div className="container-section section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Header avec statut dynamique */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {downloadStatus === 'completed' ? (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-400 mb-6 border border-green-400/30">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h1 className="heading-xl mb-4">
                  Téléchargement <span className="gradient-text">terminé</span> !
                </h1>
                <p className="text-lead">
                  Votre fichier a été téléchargé avec succès
                </p>
              </>
            ) : downloadStatus === 'downloading' ? (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 text-blue-400 mb-6 border border-blue-400/30">
                  <div className="w-10 h-10 border-4 border-blue-200/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <h1 className="heading-xl mb-4">
                  Téléchargement <span className="gradient-text">en cours</span>...
                </h1>
                <p className="text-lead">
                  Veuillez patienter pendant le téléchargement
                </p>
              </>
            ) : downloadStatus === 'error' ? (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 text-red-400 mb-6 border border-red-400/30">
                  <AlertTriangle className="h-10 w-10" />
                </div>
                <h1 className="heading-xl mb-4">
                  Téléchargement <span className="text-red-400">échoué</span>
                </h1>
                <p className="text-lead">
                  Une erreur s'est produite lors du téléchargement
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 text-green-400 mb-6 border border-green-400/30">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h1 className="heading-xl mb-4">
                  Extraction <span className="gradient-text">réussie</span> !
                </h1>
                <p className="text-lead">
                  Votre contenu est prêt à être téléchargé
                </p>
              </>
            )}
          </motion.div>

          {/* Informations de téléchargement terminé */}
          {downloadStatus === 'completed' && downloadInfo && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-4 sm:p-6 lg:p-8 mb-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Téléchargement réussi</h3>
                  <p className="text-gray-400 text-sm">Fichier téléchargé avec succès</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
                <div>
                  <p className="text-sm text-gray-300">📁 <strong>Fichier :</strong></p>
                  <p className="text-sm text-white font-mono break-all">{downloadInfo.filename}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">⏱️ <strong>Temps :</strong></p>
                  <p className="text-sm text-white">{downloadInfo.downloadTime}s</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">🎯 <strong>Plateforme :</strong></p>
                  <p className="text-sm text-white">{downloadInfo.platform}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">📊 <strong>Taille :</strong></p>
                  <p className="text-sm text-white">{downloadInfo.fileSize}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Informations du contenu */}
          {downloadResult.title && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-4 sm:p-6 lg:p-8 mb-8"
            >
              {/* Message d'erreur API si présent */}
              {downloadResult.error && (
                <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-4 mb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-yellow-200 mb-3">
                        ⚠️ <strong>Information :</strong> {downloadResult.error}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <ErrorReportButton
                      url={url}
                      platform={downloadResult.platform}
                      error={downloadResult.error}
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                {downloadResult.thumbnail && (
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <img
                      src={downloadResult.thumbnail}
                      alt={downloadResult.title}
                      className="w-full sm:w-32 h-48 sm:h-24 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex-1 w-full">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 break-words">
                    {downloadResult.title}
                  </h2>
                  {downloadResult.author && (
                    <p className="text-gray-300 mb-2 text-sm sm:text-base">
                      Par {downloadResult.author}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-400">
                    {downloadResult.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        {formatDuration(downloadResult.duration)}
                      </div>
                    )}
                    {downloadResult.views && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                        {downloadResult.views.toLocaleString()} vues
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Options de téléchargement */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-4 sm:p-6 lg:p-8 mb-8"
          >
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4">
              Téléchargez votre contenu
            </h3>

            
            <div className="grid gap-4">
              {downloadResult.formats?.map((format, index) => {
                const FileIcon = getFileIcon(format.format);
                const fileColor = getFileColor(format.format);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 sm:p-4 border border-purple-400/30 rounded-xl hover:border-purple-400/60 hover:bg-purple-500/10 transition-all"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${fileColor} flex-shrink-0`}
                           style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
                        <FileIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-white text-sm sm:text-base truncate">
                          {format.format?.toUpperCase() || 'Fichier'}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-300 truncate">
                          {format.quality || 'Qualité standard'} • {format.realSize || format.size || getFileSize(format.format)}
                        </div>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={() => handleDownload(
                        format.url || downloadResult.url,
                        downloadResult.title,
                        format.type || format.format,
                        downloadResult.platform,
                        `format-${index}`
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={downloadingFiles.has(`format-${index}`)}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base flex-shrink-0"
                    >
                      {downloadingFiles.has(`format-${index}`) ? (
                        <>
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span className="hidden sm:inline">Téléchargement...</span>
                          <span className="sm:hidden">...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Télécharger</span>
                          <span className="sm:hidden">DL</span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}
              
              {/* Fallback si pas de formats spécifiques */}
              {(!downloadResult.formats || downloadResult.formats.length === 0) && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 sm:p-4 border border-purple-400/30 rounded-xl hover:border-purple-400/60 hover:bg-purple-500/10 transition-all"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-purple-400 flex-shrink-0"
                         style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
                      <FileVideo className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white text-sm sm:text-base">
                        Fichier téléchargé
                      </div>
                      <div className="text-xs sm:text-sm text-gray-300">
                        Format original • {downloadResult.size || 'Qualité maximale'}
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => handleDownload(
                      downloadResult.url,
                      downloadResult.title,
                      'mp4',
                      downloadResult.platform,
                      'fallback'
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={downloadingFiles.has('fallback')}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base flex-shrink-0"
                  >
                    {downloadingFiles.has('fallback') ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="hidden sm:inline">Téléchargement...</span>
                        <span className="sm:hidden">...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Télécharger</span>
                        <span className="sm:hidden">DL</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNewDownload}
              className="btn-secondary w-full sm:w-auto text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Nouveau contenu</span>
              <span className="sm:hidden">Nouveau</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'NICE-Downs',
                    text: 'Téléchargez facilement vos contenus préférés',
                    url: window.location.origin
                  });
                }
              }}
              className="btn-outline w-full sm:w-auto text-sm sm:text-base"
            >
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Partager NICE-Downs</span>
              <span className="sm:hidden">Partager</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Modal de notation */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        downloadInfo={downloadInfo}
      />

      {/* Modal de signalement d'erreur automatique */}
      <AnimatePresence>
        {showErrorReport && downloadInfo?.error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowErrorReport(false)}
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
                    <h3 className="text-lg font-bold text-white">Échec du téléchargement</h3>
                    <p className="text-gray-400 text-sm">Signaler ce problème ?</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowErrorReport(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
                  <p className="text-sm text-red-300">
                    <strong>💥 Erreur :</strong> {downloadInfo.error}
                  </p>
                </div>
                
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300">
                      <strong>🎯 Plateforme :</strong> {downloadInfo.platform}
                    </p>
                    <p className="text-sm text-gray-300 break-all">
                      <strong>🔗 URL :</strong> {downloadInfo.url}
                    </p>
                    {downloadInfo.filename && (
                      <p className="text-sm text-gray-300">
                        <strong>📁 Fichier :</strong> {downloadInfo.filename}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowErrorReport(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  Ignorer
                </button>
                <div className="flex-1">
                  <ErrorReportButton
                    url={downloadInfo.url}
                    platform={downloadInfo.platform}
                    error={downloadInfo.error}
                    onClose={() => setShowErrorReport(false)}
                  />
                </div>
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
    </div>
  );
};

export default Result;