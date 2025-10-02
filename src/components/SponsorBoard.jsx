import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiHeart, FiTrendingUp, FiGlobe } from 'react-icons/fi';
import { supabase } from '../config/supabase';

const SponsorCard = ({ sponsor }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="font-semibold text-lg">{sponsor.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{sponsor.type}</p>
      </div>
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white">
        {sponsor.type === 'business' ? '🏢' : '🌍'}
      </div>
    </div>
    
    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
      {sponsor.description}
    </p>
    
    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
      <div>
        <p className="text-xs text-gray-600 dark:text-gray-400">Total Contribution</p>
        <p className="text-lg font-bold text-green-600">${sponsor.total_contribution?.toLocaleString() || 0}</p>
      </div>
      <div>
        <p className="text-xs text-gray-600 dark:text-gray-400">Learners Supported</p>
        <p className="text-lg font-bold">{sponsor.learners_supported || 0}</p>
      </div>
    </div>
  </div>
);

const ContributionForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'individual',
    amount: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      email: '',
      type: 'individual',
      amount: '',
      message: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name/Organization</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="individual">Individual</option>
          <option value="business">Local Business</option>
          <option value="diaspora">Diaspora</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Contribution Amount ($)</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
          min="1"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Message (Optional)</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <button
        type="submit"
        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
      >
        Submit Contribution
      </button>
    </form>
  );
};

const SponsorBoard = () => {
  const [sponsors, setSponsors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    totalContributions: 0,
    totalSponsors: 0,
    learnersSupported: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .order('total_contribution', { ascending: false });

    if (!error && data) {
      setSponsors(data);
      
      // Calculate stats
      const totalContributions = data.reduce((sum, s) => sum + (s.total_contribution || 0), 0);
      const learnersSupported = data.reduce((sum, s) => sum + (s.learners_supported || 0), 0);
      
      setStats({
        totalContributions,
        totalSponsors: data.length,
        learnersSupported
      });
    }
    
    setLoading(false);
  };

  const handleContribution = async (formData) => {
    try {
      const { error } = await supabase
        .from('contributions')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            type: formData.type,
            amount: parseFloat(formData.amount),
            message: formData.message,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      
      setShowForm(false);
      alert('Thank you for your contribution! 🙏');
      loadSponsors();
    } catch (error) {
      console.error('Error submitting contribution:', error);
      alert('Failed to submit contribution. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 geist-font">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Community Sponsor Board</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Supporting education through local businesses and diaspora contributions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FiDollarSign className="text-green-600" size={24} />
              <span className="text-sm font-medium">Total Contributions</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              ${stats.totalContributions.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FiHeart className="text-lime-700" size={24} />
              <span className="text-sm font-medium">Active Sponsors</span>
            </div>
            <p className="text-3xl font-bold text-lime-700">
              {stats.totalSponsors}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <FiTrendingUp className="text-purple-600" size={24} />
              <span className="text-sm font-medium">Learners Supported</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {stats.learnersSupported}
            </p>
          </div>
        </div>

        {/* Contribute Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            {showForm ? 'Hide Form' : 'Contribute Now'}
          </button>
        </div>

        {/* Contribution Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-semibold mb-4">Make a Contribution</h2>
            <ContributionForm onSubmit={handleContribution} />
          </div>
        )}

        {/* Sponsors Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sponsors.map((sponsor) => (
            <SponsorCard key={sponsor.id} sponsor={sponsor} />
          ))}
        </div>

        {sponsors.length === 0 && (
          <div className="text-center py-12">
            <FiGlobe size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-gray-500">No sponsors yet. Be the first to contribute!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorBoard;
