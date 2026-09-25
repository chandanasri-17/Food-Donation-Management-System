import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  HeartHandshake,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building,
  Home as HomeIcon,
  Sparkles,
  Users,
  AlertCircle,
  Truck,
  PlusCircle,
} from 'lucide-react';
import { donationAPI } from '../services/api';
import FoodCard from '../components/FoodCard';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const Home = () => {
  const { isAuthenticated, isProvider, isNgo } = useAuth();
  const { refreshNotifications } = useNotifications();
  const [stats, setStats] = useState({
    totalDonations: 12,
    availableCount: 4,
    collectedCount: 7,
    totalServingsRescued: 380,
    totalProviders: 8,
    totalNgos: 6,
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonationForClaim, setSelectedDonationForClaim] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, donationsRes] = await Promise.allSettled([
          donationAPI.getImpactStats(),
          donationAPI.getAll({ status: 'available' }),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value?.data?.success) {
          setStats(statsRes.value.data.data);
        }
        if (donationsRes.status === 'fulfilled' && donationsRes.value?.data?.success) {
          setRecentDonations(donationsRes.value.data.data.slice(0, 6));
        }
      } catch (err) {
        console.warn('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClaim = async () => {
    if (!selectedDonationForClaim) return;
    setClaiming(true);
    try {
      await donationAPI.accept(selectedDonationForClaim._id);
      setClaimSuccessMessage('Donation successfully accepted! Please contact the provider for pickup.');
      refreshNotifications();
      // Remove claimed donation from list
      setRecentDonations((prev) =>
        prev.filter((d) => d._id !== selectedDonationForClaim._id)
      );
      setTimeout(() => {
        setSelectedDonationForClaim(null);
        setClaimSuccessMessage('');
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept donation. It may have already been claimed.');
      setSelectedDonationForClaim(null);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Decorative background glow circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Zero Food Waste Initiative
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Connecting <span className="text-emerald-400">Surplus Food</span> with{' '}
            <span className="text-amber-400">Shelters & Orphanages</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-200 font-normal leading-relaxed">
            Hotels, hostels, and food stalls often have wholesome extra meals. FoodBridge bridges the
            gap by notifying nearby verified NGOs and orphanages for immediate pickup.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isProvider ? (
              <Link
                to="/donations/create"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-950/40 text-sm"
              >
                <PlusCircle className="w-5 h-5 text-slate-900" />
                Post Surplus Food Now
              </Link>
            ) : isNgo ? (
              <Link
                to="/ngo/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-950/40 text-sm"
              >
                <UtensilsCrossed className="w-5 h-5 text-slate-900" />
                Browse Surplus Food Feed
              </Link>
            ) : (
              <>
                <Link
                  to="/register?role=provider"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-950/40 text-sm"
                >
                  <Building className="w-5 h-5 text-slate-900" />
                  I Have Surplus Food (Provider)
                </Link>
                <Link
                  to="/register?role=ngo"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-sm backdrop-blur-sm"
                >
                  <HeartHandshake className="w-5 h-5 text-amber-300" />
                  I Need Food (NGO / Orphanage)
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Live Impact Counters */}
        <div className="max-w-6xl mx-auto mt-16 pt-10 border-t border-emerald-700/40 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">
              {stats.totalServingsRescued || 350}+
            </p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Meals Rescued & Served</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-3xl sm:text-4xl font-black text-amber-300">
              {stats.availableCount || 4}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Active Surplus Posts</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-3xl sm:text-4xl font-black text-white">
              {stats.totalProviders || 8}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Partner Hotels & Hostels</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-3xl sm:text-4xl font-black text-emerald-300">
              {stats.totalNgos || 6}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Registered NGOs & Shelters</p>
          </div>
        </div>
      </section>

      {/* 4-Step How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600">Simple & Transparent</h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How The Food Rescue Flow Works
          </p>
          <p className="text-sm text-slate-500">
            From buffet extra to warm meals on plates in 4 straightforward steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-base flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Extra Food Available</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hotels, hostel messes, or stalls realize extra cooked food or bakery items remain surplus.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-base flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Food Posted</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Provider logs in, enters quantity, pickup address, and safe consumption window. Status is{' '}
              <span className="text-emerald-600 font-semibold">Available</span>.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-bold text-base flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">NGO Notified & Accepts</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nearby NGOs receive an instant notification, view details, and click{' '}
              <span className="text-amber-600 font-semibold">Accept Food</span> to claim it.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-bold text-base flex items-center justify-center mb-4">
              4
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1.5">Food Collected</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              NGO arrives for pickup. Both parties verify handover and mark status as{' '}
              <span className="text-blue-600 font-semibold">Collected</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Available Food Feed Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Live Available Surplus Food
            </h2>
            <p className="text-sm text-slate-500">
              Food items currently available for pickup right now
            </p>
          </div>
          {isNgo && (
            <Link
              to="/ngo/dashboard"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1.5"
            >
              Open Full NGO Feed & Filters <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading active donations...
          </div>
        ) : recentDonations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
            <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No Surplus Food Listed Right Now</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All surplus food has either been collected or none has been posted today. Food providers can post at any time!
            </p>
            {isProvider && (
              <Link
                to="/donations/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl"
              >
                <PlusCircle className="w-4 h-4" /> Post Extra Food
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentDonations.map((donation) => (
              <FoodCard
                key={donation._id}
                donation={donation}
                onAccept={(d) => setSelectedDonationForClaim(d)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Two-Sided Platform Value Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Food Providers */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-8 rounded-3xl border border-emerald-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">For Hotels, Hostels & Stalls</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Don't throw away edible surplus food after banquets, mess hours, or shifts. Post it on
              FoodBridge within 60 seconds and watch it bring smiles to shelters in your city.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Zero wastage of clean, edible meals
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Instant alerts sent to nearby registered NGOs
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Transparent status tracking from accepted to collected
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to={isProvider ? '/donations/create' : '/register?role=provider'}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950"
              >
                Post Food Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* For NGOs and Orphanages */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-8 rounded-3xl border border-amber-200/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">For NGOs, Orphanages & Shelters</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gain access to high-quality, freshly prepared food donations free of cost. Feed the children
              and communities you care for with nutritious hot meals.
            </p>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                Real-time alerts when fresh food is posted in your area
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                View quantities, dietary info & exact pickup locations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                1-click reservation to prevent duplicate pickups
              </li>
            </ul>
            <div className="pt-2">
              <Link
                to={isNgo ? '/ngo/dashboard' : '/register?role=ngo'}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950"
              >
                Explore Surplus Feed <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Claim Confirmation Modal */}
      <Modal
        isOpen={!!selectedDonationForClaim}
        onClose={() => {
          if (!claiming) setSelectedDonationForClaim(null);
        }}
        title="Confirm Food Collection"
      >
        {selectedDonationForClaim && (
          <div className="space-y-4">
            {claimSuccessMessage ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-sm font-medium border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{claimSuccessMessage}</span>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-600">
                  You are about to accept the following food donation on behalf of your organization.
                  Please ensure you have transportation ready for timely pickup:
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                  <p className="font-bold text-slate-900 text-sm">
                    {selectedDonationForClaim.title}
                  </p>
                  <p className="text-slate-600">
                    <strong>Quantity:</strong> {selectedDonationForClaim.quantity} (~
                    {selectedDonationForClaim.servingsApprox} servings)
                  </p>
                  <p className="text-slate-600">
                    <strong>Pickup Location:</strong> {selectedDonationForClaim.pickupAddress?.street},{' '}
                    {selectedDonationForClaim.pickupAddress?.city}
                  </p>
                  <p className="text-slate-600">
                    <strong>Provider:</strong> {selectedDonationForClaim.provider?.name} (Phone:{' '}
                    {selectedDonationForClaim.pickupAddress?.contactPhone})
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedDonationForClaim(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClaim}
                    disabled={claiming}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm disabled:opacity-50"
                  >
                    {claiming ? 'Accepting...' : 'Confirm & Accept Food'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;
