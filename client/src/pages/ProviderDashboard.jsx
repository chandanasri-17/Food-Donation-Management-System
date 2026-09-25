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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Food Provider Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {user?.name || 'Provider Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track surplus food postings, communicate with collecting NGOs, and verify pickups.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchMyDonations}
            className="p-3 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link
            to="/donations/create"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 text-sm transition-all"
          >
            <PlusCircle className="w-5 h-5" /> Post Surplus Food
          </Link>
        </div>
      </div>

      {/* Urgent Alert Banner if any food is accepted awaiting pickup */}
      {acceptedCount > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
          <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <h3 className="font-bold text-amber-900">
              {acceptedCount} Food Donation{acceptedCount > 1 ? 's' : ''} Accepted for Collection!
            </h3>
            <p className="text-amber-800 mt-0.5">
              An NGO or orphanage has accepted your donation and will arrive shortly for pickup.
              Please check claimant details below and mark as "Collected" once handed over.
            </p>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Listings</span>
            <Building className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{donations.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Lifetime surplus posts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Currently Available</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-2xl font-bold text-emerald-600">{availableCount}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Awaiting claim</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>In-Transit / Claimed</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">{acceptedCount}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Awaiting physical pickup</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Servings Rescued</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600">~{totalServings}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">{collectedCount} donations rescued</span>
        </div>
      </div>

      {/* Donation Management Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table/List Filter Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Food Donations</h2>
            <p className="text-xs text-slate-500">
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
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-xs">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading your donations...
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <PackageCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No donations found in this tab</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {statusFilter === 'all'
                ? "You haven't posted any surplus food yet. Create your first post to help feed someone in need!"
                : `No donations currently marked as "${statusFilter}".`}
            </p>
            {statusFilter === 'all' && (
              <Link
                to="/donations/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl"
              >
                <PlusCircle className="w-4 h-4" /> Post Food
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredDonations.map((donation) => {
              const expiry = getExpiryStatus(donation.expiryTime);
              const isClaimed = donation.status === 'accepted';

              return (
                <div
                  key={donation._id}
                  className={`p-5 sm:p-6 transition-colors ${
                    isClaimed ? 'bg-amber-50/40' : 'hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Food Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={donation.status} size="sm" />
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {FOOD_TYPE_LABELS[donation.foodType] || 'Prepared Food'}
                        </span>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${expiry.color}`}>
                          {expiry.text}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">
                        {donation.title}
                      </h3>

                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span>Quantity: <strong className="text-slate-700">{donation.quantity}</strong></span>
                        <span>•</span>
                        <span>Estimated: <strong className="text-slate-700">~{donation.servingsApprox} meals</strong></span>
                        <span>•</span>
                        <span>Posted on: <strong className="text-slate-700">{formatDate(donation.createdAt)}</strong></span>
                      </div>

                      {/* If Accepted by an NGO: Highlight claimant info */}
                      {isClaimed && donation.claimedBy && (
                        <div className="mt-3 p-3 bg-white rounded-xl border border-amber-300 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                              <HandHeart className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs text-amber-900 font-bold">
                                Accepted by: {donation.claimedBy.name}
                              </p>
                              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <Phone className="w-3 h-3 text-emerald-600" />
                                Contact: {donation.claimedBy.phone || 'Phone upon arrival'}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleMarkCollected(donation._id)}
                            disabled={actionLoadingId === donation._id}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors shrink-0 disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {actionLoadingId === donation._id ? 'Updating...' : 'Confirm Handover & Collected'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
                      <Link
                        to={`/donations/${donation._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        Full Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {donation.status === 'available' && (
                        <button
                          onClick={() => handleDelete(donation._id)}
                          disabled={actionLoadingId === donation._id}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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
