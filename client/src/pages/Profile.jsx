import React, { useState } from 'react';
import {
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { ORG_TYPE_LABELS } from '../utils/helpers';

const Profile = () => {
  const { user, updateProfileState, isProvider } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    organizationType: user?.organizationType || 'other',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    description: user?.description || '',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        organizationType: formData.organizationType,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        description: formData.description,
      };

      const res = await authAPI.updateProfile(payload);
      if (res.data?.success) {
        updateProfileState(res.data.user);
        setSuccessMsg('Organization profile updated successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD5] shadow-xs space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF3E8] text-[#5C4D43] border border-[#E8D59E]/40 flex items-center justify-center font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#2B2421]">{user?.name}</h1>
            <p className="text-xs text-[#706660] flex items-center gap-2 mt-0.5">
              <span className="font-semibold text-[#5C4D43] bg-[#FAF3E8] px-2 py-0.5 rounded-md border border-[#E8D59E]/40">
                {isProvider ? 'Food Provider Account' : 'NGO / Shelter Account'}
              </span>
              <span>•</span>
              <span>{user?.email}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD5] shadow-xs space-y-6">
        <h2 className="text-base font-bold text-[#2B2421] border-b border-[#FAF8F6] pb-3">
          Edit Organization Information & Pickup Address
        </h2>

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-[#FAF5E8] border border-[#E8D59E] text-[#6B5728] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#8C733E] shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-[#F9F1EE] border border-[#D9BBB0] text-[#754034] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#706660] uppercase tracking-wide mb-1.5">
                Organization / Establishment Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD5] text-[#2B2421] text-sm focus:outline-none focus:ring-2 focus:ring-[#AD9C8E]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#706660] uppercase tracking-wide mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD5] text-[#2B2421] text-sm focus:outline-none focus:ring-2 focus:ring-[#AD9C8E]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#706660] uppercase tracking-wide mb-1.5">
              Organization Type
            </label>
            <select
              name="organizationType"
              value={formData.organizationType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD5] text-[#2B2421] text-sm focus:outline-none focus:ring-2 focus:ring-[#AD9C8E] bg-white"
            >
              {isProvider ? (
                <>
                  <option value="hotel">Hotel & Restaurant</option>
                  <option value="hostel">Hostel Mess</option>
                  <option value="restaurant">Restaurant / Cafe</option>
                  <option value="food_stall">Food Stall / Food Truck</option>
                  <option value="caterer">Catering Service</option>
                  <option value="other">Other Food Establishment</option>
                </>
              ) : (
                <>
                  <option value="orphanage">Children's Orphanage</option>
                  <option value="ngo">Non-Profit NGO</option>
                  <option value="shelter">Homeless / Community Shelter</option>
                  <option value="other">Community Volunteer Org</option>
                </>
              )}
            </select>
          </div>

          {/* Address */}
          <div className="space-y-2 pt-2">
            <label className="block font-bold text-[#706660] uppercase tracking-wide">
              {isProvider ? 'Default Pickup Address' : 'Facility Location'}
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="Street / Building Address"
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD5] text-[#2B2421] text-sm focus:outline-none focus:ring-2 focus:ring-[#AD9C8E] placeholder:text-[#AD9C8E]"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] text-[#2B2421] text-sm focus:outline-none focus:ring-2 focus:ring-[#AD9C8E] placeholder:text-[#AD9C8E]"
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] text-[#2B2421] text-sm focus:outline-none focus:ring-2 focus:ring-[#AD9C8E] placeholder:text-[#AD9C8E]"
              />
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] text-[#2B2421] text-sm focus:outline-none focus:ring-2 focus:ring-[#AD9C8E] placeholder:text-[#AD9C8E]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#706660] uppercase tracking-wide mb-1.5">
              Description / Bio
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell others about your mission or kitchen details..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD5] text-[#2B2421] text-sm focus:outline-none focus:ring-2 focus:ring-[#AD9C8E] placeholder:text-[#AD9C8E]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#5C4D43] hover:bg-[#483C34] shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                </>
              ) : (
                'Save Profile Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
