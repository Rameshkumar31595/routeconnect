import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Save, X, Settings, Shield } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    setLoading(true);
    try {
      await updateProfile(name, email, phone);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError((e as Error).message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setError('');
    setSuccess('');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F2ED] text-[#1F2933] flex flex-col">
      <Navbar />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10 space-y-6">
        
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#146B5B] text-white">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#1F2933]">Account Profile</h1>
            <p className="text-xs text-[#667085] font-semibold">Manage your personal info and planner preferences</p>
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-3">
          
          {/* Unified Profile Card */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white border border-[#D9DED9] rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#D9DED9] pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[#146B5B] text-sm font-black border border-[#D9DED9]">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1F2933]">{user?.name}</h3>
                    <p className="text-xs text-[#667085] font-semibold">RouteConnect Member</p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-xl border border-[#D9DED9] bg-white px-4 py-2 text-xs font-black text-[#146B5B] hover:bg-gray-50 transition"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* User Details Form/List */}
              <div>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-extrabold text-[#667085] uppercase mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-[#D9DED9] bg-white px-4 py-2.5 text-sm text-[#1F2933] outline-none focus:border-[#146B5B] focus:ring-1 focus:ring-[#146B5B]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-extrabold text-[#667085] uppercase mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-[#D9DED9] bg-white pl-10 pr-4 py-2.5 text-sm text-[#1F2933] outline-none focus:border-[#146B5B] focus:ring-1 focus:ring-[#146B5B]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-[#667085] uppercase mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-xl border border-[#D9DED9] bg-white pl-10 pr-4 py-2.5 text-sm text-[#1F2933] outline-none focus:border-[#146B5B] focus:ring-1 focus:ring-[#146B5B]"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-750 font-bold">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-3 pt-3">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex-1 py-2.5 bg-[#146B5B] hover:bg-[#0f5447] text-white font-extrabold rounded-xl text-xs transition disabled:opacity-45"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1 py-2.5 border border-[#D9DED9] hover:bg-gray-50 text-[#1F2933] font-bold rounded-xl text-xs transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Grouped Details layout with borders
                  <div className="divide-y divide-[#D9DED9]">
                    <div className="py-3 flex justify-between items-center text-xs font-semibold">
                      <span className="text-[#667085]">Full Name</span>
                      <span className="text-[#1F2933] font-extrabold text-sm">{user?.name}</span>
                    </div>
                    <div className="py-3 flex justify-between items-center text-xs font-semibold">
                      <span className="text-[#667085]">Email Address</span>
                      <span className="text-[#1F2933] font-extrabold text-sm">{user?.email}</span>
                    </div>
                    <div className="py-3 flex justify-between items-center text-xs font-semibold">
                      <span className="text-[#667085]">Phone Number</span>
                      <span className="text-[#1F2933] font-extrabold text-sm">{user?.phone}</span>
                    </div>
                  </div>
                )}
              </div>

              {success && (
                <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-3.5 text-xs text-green-750 font-bold">
                  {success}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white border border-[#D9DED9] rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#146B5B]">
                <Settings className="h-4.5 w-4.5" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider">Account Settings</h4>
              </div>
              <p className="text-xs text-[#667085] leading-relaxed">
                Configure notification criteria, location filters, and saved route alerts.
              </p>
            </div>
            
            <div className="bg-white border border-[#D9DED9] rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-[#146B5B]">
                <Shield className="h-4.5 w-4.5" />
                <h4 className="text-xs font-extrabold uppercase tracking-wider">Privacy & Security</h4>
              </div>
              <p className="text-xs text-[#667085] leading-relaxed">
                Your credentials are kept encrypted inside local sqlite storage daemons.
              </p>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
