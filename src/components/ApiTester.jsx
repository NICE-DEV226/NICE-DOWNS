import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToastContext } from './ToastProvider';

const ApiTester = () => {
    const [isTesting, setIsTesting] = useState(false);
    const [testResults, setTestResults] = useState([]);
    const { success, error } = useToastContext();

    const testUrls = [
        {
            platform: 'TikTok (Nouvelle API)',
            url: 'https://vt.tiktok.com/ZSNvs6h6o',
            endpoint: 'tiktok',
            apiType: 'new'
        },
        {
            platform: 'Facebook (Nouvelle API)',
            url: 'https://www.facebook.com/100000959749712/posts/pfbid0288xi44nvodK9d7r3wf4LHeM3dtEsVghQXmz5t59axwz7KdLStYyg4qfvTVrAL27Ll/?app=fbl',
            endpoint: 'fbdl',
            apiType: 'new'
        },
        {
            platform: 'Twitter (Nouvelle API)',
            url: 'https://twitter.com/TeamAbhiSha/status/1743351410761019794?t=vms8wxcU0mQuhVxwGCHjFw&s=19',
            endpoint: 'twiter',
            apiType: 'new'
        },
        {
            platform: 'YouTube (Ancienne API)',
            url: 'https://www.youtube.com/watch?v=fKRtnMYMW08',
            endpoint: 'youtube',
            apiType: 'old'
        }
    ];

    const testApi = async (testCase) => {
        try {
            const encodedUrl = encodeURIComponent(testCase.url);
            let response, data;
            
            if (testCase.apiType === 'new') {
                // Nouvelle API
                response = await fetch(`https://api-aswin-sparky.koyeb.app/api/downloader/${testCase.endpoint}?url=${encodedUrl}`);
                data = await response.json();
            } else {
                // Ancienne API
                response = await fetch(`https://api.neoxr.eu/api/${testCase.endpoint}?url=${encodedUrl}&apikey=yVGABy`);
                data = await response.json();
            }

            return {
                platform: testCase.platform,
                success: data.status === true,
                data: data,
                error: data.status ? null : 'API returned false status',
                apiType: testCase.apiType
            };
        } catch (err) {
            return {
                platform: testCase.platform,
                success: false,
                data: null,
                error: err.message,
                apiType: testCase.apiType
            };
        }
    };

    const runAllTests = async () => {
        setIsTesting(true);
        setTestResults([]);

        try {
            const results = [];

            for (const testCase of testUrls) {
                const result = await testApi(testCase);
                results.push(result);
                setTestResults([...results]);

                // Petit délai entre les tests
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const successCount = results.filter(r => r.success).length;
            if (successCount === results.length) {
                success(`Tous les tests réussis ! (${successCount}/${results.length})`);
            } else {
                error(`${successCount}/${results.length} tests réussis`);
            }

        } catch (err) {
            error('Erreur lors des tests API');
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mt-6"
            data-testid="api-tester"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Test API en Direct</h3>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={runAllTests}
                    disabled={isTesting}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                    {isTesting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Play className="h-4 w-4" />
                    )}
                    {isTesting ? 'Test en cours...' : 'Tester l\'API'}
                </motion.button>
            </div>

            {testResults.length > 0 && (
                <div className="space-y-3">
                    {testResults.map((result, index) => (
                        <motion.div
                            key={result.platform}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center justify-between p-3 rounded-lg ${result.success
                                ? 'bg-green-500/20 border border-green-500/30'
                                : 'bg-red-500/20 border border-red-500/30'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {result.success ? (
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-400" />
                                )}

                                <div>
                                    <p className={`font-medium ${result.success ? 'text-green-100' : 'text-red-100'}`}>
                                        {result.platform}
                                    </p>
                                    {result.error && (
                                        <p className="text-xs text-red-300 mt-1">
                                            {result.error}
                                        </p>
                                    )}
                                    {result.success && result.data && (
                                        <p className="text-xs text-green-300 mt-1">
                                            {result.data.title || 'Données récupérées avec succès'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    result.apiType === 'new' 
                                        ? 'bg-blue-400/20 text-blue-300' 
                                        : 'bg-purple-400/20 text-purple-300'
                                }`}>
                                    {result.apiType === 'new' ? 'NOUVELLE' : 'ANCIENNE'}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full ${result.success
                                    ? 'bg-green-400/20 text-green-300'
                                    : 'bg-red-400/20 text-red-300'
                                    }`}>
                                    {result.success ? 'OK' : 'ERREUR'}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {isTesting && testResults.length === 0 && (
                <div className="text-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-neon-blue mx-auto mb-2" />
                    <p className="text-white/60">Test des APIs en cours...</p>
                </div>
            )}
        </motion.div>
    );
};

export default ApiTester;