import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Github, MapPin, Globe, Mail, User, Save, Loader2, AlertCircle } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
}

interface GitHubProfile {
  name: string;
  login: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  bio: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [github, setGithub] = useState<GitHubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, githubRes] = await Promise.all([
          fetch('/api/user'),
          fetch('/api/github/profile')
        ]);

        const userData = await userRes.json();
        const githubData = await githubRes.json();

        setUser(userData);
        setFormData(userData);
        if (!githubData.error) setGithub(githubData);
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage(null);

    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred while updating' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Left Column: GitHub Overview */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass p-6 rounded-2xl border border-white/10 text-center">
            {github ? (
              <>
                <img 
                  src={github.avatar_url} 
                  alt={github.name} 
                  className="w-24 h-24 rounded-full mx-auto border-2 border-brand-purple mb-4"
                  referrerPolicy="no-referrer"
                />
                <h2 className="text-xl font-bold">{github.name}</h2>
                <p className="text-white/60 text-sm mb-4">@{github.login}</p>
                <div className="flex justify-center gap-4 text-sm">
                  <div className="text-center">
                    <span className="block font-bold">{github.public_repos}</span>
                    <span className="text-white/40 text-[10px] uppercase">Repos</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold">{github.followers}</span>
                    <span className="text-white/40 text-[10px] uppercase">Followers</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <a 
                    href={`https://github.com/${github.login}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    View GitHub Profile
                  </a>
                </div>
              </>
            ) : (
              <div className="py-8 text-white/40">
                <Github className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">GitHub not connected</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: User Info & Edit */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass p-8 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <User className="w-6 h-6 text-brand-purple" />
                User Profile
              </h1>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Full Name</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-purple transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60">Email Address</label>
                  <input 
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 opacity-50 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Bio</label>
                <textarea 
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-purple transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Location
                  </label>
                  <input 
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-purple transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/60 flex items-center gap-2">
                    <Globe className="w-3 h-3" /> Website
                  </label>
                  <input 
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-purple transition-colors"
                  />
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
                  message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {message.type === 'success' ? <Save className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {message.text}
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={updating}
                  className="w-full md:w-auto px-8 py-3 bg-brand-purple text-white rounded-full font-bold hover:bg-brand-purple/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
