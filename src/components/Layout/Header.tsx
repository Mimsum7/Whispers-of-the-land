import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, PlusCircle, Users, Home } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Library', icon: Home },
    { path: '/submit', label: 'Submit Story', icon: PlusCircle },
    { path: '/admin', label: 'Admin', icon: Users },
  ];

  return (
    <header className="bg-forest-600 text-cream-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-ochre-400 p-2 rounded-lg group-hover:bg-ochre-300 transition-colors">
              <BookOpen className="h-8 w-8 text-forest-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif">Whispers of the Land</h1>
              <p className="text-sm text-cream-200">African Folklore Digital Library</p>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-ochre-500 text-forest-800 font-semibold'
                    : 'hover:bg-forest-500 text-cream-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="md:hidden">
            <button className="text-cream-100 hover:text-ochre-300 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;