import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Clock,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  HandHeart,
  Phone,
  Building,
  Users,
  RefreshCw,
  PackageCheck,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { donationAPI } from '../services/api';
import FoodCard from '../components/FoodCard';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { formatDate, getExpiryStatus, FOOD_TYPE_LABELS } from '../utils/helpers';

const NgoDashboard = () => {
  const { user } = useAuth();
  const { refreshNotifications } = useNotifications();

  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'claims'
  const [availableDonations, setAvailableDonations] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters for available feed
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all');

  // Claim modal state
  const [selectedDonationForClaim, setSelectedDonationForClaim] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [availableRes, claimsRes] = await Promise.allSettled([
        donationAPI.getAll({ status: 'available' }),
        donationAPI.getMyClaims(),
      ]);

      if (availableRes.status === 'fulfilled' && availableRes.value?.data?.success) {
        setAvailableDonations(availableRes.value.data.data);
      }
      if (claimsRes.status === 'fulfilled' && claimsRes.value?.data?.success) {
        setMyClaims(claimsRes.value.data.data);
      }
    } catch (err) {
      console.error('Error loading NGO dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClaim = async () => {
    if (!selectedDonationForClaim) return;
    setClaiming(true);
    try {
      await donationAPI.accept(selectedDonationForClaim._id);
      setClaimSuccessMessage('Donation accepted successfully! You can now proceed to pickup.');
      refreshNotifications();
      fetchData();
      setTimeout(() => {
        setSelectedDonationForClaim(null);
        setClaimSuccessMessage('');
        setActiveTab('claims');
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept donation. It may have already been claimed.');
      setSelectedDonationForClaim(null);
    } finally {
      setClaiming(false);
    }
  };

  const handleMarkCollected = async (donationId) => {
    setActionLoadingId(donationId);
    try {
      await donationAPI.updateStatus(donationId, 'collected');
      refreshNotifications();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update donation status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter available donations
  const filteredAvailable = availableDonations.filter((d) => {
    const matchesSearch =
      !searchTerm ||
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.pickupAddress?.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.provider?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || d.foodType === categoryFilter;
    const matchesDietary = dietaryFilter === 'all' || d.dietaryType === dietaryFilter;

    return matchesSearch && matchesCategory && matchesDietary;
  });

  const activeClaims = myClaims.filter((c) => c.status === 'accepted');
  const pastClaims = myClaims.filter((c) => c.status === 'collected');
  const totalMealsClaimed = pastClaims.reduce((sum, c) => sum + (c.servingsApprox || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD5] shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8F5345]">
            NGO & Orphanage Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2421] mt-1">
            {user?.name || 'NGO Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-[#706660] mt-1">
            Browse live surplus food offerings from local hotels and manage your collection pickups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#5C4D43] bg-white border border-[#E8DFD5] hover:bg-[#FAF8F6] rounded-xl transition-colors shadow-xs"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Feed
          </button>
        </div>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD5] shadow-xs">
          <div className="flex items-center justify-between text-[#706660] text-xs mb-2">
            <span>Surplus Available</span>
            <span className="w-2 h-2 rounded-full bg-[#8C733E] animate-pulse" />
          </div>
          <p className="text-2xl font-bold text-[#6B5728]">{availableDonations.length}</p>
          <span className="text-[11px] text-[#AD9C8E] mt-1 block">Ready for rescue right now</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD5] shadow-xs">
          <div className="flex items-center justify-between text-[#706660] text-xs mb-2">
            <span>Pending Pickups</span>
            <Clock className="w-4 h-4 text-[#8F5345]" />
          </div>
          <p className="text-2xl font-bold text-[#8F5345]">{activeClaims.length}</p>
          <span className="text-[11px] text-[#AD9C8E] mt-1 block">Accepted, awaiting collection</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD5] shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#706660] text-xs mb-2">
            <span>Meals Collected</span>
            <Users className="w-4 h-4 text-[#5C4D43]" />
          </div>
          <p className="text-2xl font-bold text-[#5C4D43]">~{totalMealsClaimed}</p>
          <span className="text-[11px] text-[#AD9C8E] mt-1 block">{pastClaims.length} completed rescues</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E8DFD5] gap-6">
        <button
          onClick={() => setActiveTab('available')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'available'
              ? 'border-[#5C4D43] text-[#5C4D43]'
              : 'border-transparent text-[#706660] hover:text-[#2B2421]'
          }`}
        >
          <UtensilsCrossed className="w-4 h-4" />
          Live Available Surplus Feed ({availableDonations.length})
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'claims'
              ? 'border-[#8F5345] text-[#8F5345]'
              : 'border-transparent text-[#706660] hover:text-[#2B2421]'
          }`}
        >
          <HandHeart className="w-4 h-4" />
          My Claimed Pickups ({activeClaims.length})
        </button>
      </div>

      {/* TAB 1: Available Surplus Food Feed */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8DFD5] shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#AD9C8E] absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by food or city..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E8DFD5] text-xs text-[#2B2421] focus:outline-none focus:ring-2 focus:ring-[#AD9C8E] placeholder:text-[#AD9C8E]"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] text-xs text-[#2B2421] focus:outline-none focus:ring-2 focus:ring-[#AD9C8E] bg-white"
              >
                <option value="all">All Categories</option>
                <option value="cooked_meals">Cooked Meals</option>
                <option value="bakery">Bakery & Breads</option>
                <option value="raw_groceries">Raw Groceries</option>
                <option value="packaged_food">Packaged Food</option>
                <option value="fruits_vegetables">Fruits & Veggies</option>
              </select>
            </div>

            {/* Dietary Filter */}
            <div>
              <select
                value={dietaryFilter}
                onChange={(e) => setDietaryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8DFD5] text-xs text-[#2B2421] focus:outline-none focus:ring-2 focus:ring-[#AD9C8E] bg-white"
              >
                <option value="all">All Dietary Types</option>
                <option value="vegetarian">Vegetarian Only</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="p-16 text-center text-[#AD9C8E] text-xs">
              <div className="w-8 h-8 border-4 border-[#5C4D43] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading available surplus food feed...
            </div>
          ) : filteredAvailable.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#E8DFD5] p-12 text-center space-y-3">
              <UtensilsCrossed className="w-12 h-12 text-[#AD9C8E] mx-auto" />
              <h3 className="font-bold text-[#2B2421] text-base">No Surplus Food Matches Your Filter</h3>
              <p className="text-xs text-[#706660] max-w-sm mx-auto">
                Try adjusting your search terms or filters. New surplus meals are posted regularly by partner hotels.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAvailable.map((donation) => (
                <FoodCard
                  key={donation._id}
                  donation={donation}
                  onAccept={(d) => setSelectedDonationForClaim(d)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: My Claimed Pickups */}
      {activeTab === 'claims' && (
        <div className="space-y-6">
          {/* Active Pickups awaiting collection */}
          <div>
            <h3 className="text-base font-bold text-[#2B2421] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8F5345]" />
              Active Collections In-Progress ({activeClaims.length})
            </h3>

            {activeClaims.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-[#E8DFD5] text-center text-xs text-[#706660]">
                You have no pending collections. Browse the Available Surplus Feed to claim extra meals!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {activeClaims.map((claim) => {
                  const expiry = getExpiryStatus(claim.expiryTime);
                  return (
                    <div
                      key={claim._id}
                      className="bg-white p-6 rounded-2xl border-2 border-[#D9BBB0] shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#FAF8F6] pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={claim.status} size="sm" />
                            <span className="text-xs text-[#AD9C8E]">
                              Accepted on {formatDate(claim.acceptedAt)}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-[#2B2421] mt-1">{claim.title}</h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMarkCollected(claim._id)}
                            disabled={actionLoadingId === claim._id}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#5C4D43] hover:bg-[#483C34] rounded-xl shadow-xs transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4 text-[#F7E6CA]" />
                            {actionLoadingId === claim._id ? 'Updating...' : 'Confirm Food Collected'}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1 bg-[#FAF8F6] p-3 rounded-xl border border-[#E8DFD5]">
                          <span className="text-[10px] font-bold text-[#AD9C8E] uppercase">Provider Contact</span>
                          <p className="font-bold text-[#2B2421]">{claim.provider?.name}</p>
                          <p className="text-[#706660] flex items-center gap-1.5 pt-1">
                            <Phone className="w-3.5 h-3.5 text-[#5C4D43]" />
                            <a href={`tel:${claim.pickupAddress?.contactPhone}`} className="hover:underline font-semibold text-[#5C4D43]">
                              {claim.pickupAddress?.contactPhone}
                            </a>
                          </p>
                          {claim.pickupAddress?.contactPerson && (
                            <p className="text-[#AD9C8E]">Contact: {claim.pickupAddress.contactPerson}</p>
                          )}
                        </div>

                        <div className="space-y-1 bg-[#FAF8F6] p-3 rounded-xl border border-[#E8DFD5]">
                          <span className="text-[10px] font-bold text-[#AD9C8E] uppercase">Pickup Location</span>
                          <p className="font-bold text-[#2B2421]">{claim.pickupAddress?.city}</p>
                          <p className="text-[#706660]">{claim.pickupAddress?.street}</p>
                          <p className="text-[#AD9C8E]">{claim.pickupAddress?.state} {claim.pickupAddress?.pincode}</p>
                        </div>

                        <div className="space-y-1 bg-[#FAF8F6] p-3 rounded-xl border border-[#E8DFD5]">
                          <span className="text-[10px] font-bold text-[#AD9C8E] uppercase">Quantity & Safe Time</span>
                          <p className="font-bold text-[#2B2421]">{claim.quantity} (~{claim.servingsApprox} meals)</p>
                          <p className={`font-semibold ${expiry.color} inline-block px-2 py-0.5 rounded text-[11px]`}>
                            {expiry.text}
                          </p>
                          {claim.specialInstructions && (
                            <p className="text-[#706660] italic mt-1">Note: {claim.specialInstructions}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Collected History */}
          <div className="pt-6">
            <h3 className="text-base font-bold text-[#2B2421] mb-3 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#5C4D43]" />
              Completed Food Pickups History ({pastClaims.length})
            </h3>

            {pastClaims.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-[#E8DFD5] text-center text-xs text-[#AD9C8E]">
                No past collected records yet.
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E8DFD5] overflow-hidden divide-y divide-[#FAF8F6]">
                {pastClaims.map((claim) => (
                  <div key={claim._id} className="p-4 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <h4 className="font-bold text-[#2B2421]">{claim.title}</h4>
                      <p className="text-[#706660]">
                        Provided by {claim.provider?.name} • Collected on {formatDate(claim.collectedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#5C4D43] bg-[#FAF3E8] border border-[#E8D59E]/40 px-2.5 py-1 rounded-lg">
                        +{claim.servingsApprox} meals fed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accept / Claim Modal */}
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
              <div className="p-4 bg-[#FAF5E8] text-[#6B5728] rounded-xl text-sm font-medium border border-[#E8D59E] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#8C733E] shrink-0" />
                <span>{claimSuccessMessage}</span>
              </div>
            ) : (
              <>
                <p className="text-xs text-[#706660]">
                  You are about to accept this surplus food listing on behalf of{' '}
                  <strong className="text-[#2B2421]">{user?.name}</strong>. Please confirm you have transportation available:
                </p>

                <div className="bg-[#FAF8F6] p-4 rounded-xl border border-[#E8DFD5] space-y-2 text-xs">
                  <p className="font-bold text-[#2B2421] text-sm">
                    {selectedDonationForClaim.title}
                  </p>
                  <p className="text-[#706660]">
                    <strong>Quantity:</strong> {selectedDonationForClaim.quantity} (~
                    {selectedDonationForClaim.servingsApprox} servings)
                  </p>
                  <p className="text-[#706660]">
                    <strong>Pickup Address:</strong> {selectedDonationForClaim.pickupAddress?.street},{' '}
                    {selectedDonationForClaim.pickupAddress?.city}
                  </p>
                  <p className="text-[#706660]">
                    <strong>Provider:</strong> {selectedDonationForClaim.provider?.name} (Phone:{' '}
                    {selectedDonationForClaim.pickupAddress?.contactPhone})
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedDonationForClaim(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#706660] hover:bg-[#FAF8F6] rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClaim}
                    disabled={claiming}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#5C4D43] hover:bg-[#483C34] rounded-xl shadow-xs disabled:opacity-50 transition-colors"
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

export default NgoDashboard;
