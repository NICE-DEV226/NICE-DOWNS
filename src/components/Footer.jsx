import { motion } from 'framer-motion';
import { Download, Heart, Github, Twitter, Mail, Linkedin, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/NICE-DEV226', label: 'GitHub', color: 'hover:text-gray-900' },
    { icon: Twitter, href: 'https://x.com/NiceDEVbf?t=ikJ96Mv6OkQPqs7pjTQZdA&s=09', label: 'Twitter', color: 'hover:text-blue-500' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/aza%C3%ABl-wend-panga-sawadogo-8a4606259', label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: Mail, href: 'mailto:nicedev226@gmail.com', label: 'Email', color: 'hover:text-green-600' }
  ];

  const footerLinks = [
    {
      title: 'Plateformes',
      links: [
        { name: 'TikTok', href: '/' },
        { name: 'Facebook', href: '/' },
        { name: 'Twitter/X', href: '/' }
      ]
    },
    {
      title: 'À propos',
      links: [
        { name: 'Le projet', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Portfolio', href: 'https://nice-dev226.netlify.app/', external: true }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-section py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="gradient-bg p-2.5 rounded-xl">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">NICE-Downs</span>
                <p className="text-sm text-gray-400">by NICE-DEV</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Téléchargez vos contenus préférés depuis TikTok, Facebook et Twitter. 
              Créé avec passion par <span className="text-blue-400 font-semibold">NICE-DEV</span> au Burkina Faso 🇧🇫
            </p>
            
            {/* Réseaux sociaux */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-200 text-gray-400 ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Liens */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-6">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {link.name}
                      {link.external && (
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} NICE-Downs. Développé par NICE-DEV.
            </p>
            <p className="text-gray-400 text-sm flex items-center">
              Fait avec <Heart className="h-4 w-4 text-red-500 mx-1" /> au Burkina Faso 🇧🇫
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;