import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Mail, Phone, MapPin, Linkedin, Save } from 'lucide-react';

interface Props {
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

const MissingInfoModal: React.FC<Props> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState({
    email: profile.email || '',
    phone: profile.phone || '',
    location: profile.location || '',
    linkedin: profile.linkedin || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...profile, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-slate-850 p-6 text-white">
          <h2 className="text-xl font-bold">Complete Your Profile</h2>
          <p className="text-slate-300 text-sm mt-1">
            We found some info missing from your GitHub. Add it to make your CV complete.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="pl-10 w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="pl-10 w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="pl-10 w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                placeholder="City, Country"
              />
            </div>
          </div>
          
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn (Optional)</label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="pl-10 w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                placeholder="linkedin.com/in/username"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02]"
            >
              <Save size={18} />
              Generate CV
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MissingInfoModal;