import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  MapPin, 
  Clock,
  Github,
  Twitter,
  Linkedin,
  CheckCircle
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation d'envoi
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'nicedev226@gmail.com',
      description: 'Réponse sous 24h'
    },
    {
      icon: MapPin,
      title: 'Localisation',
      content: 'Ouagadougou, Burkina Faso',
      description: 'Afrique de l\'Ouest'
    },
    {
      icon: Clock,
      title: 'Disponibilité',
      content: '24/7 Support',
      description: 'Service automatisé'
    }
  ];

  const socialLinks = [
    { icon: Github, name: 'GitHub', url: 'https://github.com/NICE-DEV226', color: 'hover:text-white' },
    { icon: Twitter, name: 'Twitter', url: 'https://x.com/NiceDEVbf?t=ikJ96Mv6OkQPqs7pjTQZdA&s=09', color: 'hover:text-purple-400' },
    { icon: Linkedin, name: 'LinkedIn', url: 'https://www.linkedin.com/in/azaël-wend-panga-sawadogo-8a4606259', color: 'hover:text-purple-400' },
    { icon: Mail, name: 'Email', url: 'mailto:nicedev226@gmail.com', color: 'hover:text-purple-400' }
  ];

  return (
    <div className="min-h-screen pt-16" style={{background: 'linear-gradient(to right, #222035 0%, #222035 100%)'}}>
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 badge-primary mb-8"
            >
              <MessageSquare className="h-4 w-4" />
              Contactez-nous
            </motion.div>

            <h1 className="heading-xl mb-6">
              Une question ? Un{' '}
              <span className="gradient-text">problème</span> ?
            </h1>

            <p className="text-lead max-w-2xl mx-auto">
              Notre équipe est là pour vous aider. N'hésitez pas à nous contacter 
              pour toute question, suggestion ou problème technique.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulaire de contact */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="card p-8">
                <h2 className="heading-md mb-6">
                  Envoyez-nous un message
                </h2>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4 border border-green-400/30">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Message envoyé !
                    </h3>
                    <p className="text-gray-300">
                      Merci pour votre message. Je vous répondrai dans les plus brefs délais à <span className="text-purple-300 font-medium">nicedev226@gmail.com</span>
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input"
                          placeholder="Votre nom"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input"
                          placeholder="votre@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Sujet
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="input"
                        required
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="support">Support technique</option>
                        <option value="feature">Demande de fonctionnalité</option>
                        <option value="bug">Signaler un bug</option>
                        <option value="partnership">Partenariat</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="input resize-none"
                        placeholder="Décrivez votre demande en détail..."
                        required
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary w-full h-14 flex items-center justify-center gap-3"
                    >
                      <Send className="h-5 w-5" />
                      <span>Envoyer le message</span>
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Informations de contact */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              {/* Infos de contact */}
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="card p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                           style={{background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#8b5cf6'}}>
                        <info.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">
                          {info.title}
                        </h3>
                        {info.title === 'Email' ? (
                          <a 
                            href={`mailto:${info.content}`}
                            className="text-white font-medium hover:text-purple-300 transition-colors"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-white font-medium">
                            {info.content}
                          </p>
                        )}
                        <p className="text-sm text-gray-300">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Réseaux sociaux */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="card p-6"
              >
                <h3 className="font-semibold text-white mb-4">
                  Suivez-nous
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className={`w-12 h-12 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center transition-colors ${social.color}`}
                      title={social.name}
                    >
                      <social.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* FAQ rapide */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="card p-6"
              >
                <h3 className="font-semibold text-white mb-4">
                  Questions fréquentes
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-white">Le service est-il gratuit ?</p>
                    <p className="text-gray-300">Oui, 100% gratuit et sans inscription.</p>
                  </div>
                  <div>
                    <p className="font-medium text-white">Quelles plateformes sont supportées ?</p>
                    <p className="text-gray-300">TikTok, Facebook, Twitter, Instagram, YouTube et Pinterest.</p>
                  </div>
                  <div>
                    <p className="font-medium text-white">Mes données sont-elles sécurisées ?</p>
                    <p className="text-gray-300">Nous ne stockons aucune donnée personnelle.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;