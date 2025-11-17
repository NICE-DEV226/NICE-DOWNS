import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Shield, 
  ShieldCheck,
  Mail,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Eye,
  EyeOff
} from 'lucide-react';

const UsersTab = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Données de test
  useEffect(() => {
    // Simuler le chargement des admins
    setTimeout(() => {
      setAdmins([
        {
          id: 1,
          name: 'NICE-DEV Admin',
          email: 'admin@nice-downs.com',
          created_at: '2025-01-01T00:00:00Z',
          last_login: '2025-01-17T10:30:00Z',
          is_active: true,
          role: 'Super Admin'
        },
        {
          id: 2,
          name: 'Modérateur',
          email: 'moderator@nice-downs.com',
          created_at: '2025-01-10T00:00:00Z',
          last_login: '2025-01-16T15:20:00Z',
          is_active: true,
          role: 'Modérateur'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (newAdmin.password !== newAdmin.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    
    const admin = {
      id: Date.now(),
      name: newAdmin.name,
      email: newAdmin.email,
      created_at: new Date().toISOString(),
      last_login: null,
      is_active: true,
      role: 'Admin'
    };
    
    setAdmins([...admins, admin]);
    setNewAdmin({ name: '', email: '', password: '', confirmPassword: '' });
    setShowAddModal(false);
  };

  const toggleAdminStatus = (adminId) => {
    setAdmins(admins.map(admin => 
      admin.id === adminId 
        ? { ...admin, is_active: !admin.is_active }
        : admin
    ));
  };

  const deleteAdmin = (adminId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      setAdmins(admins.filter(admin => admin.id !== adminId));
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h3 className="text-xl font-bold text-white">Gestion des utilisateurs</h3>
          <p className="text-gray-400 text-sm">{filteredAdmins.length} administrateur(s)</p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Nouvel admin
        </button>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un administrateur..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </motion.div>

      {/* Admins List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden"
      >
        <div className="divide-y divide-gray-700">
          {filteredAdmins.map((admin, index) => (
            <motion.div
              key={admin.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    admin.is_active ? 'bg-green-500/20' : 'bg-gray-500/20'
                  }`}>
                    {admin.is_active ? (
                      <ShieldCheck className="h-6 w-6 text-green-400" />
                    ) : (
                      <Shield className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium">{admin.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Mail className="h-3 w-3" />
                      {admin.email}
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        admin.is_active 
                          ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                          : 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
                      }`}>
                        {admin.is_active ? 'Actif' : 'Inactif'}
                      </span>
                      <span className="text-xs text-gray-500">{admin.role}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right text-sm text-gray-400 mr-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Créé: {new Date(admin.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    {admin.last_login && (
                      <div className="mt-1">
                        Dernière connexion: {new Date(admin.last_login).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => toggleAdminStatus(admin.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      admin.is_active
                        ? 'text-yellow-400 hover:bg-yellow-500/10'
                        : 'text-green-400 hover:bg-green-500/10'
                    }`}
                    title={admin.is_active ? 'Désactiver' : 'Activer'}
                  >
                    {admin.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>

                  <button
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  {admin.id !== 1 && ( // Ne pas permettre de supprimer le super admin
                    <button
                      onClick={() => deleteAdmin(admin.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-bold text-white mb-4">Nouvel administrateur</h3>
            
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
                <input
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={newAdmin.confirmPassword}
                  onChange={(e) => setNewAdmin({...newAdmin, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
                >
                  Créer
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UsersTab;