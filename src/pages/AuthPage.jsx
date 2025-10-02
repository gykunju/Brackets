import React, { useState } from 'react';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { signIn, signUp } from '../services/authService';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (isSignUp) {
      if (!formData.fullName || formData.fullName.trim().length < 2) {
        setError('Please enter your full name (at least 2 characters)');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear messages
    setError('');
    setSuccess('');

    // Validate
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // ========== SIGNUP ==========
        console.log('📝 Starting signup process...');
        
        const { user, session, error: signUpError } = await signUp(
          formData.email.trim().toLowerCase(),
          formData.password,
          formData.fullName.trim()
        );

        if (signUpError) {
          setError(signUpError);
          setLoading(false);
          return;
        }

        if (user) {
          console.log('✅ User created:', user.id);
          
          // Check if email confirmation is required
          if (user.identities && user.identities.length === 0) {
            setSuccess('✅ Account created! Please check your email to confirm your account.');
            setLoading(false);
            return;
          }

          // If we have a session, user is automatically signed in
          if (session) {
            setSuccess('✅ Account created successfully! Redirecting...');
            
            // Wait for database trigger to create profile
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Navigate to home
            navigate('/');
          } else {
            setSuccess('✅ Account created! You can now sign in.');
            // Switch to sign in mode
            setTimeout(() => {
              setIsSignUp(false);
              setFormData({ ...formData, fullName: '', confirmPassword: '' });
            }, 2000);
          }
        }
      } else {
        // ========== SIGNIN ==========
        console.log('🔓 Starting signin process...');
        
        const { user, session, error: signInError } = await signIn(
          formData.email.trim().toLowerCase(),
          formData.password
        );

        if (signInError) {
          setError(signInError);
          setLoading(false);
          return;
        }

        if (user && session) {
          console.log('✅ User signed in:', user.id);
          setSuccess('✅ Sign in successful! Redirecting...');
          
          // Small delay for user feedback
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Navigate to home
          navigate('/');
        }
      }
    } catch (err) {
      console.error('❌ Auth error:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setFormData({
      email: formData.email,
      password: '',
      fullName: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 geist-font">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-lime-800 dark:text-lime-500 mb-2">
            Brackets
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Community-Powered Learning Platform
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
              <FiAlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm text-red-800 dark:text-red-300 font-medium">Error</p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg flex items-start gap-3">
              <FiCheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm text-green-800 dark:text-green-300 font-medium">Success</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">{success}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-600"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-600"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-lime-700 hover:bg-lime-800 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={switchMode}
              disabled={loading}
              className="text-lime-700 hover:text-lime-800 dark:text-lime-500 font-medium transition-colors disabled:opacity-50"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          {/* Help Text */}
          {error && error.includes('Email authentication is disabled') && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm">
              <p className="text-yellow-800 dark:text-yellow-300 font-medium mb-1">⚠️ Setup Required</p>
              <p className="text-yellow-700 dark:text-yellow-400">
                Please enable Email Provider in Supabase Dashboard:
              </p>
              <p className="text-yellow-700 dark:text-yellow-400 mt-1 font-mono text-xs">
                Authentication → Providers → Email → Enable
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-2xl mb-1">📚</div>
            <p className="text-gray-600 dark:text-gray-400">Kenyan Curriculum</p>
          </div>
          <div>
            <div className="text-2xl mb-1">👥</div>
            <p className="text-gray-600 dark:text-gray-400">Village Circles</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🤖</div>
            <p className="text-gray-600 dark:text-gray-400">AI Tutor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
