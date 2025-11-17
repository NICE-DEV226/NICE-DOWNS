import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  MessageCircle, 
  TrendingUp, 
  Filter,
  Search,
  Calendar,
  Globe,
  Heart,
  ThumbsUp,
  BarChart3,
  Download,
  Eye
} from 'lucide-react';
import { getRatings } from '../../services/errorReportService';

const RatingsTab = () => {
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    loadRatings();
  }, []);

  const loadRatings = async () => {
    setLoading(true);
    try {
      // Simuler le chargement des notations (remplace par l'API réelle)
      setTimeout(() => {
        const mockRatings = [
          {
            id: 1,
            rating: 5,
            comment: 'Excellent service ! Téléchargement très rapide et qualité parfaite.',
            category: 'general',
            platform: 'TikTok',
            url: 'https://tiktok.com/@user/video/123',
            downloadTime: 2.3,
            created_at: '2025-01-17T10:30:00Z',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            browserInfo: { language: 'fr-FR', platform: 'Win32' }
          },
          {
            id: 2,
            rating: 4,
            comment: 'Très bien, juste un peu lent parfois.',
            category: 'speed',
            platform: 'Instagram',
            url: 'https://instagram.com/p/ABC123',
            downloadTime: 5.7,
            created_at: '2025-01-17T09:15:00Z',
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',
            browserInfo: { language: 'fr-FR', platform: 'iPhone' }
          },
          {
            id: 3,
            rating: 5,
            comment: 'Interface très intuitive et moderne !',
            category: 'interface',
            platform: 'Facebook',
            url: 'https://facebook.com/video/456',
            downloadTime: 3.1,
            created_at: '2025-01-17T08:45:00Z',
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            browserInfo: { language: 'en-US', platform: 'MacIntel' }
          },
          {
            id: 4,
            rating: 3,
            comment: 'Correct mais pourrait être amélioré.',
            category: 'quality',
            platform: 'X (Twitter)',
            url: 'https://x.com/user/status/789',
            downloadTime: 4.2,
            created_at: '2025-01-16T16:20:00Z',
            userAgent: 'Mozilla/5.0 (Android 11; Mobile)',
            browserInfo: { language: 'fr-FR', platform: 'Linux armv8l' }
          },
          {
            id: 5,
            rating: 5,
            comment: 'Parfait ! Exactement ce que je cherchais.',
            category: 'general',
            platform: 'YouTube',
            url: 'https://youtube.com/watch?v=xyz',
            downloadTime: 1.8,
            created_at: '2025-01-16T14:10:00Z',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            browserInfo: { language: 'fr-FR', platform: 'Win32' }
          }
        ];

        const mockStats = {
          total: 156,
          average: 4.3,
          distribution: {
            5: 89,
            4: 42,
            3: 18,
            2: 5,
            1: 2
          },
          categories: {
            general: 67,
            speed: 34,
            interface: 28,
            quality: 27
          },
          platforms: {
            'TikTok': 45,
            'Instagram': 38,
            'Facebook': 32,
            'YouTube': 25,
            'X (Twitter)': 16
          }
        };

        setRatings(mockRatings);
        setStats(mockStats);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors du chargement des notations:', error);
      setLoading(false);
    }
  };

  const getStarColor = (rating, starIndex) => {
    return starIndex <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'general': return Heart;
      case 'speed': return TrendingUp;
      case 'interface': return Eye;
      case 'quality': return Star;
      default: return MessageCircle;
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'general': return 'Expérience générale';
      case 'speed': return 'Vitesse';
      case 'interface': return 'Interface';
      case 'quality': return 'Qualité';
      default: return category;
    }
  };

  const filteredRatings = ratings.filter(rating => {
    const matchesRating = filter === 'all' || rating.rating.toString() === filter;
    const matchesCategory = categoryFilter === 'all' || rating.category === categoryFilter;
    const matchesSearch = rating.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rating.platform?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRating && matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Notations utilisateurs</h3>
          <p className="text-gray-400 text-sm">{filteredRatings.length} notation(s) • Moyenne: {stats?.average}/5</p>
        </div>
        
        <button
          onClick={loadRatings}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
        >
          <Download className="h-4 w-4" />
          Exporter
        </button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white mb-1">{stats?.average}</p>
            <p className="text-gray-400 text-sm">Note moyenne</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white mb-1">{stats?.total}</p>
            <p className="text-gray-400 text-sm">Total notations</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <ThumbsUp className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white mb-1">
              {stats?.distribution ? Math.round(((stats.distribution[4] + stats.distribution[5]) / stats.total) * 100) : 0}%
            </p>
            <p className="text-gray-400 text-sm">Satisfaction (4-5★)</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-white mb-1">+12%</p>
            <p className="text-gray-400 text-sm">Évolution 7j</p>
          </div>
        </motion.div>
      </div>

      {/* Rating Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
      >
        <h4 className="text-lg font-bold text-white mb-6">Distribution des notes</h4>
        
        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = stats?.distribution[stars] || 0;
            const percentage = stats?.total ? (count / stats.total) * 100 : 0;
            
            return (
              <div key={stars} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-white font-medium">{stars}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                </div>
                
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full"
                  />
                </div>
                
                <div className="text-right w-20">
                  <span className="text-white font-medium">{count}</span>
                  <span className="text-gray-400 text-sm ml-1">({percentage.toFixed(1)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Rating Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500"
            >
              <option value="all">Toutes les notes</option>
              <option value="5">5 étoiles</option>
              <option value="4">4 étoiles</option>
              <option value="3">3 étoiles</option>
              <option value="2">2 étoiles</option>
              <option value="1">1 étoile</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-purple-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="general">Expérience générale</option>
              <option value="speed">Vitesse</option>
              <option value="interface">Interface</option>
              <option value="quality">Qualité</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher dans les commentaires..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Ratings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden"
      >
        <div className="divide-y divide-gray-700">
          {filteredRatings.map((rating, index) => {
            const CategoryIcon = getCategoryIcon(rating.category);
            
            return (
              <motion.div
                key={rating.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Rating Stars */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${getStarColor(rating.rating, star)}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="h-4 w-4 text-purple-400" />
                      <span className="text-xs text-gray-400">{getCategoryLabel(rating.category)}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-purple-400 font-medium">{rating.platform}</span>
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(rating.created_at).toLocaleString('fr-FR')}
                      </span>
                      {rating.downloadTime && (
                        <span className="text-gray-400 text-sm">
                          {rating.downloadTime}s
                        </span>
                      )}
                    </div>

                    {/* Comment */}
                    {rating.comment && (
                      <div className="mb-3">
                        <p className="text-white text-sm">{rating.comment}</p>
                      </div>
                    )}

                    {/* URL */}
                    <div className="mb-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3 text-gray-400" />
                        <p className="text-gray-400 text-xs break-all">{rating.url}</p>
                      </div>
                    </div>

                    {/* Browser Info */}
                    <div className="text-xs text-gray-500">
                      <p>{rating.browserInfo?.platform} • {rating.browserInfo?.language}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredRatings.length === 0 && (
            <div className="p-12 text-center">
              <Star className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Aucune notation trouvée</p>
              <p className="text-gray-500 text-sm">Essayez de modifier vos filtres de recherche</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RatingsTab;