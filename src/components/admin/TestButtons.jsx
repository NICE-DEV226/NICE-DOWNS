import { useState } from 'react';
import { motion } from 'framer-motion';
import { TestTube, CheckCircle, AlertTriangle } from 'lucide-react';

const TestButtons = () => {
  const [tests, setTests] = useState([]);

  const runTest = (testName, testFunction) => {
    try {
      const result = testFunction();
      setTests(prev => [...prev, { name: testName, success: true, result }]);
    } catch (error) {
      setTests(prev => [...prev, { name: testName, success: false, error: error.message }]);
    }
  };

  const testLocalStorage = () => {
    localStorage.setItem('test_key', 'test_value');
    const value = localStorage.getItem('test_key');
    localStorage.removeItem('test_key');
    return value === 'test_value' ? 'LocalStorage fonctionne' : 'Erreur LocalStorage';
  };

  const testSystemService = () => {
    const systemService = require('../../services/systemService').default;
    const settings = systemService.getAllSettings();
    return `Paramètres système: ${Object.keys(settings).length} clés`;
  };

  const clearTests = () => {
    setTests([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <TestTube className="h-6 w-6 text-blue-400" />
        <h3 className="text-lg font-bold text-white">Tests des fonctionnalités</h3>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => runTest('LocalStorage', testLocalStorage)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
        >
          Test LocalStorage
        </button>
        
        <button
          onClick={() => runTest('SystemService', testSystemService)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white transition-colors"
        >
          Test SystemService
        </button>
        
        <button
          onClick={clearTests}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-colors"
        >
          Effacer
        </button>
      </div>

      {tests.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white font-medium">Résultats des tests :</h4>
          {tests.map((test, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 p-3 rounded-lg ${
                test.success ? 'bg-green-500/10 border border-green-400/30' : 'bg-red-500/10 border border-red-400/30'
              }`}
            >
              {test.success ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-400" />
              )}
              <span className={test.success ? 'text-green-300' : 'text-red-300'}>
                {test.name}: {test.success ? test.result : test.error}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TestButtons;