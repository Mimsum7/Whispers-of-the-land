import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, PlusCircle, Users, Home, LogOut, User, Menu, X, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, profile, isAdmin, signOut, loading, reconnect } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);

  const navItems = [
    { path: '/', label: 'Library', icon: Home, public: true },
    { path: '/submit', label: 'Submit Story', icon: PlusCircle, public: true },
    { path: '/admin', label: 'Admin', icon: Users, adminOnly: true },
  ];

  const visibleNavItems = navItems.filter(item => 
    item.public || (item.adminOnly && isAdmin)
  );

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const handleReconnect = async () => {
    setReconnecting(true);
    try {
      await reconnect();
    } catch (error) {
      console.error('Reconnection failed:', error);
    } finally {
      setReconnecting(false);
    }
  };

  // Debug logging
  console.log('Header render - User:', user?.email, 'Profile:', profile?.email, 'IsAdmin:', isAdmin, 'Loading:', loading);

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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {visibleNavItems.map(({ path, label, icon: Icon }) => (
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

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-forest-500">
                <div className="flex items-center space-x-2 text-cream-200">
                  <User className="h-4 w-4" />
                  <span className="text-sm">
                    {profile?.full_name || user.email}
                    {isAdmin && <span className="ml-1 text-ochre-300 font-semibold">(Admin)</span>}
                    {loading && <span className="ml-1 text-cream-400">(Loading...)</span>}
                  </span>
                </div>
                
                {/* Reconnect Button */}
                <button
                  onClick={handleReconnect}
                  disabled={reconnecting}
                  className="flex items-center space-x-1 text-cream-200 hover:text-cream-100 transition-colors disabled:opacity-50"
                  title="Reconnect to Supabase"
                >
                  <RefreshCw className={`h-4 w-4 ${reconnecting ? 'animate-spin' : ''}`} />
                </button>
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-cream-200 hover:text-cream-100 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 px-4 py-2 bg-ochre-500 hover:bg-ochre-600 text-forest-800 rounded-lg transition-colors font-medium"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-cream-100 hover:text-ochre-300 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-forest-500">
            <nav className="flex flex-col space-y-2 mt-4">
              {visibleNavItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                    location.pathname === path
                      ? 'bg-ochre-500 text-forest-800 font-semibold'
                      : 'hover:bg-forest-500 text-cream-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}

              {/* Mobile User Menu */}
              <div className="pt-4 border-t border-forest-500 mt-4">
                {user ? (
                  <>
                    <div className="flex items-center space-x-2 px-4 py-2 text-cream-200">
                      <User className="h-4 w-4" />
                      <span className="text-sm">
                        {profile?.full_name || user.email}
                        {isAdmin && <span className="ml-1 text-ochre-300 font-semibold">(Admin)</span>}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleReconnect}
                      disabled={reconnecting}
                      className="flex items-center space-x-2 px-4 py-3 text-cream-200 hover:text-cream-100 hover:bg-forest-500 rounded-lg transition-colors w-full text-left disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 ${reconnecting ? 'animate-spin' : ''}`} />
                      <span>{reconnecting ? 'Reconnecting...' : 'Reconnect'}</span>
                    </button>
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-3 text-cream-200 hover:text-cream-100 hover:bg-forest-500 rounded-lg transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 bg-ochre-500 hover:bg-ochre-600 text-forest-800 rounded-lg transition-colors font-medium"
                  >
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;