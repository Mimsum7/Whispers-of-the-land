import React from 'react';
import { Heart, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-800 text-cream-100 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-ochre-300">About Whispers of the Land</h3>
            <p className="text-cream-200 leading-relaxed">
              Preserving the rich oral traditions of Africa through digital storytelling, 
              connecting generations and cultures through the power of folklore.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-ochre-300">Mission</h3>
            <p className="text-cream-200 leading-relaxed">
              To create a living digital archive that celebrates African storytelling 
              traditions while making them accessible to global audiences.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-ochre-300">Connect</h3>
            <div className="flex items-center space-x-4">
              <Globe className="h-5 w-5 text-ochre-400" />
              <span className="text-cream-200">Sharing stories worldwide</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-forest-600">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between relative">
            <p className="flex items-center justify-center space-x-2 text-cream-300 mb-4 md:mb-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-clay-400 fill-current" />
              <span>for African storytelling heritage</span>
            </p>
            
            <a
              href="https://bolt.new/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform duration-200 hover:scale-105 md:ml-auto"
            >
              <img
                src="/bolt badge.png"
                alt="Powered by Bolt.new"
                className="h-16 w-auto opacity-90 hover:opacity-100 transition-opacity duration-200"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;