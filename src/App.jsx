import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastProvider from './components/ToastProvider';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Result from './pages/Result';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import MaintenancePage from './components/MaintenancePage';
import systemService from './services/systemService';

// Composant interne pour gérer la maintenance avec accès à useLocation
const AppContent = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Vérifier le mode maintenance au démarrage
    setIsMaintenanceMode(systemService.isMaintenanceMode());
    
    // Écouter les changements de paramètres
    const unsubscribe = systemService.onSettingsChange((settings) => {
      setIsMaintenanceMode(settings.maintenanceMode);
    });

    return unsubscribe;
  }, []);

  // Si le mode maintenance est activé, afficher la page de maintenance
  // SAUF pour les routes admin
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  if (isMaintenanceMode && !isAdminRoute) {
    return <MaintenancePage />;
  }

  return (
    <Routes>
          {/* Routes admin - SANS header/footer */}
          <Route 
            path="/admin/login" 
            element={<AdminLogin />} 
          />
          <Route 
            path="/admin/dashboard" 
            element={<AdminDashboard />} 
          />
          
          {/* Routes utilisateur - AVEC header/footer */}
          <Route 
            path="/" 
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Home />
                    </motion.div>
                  </AnimatePresence>
                </main>
                <Footer />
              </div>
            } 
          />
          <Route 
            path="/result" 
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Result />
                    </motion.div>
                  </AnimatePresence>
                </main>
                <Footer />
              </div>
            } 
          />
          <Route 
            path="/about" 
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <About />
                    </motion.div>
                  </AnimatePresence>
                </main>
                <Footer />
              </div>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Contact />
                    </motion.div>
                  </AnimatePresence>
                </main>
                <Footer />
              </div>
            } 
          />
    </Routes>
  );
};

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
      </Router>
    </ToastProvider>
  );
}

export default App;
