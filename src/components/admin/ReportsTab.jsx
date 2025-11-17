import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  Trash2,
  Download,
  RefreshCw,
  Calendar,
  Globe,
  X
} from 'lucide-react';

const ReportsTab = ({ reports, loading, onStatusChange, onDeleteReport, onDeleteReports, onRefresh }) => {
  const [filter, setFilter] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReports, setSelectedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'nouveau': return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'en_cours': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'resolu': return 'bg-green-500/20 text-green-300 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'nouveau': return AlertTriangle;
      case 'en_cours': return Clock;
      case 'resolu': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'nouveau': return 'Nouveau';
      case 'en_cours': return 'En cours';
      case 'resolu': return 'Résolu';
      default: return status;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesFilter = filter === 'tous' || report.status === filter;
    const matchesSearch = report.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.platform?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.error_message?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSelectReport = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map(report => report.uuid));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedReports.length === 0) return;
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedReports.length} rapport(s) ?`)) {
      const result = await onDeleteReports(selectedReports);
      if (result.success) {
        setSelectedReports([]);
        alert(`✅ ${result.deletedCount} rapport(s) supprimé(s) avec succès !`);
      }
    }
  };

  const handleDeleteSingle = async (reportUuid) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
      const success = await onDeleteReport(reportUuid);
      if (success) {
        alert('✅ Rapport supprimé avec succès !');
      }
    }
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setSelectedReport(null);
    setShowDetailModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Gestion des rapports</h3>
          <p className="text-gray-400 text-sm">{filteredReports.length} rapport(s) trouvé(s)</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
          
          {selectedReports.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer ({selectedReports.length})
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              <option value="tous">Tous les statuts</option>
              <option value="nouveau">Nouveaux</option>
              <option value="en_cours">En cours</option>
              <option value="resolu">Résolus</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par URL, plateforme ou erreur..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Export */}
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors">
            <Download className="h-4 w-4" />
            Exporter
          </button>
        </div>
      </motion.div>

      {/* Reports Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden"
      >
        {/* Table Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
            />
            <span className="text-white font-medium">
              {selectedReports.length > 0 ? `${selectedReports.length} sélectionné(s)` : 'Sélectionner tout'}
            </span>
          </div>
        </div>

        {/* Reports List */}
        <div className="divide-y divide-gray-700">
          {filteredReports.map((report, index) => {
            const StatusIcon = getStatusIcon(report.status);
            
            return (
              <motion.div
                key={report.uuid}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report.uuid)}
                    onChange={() => handleSelectReport(report.uuid)}
                    className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 mt-1"
                  />

                  {/* Status Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(report.status)}`}>
                    <StatusIcon className="h-5 w-5" />
                  </div>

                  {/* Report Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                      <span className="text-purple-400 font-medium">{report.platform}</span>
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(report.created_at).toLocaleString('fr-FR')}
                      </span>
                    </div>

                    {/* URL */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <p className="text-white text-sm break-all">{report.url}</p>
                      </div>
                    </div>

                    {/* Error Message */}
                    <div className="mb-3">
                      <p className="text-red-300 text-sm">{report.error_message}</p>
                    </div>

                    {/* User Description */}
                    {report.user_description && (
                      <div className="mb-3 p-3 bg-gray-700/50 rounded-lg">
                        <p className="text-gray-300 text-sm italic">"{report.user_description}"</p>
                      </div>
                    )}

                    {/* Browser Info */}
                    {report.browser_info && (
                      <div className="text-xs text-gray-500">
                        <p>User Agent: {report.user_agent}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <select
                      value={report.status}
                      onChange={(e) => onStatusChange(report.uuid, e.target.value)}
                      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm text-white focus:border-purple-500"
                    >
                      <option value="nouveau">Nouveau</option>
                      <option value="en_cours">En cours</option>
                      <option value="resolu">Résolu</option>
                    </select>

                    <button 
                      onClick={() => handleViewDetails(report)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button 
                      onClick={() => handleDeleteSingle(report.uuid)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredReports.length === 0 && (
            <div className="p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Aucun rapport d'erreur trouvé</p>
              <p className="text-gray-500 text-sm">Essayez de modifier vos filtres de recherche</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal de détails */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Détails du rapport</h3>
              <button
                onClick={closeDetailModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenu */}
            <div className="space-y-6">
              {/* Statut et plateforme */}
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedReport.status)}`}>
                  {getStatusText(selectedReport.status)}
                </span>
                <span className="text-purple-400 font-medium">{selectedReport.platform}</span>
                <span className="text-gray-400 text-sm">
                  {new Date(selectedReport.created_at).toLocaleString('fr-FR')}
                </span>
              </div>

              {/* URL */}
              <div>
                <h4 className="text-white font-medium mb-2">URL concernée</h4>
                <div className="p-3 bg-gray-700/50 rounded-lg">
                  <p className="text-gray-300 text-sm break-all">{selectedReport.url}</p>
                </div>
              </div>

              {/* Message d'erreur */}
              <div>
                <h4 className="text-white font-medium mb-2">Message d'erreur</h4>
                <div className="p-3 bg-red-500/10 border border-red-400/30 rounded-lg">
                  <p className="text-red-300 text-sm">{selectedReport.error_message}</p>
                </div>
              </div>

              {/* Description utilisateur */}
              {selectedReport.user_description && (
                <div>
                  <h4 className="text-white font-medium mb-2">Description de l'utilisateur</h4>
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-gray-300 text-sm italic">"{selectedReport.user_description}"</p>
                  </div>
                </div>
              )}

              {/* Informations techniques */}
              <div>
                <h4 className="text-white font-medium mb-2">Informations techniques</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-gray-400 text-xs mb-1">User Agent</p>
                    <p className="text-gray-300 text-sm">{selectedReport.user_agent || 'Non disponible'}</p>
                  </div>
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-gray-400 text-xs mb-1">UUID</p>
                    <p className="text-gray-300 text-sm font-mono">{selectedReport.uuid}</p>
                  </div>
                </div>
              </div>

              {/* Informations du navigateur */}
              {selectedReport.browser_info && (
                <div>
                  <h4 className="text-white font-medium mb-2">Informations du navigateur</h4>
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <pre className="text-gray-300 text-xs overflow-x-auto">
                      {JSON.stringify(selectedReport.browser_info, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <select
                  value={selectedReport.status}
                  onChange={(e) => {
                    onStatusChange(selectedReport.uuid, e.target.value);
                    setSelectedReport({...selectedReport, status: e.target.value});
                  }}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500"
                >
                  <option value="nouveau">Nouveau</option>
                  <option value="en_cours">En cours</option>
                  <option value="resolu">Résolu</option>
                </select>
                
                <button
                  onClick={() => {
                    handleDeleteSingle(selectedReport.uuid);
                    closeDetailModal();
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                >
                  Supprimer
                </button>
                
                <button
                  onClick={closeDetailModal}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReportsTab;