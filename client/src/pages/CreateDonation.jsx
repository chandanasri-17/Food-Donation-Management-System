import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Clock,
  MapPin,
  AlertCircle,
  Loader2,
  PlusCircle,
  ArrowLeft,
  Calendar,
  Users,
} from 'lucide-react';
import { donationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const CreateDonation = () => {
  const { user } = useAuth();
  const { refreshNotifications } = useNotifications();
  const navigate = useNavigate();

  // Helper to get formatted default expiry (default: 4 hours from now)
  const getDefaultExpiry = (hoursAhead = 4) => {
    const d = new Date(Date.now() + hoursAhead * 60 * 60 * 1000);
    // Format to YYYY-MM-DDTHH:mm for datetime-local input
    return d.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: '',
    foodType: 'cooked_meals',
    dietaryType: 'vegetarian',
    quantity: '',
    servingsApprox: 20,
    expiryTime: getDefaultExpiry(4),
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    contactPerson: user?.name || '',
    contactPhone: user?.phone || '',
    specialInstructions: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePresetExpiry = (hours) => {
    setFormData((prev) => ({
      ...prev,
      expiryTime: getDefaultExpiry(hours),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title || !formData.quantity || !formData.expiryTime) {
      setErrorMsg('Please fill in title, quantity, and safe consumption time limit.');
      return;
    }

    if (new Date(formData.expiryTime) <= new Date()) {
      setErrorMsg('Expiry time must be set in the future.');
      return;
    }

    if (!formData.city || !formData.contactPhone) {
      setErrorMsg('Please specify pickup city and contact phone.');
      return;
    }

    setSubmitting(true);

    const payload = {
      title: formData.title,
      foodType: formData.foodType,
      dietaryType: formData.dietaryType,
      quantity: formData.quantity,
      servingsApprox: Number(formData.servingsApprox) || 10,
      preparedAt: new Date(),
      expiryTime: new Date(formData.expiryTime),
      pickupAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
      },
      specialInstructions: formData.specialInstructions,
    };

    try {
      const res = await donationAPI.create(payload);
      if (res.data?.success) {
        refreshNotifications();
        navigate('/provider/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to post surplus food.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to="/provider/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <UtensilsCrossed className="w-3.5 h-3.5" />
          Surplus Food Posting Form
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Post Available Surplus Food
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Provide accurate details regarding your surplus food so nearby NGOs and orphanages can
          arrange timely collection.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Food Category */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Food Title / Name *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. 50 Boxes of Paneer Biryani & Dal"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Category *
                </label>
                <select
                  name="foodType"
                  value={formData.foodType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="cooked_meals">Cooked Meals (Rice, Curries, Rotis)</option>
                  <option value="bakery">Bakery & Breads</option>
                  <option value="raw_groceries">Raw Groceries / Ingredients</option>
                  <option value="packaged_food">Packaged / Canned Food</option>
                  <option value="fruits_vegetables">Fresh Fruits & Vegetables</option>
                  <option value="beverages">Beverages / Juices</option>
                  <option value="other">Other Food Items</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Dietary Classification *
                </label>
                <select
                  name="dietaryType"
                  value={formData.dietaryType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="vegetarian">Vegetarian (Veg)</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="mixed">Mixed Assortment</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quantity & Servings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Quantity (Units / Weight) *
              </label>
              <input
                type="text"
                name="quantity"
                required
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 40 containers (~15 kg)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Approximate People It Can Feed *
              </label>
              <input
                type="number"
                name="servingsApprox"
                min="1"
                required
                value={formData.servingsApprox}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Expiry / Safe Window */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <label className="block text-xs font-bold text-amber-900 uppercase tracking-wide">
                Safe Consumption / Must Collect Before *
              </label>
            </div>
            <p className="text-xs text-amber-800">
              Set the latest acceptable pickup time so NGOs arrive while the food is fresh and safe.
            </p>

            <input
              type="datetime-local"
              name="expiryTime"
              required
              value={formData.expiryTime}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-xl border border-amber-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-amber-800 font-medium">Quick presets:</span>
              <button
                type="button"
                onClick={() => handlePresetExpiry(3)}
                className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold"
              >
                +3 Hours
              </button>
              <button
                type="button"
                onClick={() => handlePresetExpiry(6)}
                className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold"
              >
                +6 Hours
              </button>
              <button
                type="button"
                onClick={() => handlePresetExpiry(12)}
                className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold"
              >
                +12 Hours
              </button>
              <button
                type="button"
                onClick={() => handlePresetExpiry(24)}
                className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold"
              >
                Tomorrow (+24h)
              </button>
            </div>
          </div>

          {/* Pickup Address */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Pickup Location & Contact Info
            </h3>

            <div>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street Address / Kitchen Gate No."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="City *"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Contact Person (e.g. Chef / Manager)"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                name="contactPhone"
                required
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Contact Phone Number *"
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Pickup Instructions & Packaging Notes
            </label>
            <textarea
              name="specialInstructions"
              rows="3"
              value={formData.specialInstructions}
              onChange={handleChange}
              placeholder="e.g. Please bring clean vessels or insulated boxes. Come to delivery bay door #2."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting Surplus Food & Notifying NGOs...
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  Publish Surplus Food Listing
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDonation;
