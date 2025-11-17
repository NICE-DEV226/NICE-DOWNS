import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Shield, 
  Zap, 
  Globe, 
  Award,
  Code,
  Coffee,
  Github,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';

const About = () => {
  const stats = [
    { number: '50K+', label: 'Utilisateurs actifs', icon: Users },
    { number: '1M+', label: 'Téléchargements', icon: Zap },
    { number: '99.9%', label: 'Disponibilité', icon: Shield },
    { number: '6', label: 'Plateformes supportées', icon: Globe }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Sécurité garantie',
      description: 'Vos données sont protégées. Nous ne stockons aucune information personnelle.',
      color: 'text-green-600'
    },
    {
      icon: Zap,
      title: 'Ultra rapide',
      description: 'Téléchargements instantanés grâce à notre infrastructure optimisée.',
      color: 'text-yellow-600'
    },
    {
      icon: Globe,
      title: 'Multi-plateformes',
      description: 'Support de TikTok, Facebook, Twitter, Instagram et bien plus.',
      color: 'text-purple-600'
    },
    {
      icon: Award,
      title: 'Qualité premium',
      description: 'Téléchargez en haute qualité sans perte de résolution.',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen pt-16" style={{background: 'linear-gradient(to right, #222035 0%, #222035 100%)'}}>
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 badge-primary mb-8"
            >
              <Heart className="h-4 w-4" />
              À propos de NICE-Downs
            </motion.div>

            <h1 className="heading-xl mb-6">
              Votre solution de{' '}
              <span className="gradient-text">téléchargement</span>{' '}
              multiplateforme
            </h1>

            <p className="text-lead mb-12 max-w-3xl mx-auto">
              NICE-Downs est né de la passion pour simplifier le téléchargement de contenus 
              depuis vos plateformes préférées. Notre mission : rendre accessible à tous 
              un outil puissant, gratuit et sécurisé.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding" style={{background: 'rgba(42, 45, 71, 0.3)'}}>
        <div className="container-section">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" 
                     style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#8b5cf6'}}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">
              Pourquoi choisir NICE-Downs ?
            </h2>
            <p className="text-lead max-w-2xl mx-auto">
              Découvrez les avantages qui font de NICE-Downs la solution préférée 
              de milliers d'utilisateurs dans le monde.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card-hover p-8"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${feature.color}`} 
                     style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)'}}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="heading-md mb-4">
                  {feature.title}
                </h3>
                <p className="text-body">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="section-padding" style={{background: 'rgba(42, 45, 71, 0.3)'}}>
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 badge-secondary mb-8">
              <Code className="h-4 w-4" />
              Développé avec passion
            </div>

            {/* Carte développeur avec photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="card p-8 mb-8 max-w-md mx-auto"
            >
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-purple-400/50 shadow-2xl">
                  <img 
                    src="https://files.catbox.moe/q1yiru.jpg" 
                    alt="NICE-DEV Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">NICE-DEV</h3>
              <p className="text-purple-300 mb-4">Développeur Full-Stack</p>
              
              <div className="flex items-center justify-center gap-6 text-sm text-gray-300 mb-6">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-400" />
                  Burkina Faso
                </div>
                <div className="flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-purple-400" />
                  Passionné
                </div>
              </div>
              
              <div className="flex justify-center gap-3">
                <a 
                  href="https://github.com/NICE-DEV226" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center hover:bg-purple-500/30 transition-colors"
                >
                  <Github className="h-5 w-5 text-purple-300" />
                </a>
                <a 
                  href="https://x.com/NiceDEVbf?t=ikJ96Mv6OkQPqs7pjTQZdA&s=09" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center hover:bg-purple-500/30 transition-colors"
                >
                  <Twitter className="h-5 w-5 text-purple-300" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/azaël-wend-panga-sawadogo-8a4606259" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center hover:bg-purple-500/30 transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-purple-300" />
                </a>
                <a 
                  href="mailto:nicedev226@gmail.com"
                  className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center hover:bg-purple-500/30 transition-colors"
                >
                  <Mail className="h-5 w-5 text-purple-300" />
                </a>
              </div>
            </motion.div>

            <p className="text-lead mb-8">
              Développeur passionné basé au Burkina Faso, je crée des solutions 
              innovantes pour simplifier votre expérience numérique. NICE-Downs 
              représente mon engagement à fournir des outils gratuits et accessibles 
              à tous.
            </p>

            <div className="flex items-center justify-center gap-8 text-gray-300">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Open Source
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Sécurisé
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Performant
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="container-section text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Notre Mission
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Démocratiser l'accès aux contenus numériques en offrant un outil 
              simple, gratuit et respectueux de la vie privée. Chaque téléchargement 
              doit être une expérience fluide et sécurisée.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-purple-100">
              <span className="px-4 py-2 bg-white/10 rounded-full">
                🚀 Innovation
              </span>
              <span className="px-4 py-2 bg-white/10 rounded-full">
                🔒 Sécurité
              </span>
              <span className="px-4 py-2 bg-white/10 rounded-full">
                💝 Gratuit
              </span>
              <span className="px-4 py-2 bg-white/10 rounded-full">
                🌍 Accessible
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;