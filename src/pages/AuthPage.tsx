import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import PatternBorder from '../components/Common/PatternBorder';
import { useAuth } from '../contexts/AuthContext';

const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) {
          setError(error.message);
        } else {
          setError('');
          // Show success message for email confirmation
          setError('Please check your email to confirm your account before signing in.');
          setIsSignUp(false);
          setFormData({ email: formData.email, password: '', fullName: '', confirmPassword: '' });
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setError(error.message);
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-african-pattern flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back to home link */}
        <Link
          to="/"
          className="inline-flex items-center text-forest-600 hover:text-forest-700 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Library
        </Link>

        <PatternBorder>
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                {isSignUp ? (
                  <UserPlus className="h-10 w-10 text-ochre-500" />
                ) : (
                  <LogIn className="h-10 w-10 text-ochre-500" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-forest-700 mb-2 font-serif">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-forest-600">
                {isSignUp 
                  ? 'Join our community of storytellers' 
                  : 'Sign in to access admin features'
                }
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-clay-100 border border-clay-300 rounded-lg">
                <p className="text-clay-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">
                  <Lock className="inline h-4 w-4 mr-1" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">
                    <Lock className="inline h-4 w-4 mr-1" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ochre-500 hover:bg-ochre-600 disabled:bg-ochre-300 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  <>
                    {isSignUp ? (
                      <UserPlus className="h-5 w-5 mr-2" />
                    ) : (
                      <LogIn className="h-5 w-5 mr-2" />
                    )}
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setFormData({ email: '', password: '', fullName: '', confirmPassword: '' });
                }}
                className="text-ochre-600 hover:text-ochre-700 underline transition-colors"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </div>
        </PatternBorder>
      </div>
    </div>
  );
};

export default AuthPage;