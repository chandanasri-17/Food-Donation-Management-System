import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  PackageCheck,
  AlertCircle,
  Trash2,
  ArrowRight,
  Phone,
  Building,
  Users,
  HandHeart,
  RefreshCw,
} from 'lucide-react';
import { donationAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { formatDate, getExpiryStatus, FOOD_TYPE_LABELS } from '../utils/helpers';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const { refreshNotifications } = useNotifications();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchMyDonations = async () => {
    setLoading(true);
    try {
      const res = await donationAPI.getMyDonations();
      if (res.data?.success) {
        setDonations(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load provider donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const handleMarkCollected = async (donationId) => {
    setActionLoadingId(donationId);
    try {
      await donationAPI.updateStatus(donationId, 'collected');
      refreshNotifications();
      fetchMyDonations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update donation status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (donationId) => {
    if (!window.confirm('Are you sure you want to remove this surplus food posting?')) return;
    setActionLoadingId(donationId);
    try {
      await donationAPI.delete(donationId);
      refreshNotifications();
      setDonations((prev) => prev.filter((d) => d._id !== donationId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete donation.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Compute metrics
  const availableCount = donations.filter((d) => d.status === 'available').length;
  const acceptedCount = donations.filter((d) => d.status === 'accepted').length;
  const collectedCount = donations.filter((d) => d.status === 'collected').length;
  const totalServings = donations
    .filter((d) => d.status === 'collected')
    .reduce((sum, d) => sum + (d.servingsApprox || 0), 0);

  const filteredDonations = donations.filter((d) => {
    if (statusFilter === 'all') return true;
    return d.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD5] shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8F5345]">
            Food Provider Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2B2421] mt-1">
            {user?.name || 'Provider Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-[#706660] mt-1">
            Track surplus food postings, communicate with collecting NGOs, and verify pickups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMyDonations}
            className="p-3 text-[#706660] hover:text-[#2B2421] bg-white border border-[#E8DFD5] hover:bg-[#FAF8F6] rounded-xl transition-colors shadow-xs"
            title="Refresh Data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link
            to="/donations/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-[#5C4D43] hover:bg-[#483C34] shadow-xs text-sm transition-all"
          >
            <PlusCircle className="w-5 h-5 text-[#F7E6CA]" /> Post Surplus Food
          </Link>
        </div>
      </div>

      {/* Urgent Alert Banner if any food is accepted awaiting pickup */}
      {acceptedCount > 0 && (
        <div className="bg-[#F9F1EE] border-2 border-[#D9BBB0] rounded-2xl p-4 sm:p-5 flex items-start gap-3">
          <Clock className="w-6 h-6 text-[#8F5345] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <h3 className="font-bold text-[#754034]">
              {acceptedCount} Food Donation{acceptedCount > 1 ? 's' : ''} Accepted for Collection!
            </h3>
            <p className="text-[#754034]/90 mt-0.5">
              An NGO or orphanage has accepted your donation and will arrive shortly for pickup.
              Please check claimant details below and mark as "Collected" once handed over.
            </p>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD5] shadow-xs">
          <div className="flex items-center justify-between text-[#706660] text-xs mb-2">
            <span>Total Listings</span>
            <Building className="w-4 h-4 text-[#AD9C8E]" />
          </div>
          <p className="text-2xl font-bold text-[#2B2421]">{donations.length}</p>
          <span className="text-[11px] text-[#AD9C8E] mt-1 block">Lifetime surplus posts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD5] shadow-xs">
          <div className="flex items-center justify-between text-[#706660] text-xs mb-2">
            <span>Currently Available</span>
            <span className="w-2 h-2 rounded-full bg-[#8C733E] animate-pulse" />
          </div>
          <p className="text-2xl font-bold text-[#6B5728]">{availableCount}</p>
          <span className="text-[11px] text-[#AD9C8E] mt-1 block">Awaiting claim</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD5] shadow-xs">
          <div className="flex items-center justify-between text-[#706660] text-xs mb-2">
            <span>In-Transit / Claimed</span>
            <Clock className="w-4 h-4 text-[#8F5345]" />
          </div>
          <p className="text-2xl font-bold text-[#8F5345]">{acceptedCount}</p>
          <span className="text-[11px] text-[#AD9C8E] mt-1 block">Awaiting physical pickup</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD5] shadow-xs">
          <div className="flex items-center justify-between text-[#706660] text-xs mb-2">
            <span>Servings Rescued</span>
            <Users className="w-4 h-4 text-[#5C4D43]" />
          </div>
          <p className="text-2xl font-bold text-[#5C4D43]">~{totalServings}</p>
          <span className="text-[11px] text-[#AD9C8E] mt-1 block">{collectedCount} donations rescued</span>
        </div>
      </div>

      {/* Donation Management Section */}
      <div className="bg-white rounded-3xl border border-[#E8DFD5] shadow-xs overflow-hidden">
        {/* Table/List Filter Header */}
        <div className="p-5 sm:p-6 border-b border-[#FAF8F6] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#2B2421]">Your Food Donations</h2>
            <p className="text-xs text-[#706660]">
              Manage your postings and verify when food is collected
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'available', 'accepted', 'collected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all shrink-0 ${
                  statusFilter === tab
                    ? 'bg-[#5C4D43] text-white shadow-xs'
                    : 'bg-white border border-[#E8DFD5] text-[#706660] hover:bg-[#FAF8F6]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-16 text-center text-[#AD9C8E] text-xs">
            <div className="w-8 h-8 border-4 border-[#5C4D43] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading your donations...
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <PackageCheck className="w-12 h-12 text-[#AD9C8E] mx-auto" />
            <h3 className="font-bold text-[#2B2421] text-sm">No donations found in this tab</h3>
            <p className="text-xs text-[#706660] max-w-sm mx-auto">
              {statusFilter === 'all'
                ? "You haven't posted any surplus food yet. Create your first post to help feed someone in need!"
                : `No donations currently marked as "${statusFilter}".`}
            </p>
            {statusFilter === 'all' && (
              <Link
                to="/donations/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#5C4D43] hover:bg-[#483C34] rounded-xl transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-[#F7E6CA]" /> Post Food
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#FAF8F6]">
            {filteredDonations.map((donation) => {
              const expiry = getExpiryStatus(donation.expiryTime);
              const isClaimed = donation.status === 'accepted';

              return (
                <div
                  key={donation._id}
                  className={`p-5 sm:p-6 transition-colors ${
                    isClaimed ? 'bg-[#FAF3E8]/40' : 'hover:bg-[#FAF8F6]'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Food Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={donation.status} size="sm" />
                        <span className="text-xs font-semibold text-[#5C4D43] bg-[#FAF3E8] border border-[#E8D59E]/40 px-2 py-0.5 rounded-md">
                          {FOOD_TYPE_LABELS[donation.foodType] || 'Prepared Food'}
                        </span>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${expiry.color}`}>
                          {expiry.text}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#2B2421]">
                        {donation.title}
                      </h3>

                      <div className="text-xs text-[#706660] flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span>Quantity: <strong className="text-[#2B2421]">{donation.quantity}</strong></span>
                        <span>•</span>
                        <span>Estimated: <strong className="text-[#2B2421]">~{donation.servingsApprox} meals</strong></span>
                        <span>•</span>
                        <span>Posted on: <strong className="text-[#2B2421]">{formatDate(donation.createdAt)}</strong></span>
                      </div>

                      {/* If Accepted by an NGO: Highlight claimant info */}
                      {isClaimed && donation.claimedBy && (
                        <div className="mt-3 p-3 bg-white rounded-xl border border-[#D9BBB0] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#F9F1EE] text-[#754034] flex items-center justify-center shrink-0 border border-[#D9BBB0]">
                              <HandHeart className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs text-[#754034] font-bold">
                                Accepted by: {donation.claimedBy.name}
                              </p>
                              <p className="text-[11px] text-[#706660] flex items-center gap-1.5 mt-0.5">
                                <Phone className="w-3 h-3 text-[#5C4D43]" />
                                Contact: {donation.claimedBy.phone || 'Phone upon arrival'}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleMarkCollected(donation._id)}
                            disabled={actionLoadingId === donation._id}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#5C4D43] hover:bg-[#483C34] rounded-lg shadow-xs transition-colors shrink-0 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#F7E6CA]" />
                            {actionLoadingId === donation._id ? 'Updating...' : 'Confirm Handover & Collected'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
                      <Link
                        to={`/donations/${donation._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#5C4D43] bg-white hover:bg-[#FAF8F6] border border-[#E8DFD5] rounded-xl transition-colors shadow-xs"
                      >
                        Full Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {donation.status === 'available' && (
                        <button
                          onClick={() => handleDelete(donation._id)}
                          disabled={actionLoadingId === donation._id}
                          className="p-2 text-[#AD9C8E] hover:text-[#8F5345] hover:bg-[#F9F1EE] rounded-xl transition-colors"
                          title="Cancel/Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
