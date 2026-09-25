import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Building,
  Utensils,
  Users,
  CheckCircle2,
  AlertCircle,
  HandHeart,
  PackageCheck,
  Trash2,
  Calendar,
  Share2,
} from 'lucide-react';
import { donationAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import StatusStepper from '../components/StatusStepper';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  formatDate,
  getExpiryStatus,
  FOOD_TYPE_LABELS,
  DIETARY_LABELS,
  ORG_TYPE_LABELS,
} from '../utils/helpers';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isProvider, isNgo, isAuthenticated } = useAuth();
  const { refreshNotifications } = useNotifications();

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await donationAPI.getById(id);
      if (res.data?.success) {
        setDonation(res.data.data);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load food donation details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleAcceptDonation = async () => {
    setActionLoading(true);
    try {
      await donationAPI.accept(id);
      refreshNotifications();
      setClaimModalOpen(false);
      fetchDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept donation.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkCollected = async () => {
    setActionLoading(true);
    try {
      await donationAPI.updateStatus(id, 'collected');
      refreshNotifications();
      fetchDetails();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove this surplus food posting?')) return;
    setActionLoading(true);
    try {
      await donationAPI.delete(id);
      refreshNotifications();
      navigate('/provider/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete donation.');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading donation details...</p>
      </div>
    );
  }

  if (errorMsg || !donation) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">{errorMsg || 'Listing Not Found'}</h2>
        <p className="text-xs text-slate-500">The food donation listing may have been removed or does not exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  const expiry = getExpiryStatus(donation.expiryTime);
  const dietary = DIETARY_LABELS[donation.dietaryType] || DIETARY_LABELS.vegetarian;
  const isOwner = donation.provider?._id === user?.id;
  const isClaimant = donation.claimedBy?._id === user?.id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${dietary.badgeClass}`}>
                {dietary.label}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700">
                {FOOD_TYPE_LABELS[donation.foodType] || 'Prepared Food'}
              </span>
              <StatusBadge status={donation.status} size="md" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {donation.title}
            </h1>
          </div>

          {/* Expiry Pill */}
          <div className={`px-4 py-2 rounded-xl border text-xs font-semibold ${expiry.color} shrink-0`}>
            <Clock className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            {expiry.text}
          </div>
        </div>

        {/* Status Stepper Progression */}
        <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Rescue Progress Timeline
          </h3>
          <StatusStepper donation={donation} />
        </div>

        {/* Food Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">Estimated Servings</span>
            <p className="text-xl font-extrabold text-emerald-900 mt-1">~{donation.servingsApprox} People</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
            <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">Quantity</span>
            <p className="text-lg font-bold text-amber-900 mt-1 truncate" title={donation.quantity}>{donation.quantity}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Prepared Time</span>
            <p className="text-xs font-bold text-slate-800 mt-1">{formatDate(donation.preparedAt)}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Must Collect Before</span>
            <p className="text-xs font-bold text-slate-800 mt-1">{formatDate(donation.expiryTime)}</p>
          </div>
        </div>

        {/* Split Info Cards: Provider and Pickup Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Provider & Pickup Card */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Building className="w-5 h-5 text-emerald-600" />
              Food Provider & Pickup Location
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p>
                <strong className="text-slate-900">Establishment:</strong> {donation.provider?.name || 'Local Provider'}
              </p>
              <p>
                <strong className="text-slate-900">Type:</strong> {ORG_TYPE_LABELS[donation.provider?.organizationType] || 'Food Provider'}
              </p>
              <p className="flex items-start gap-1.5 pt-1">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {donation.pickupAddress?.street ? `${donation.pickupAddress.street}, ` : ''}
                  <strong>{donation.pickupAddress?.city}</strong>
                  {donation.pickupAddress?.state ? `, ${donation.pickupAddress.state}` : ''}
                  {donation.pickupAddress?.pincode ? ` - ${donation.pickupAddress.pincode}` : ''}
                </span>
              </p>
              <p className="flex items-center gap-1.5 pt-1">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Contact: <strong>{donation.pickupAddress?.contactPerson || donation.provider?.name}</strong> (
                  <a href={`tel:${donation.pickupAddress?.contactPhone}`} className="text-emerald-700 font-semibold hover:underline">
                    {donation.pickupAddress?.contactPhone}
                  </a>
                  )
                </span>
              </p>
            </div>

            {donation.specialInstructions && (
              <div className="pt-3 border-t border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block mb-1">Pickup Instructions:</span>
                <p className="text-slate-600 italic bg-white p-3 rounded-xl border border-slate-200">
                  "{donation.specialInstructions}"
                </p>
              </div>
            )}
          </div>

          {/* Claimant / Status Card */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-3">
                <HandHeart className="w-5 h-5 text-amber-600" />
                Collection & Claimant Status
              </div>

              {donation.status === 'available' ? (
                <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Currently Available for Pickup
                  </div>
                  <p className="text-emerald-900">
                    Any verified NGO or orphanage can accept this food immediately. Once accepted,
                    contact details are shared to coordinate the physical collection.
                  </p>
                </div>
              ) : donation.claimedBy ? (
                <div className="p-4 bg-white border border-amber-300 rounded-xl text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    Accepted by {donation.claimedBy.name}
                  </div>
                  <p className="text-slate-600">
                    <strong>Accepted on:</strong> {formatDate(donation.acceptedAt)}
                  </p>
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    Claimant Contact: <a href={`tel:${donation.claimedBy.phone}`} className="font-semibold text-emerald-700 hover:underline">{donation.claimedBy.phone}</a>
                  </p>
                  {donation.status === 'collected' && (
                    <p className="text-blue-700 font-bold pt-1">
                      ✅ Handover Completed on {formatDate(donation.collectedAt)}
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            {/* Bottom Actions based on Role */}
            <div className="pt-4 border-t border-slate-200 space-y-2">
              {/* If NGO and food is available */}
              {isNgo && donation.status === 'available' && !expiry.isExpired && (
                <button
                  onClick={() => setClaimModalOpen(true)}
                  disabled={actionLoading}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                >
                  <HandHeart className="w-4 h-4" />
                  Accept This Food For Collection
                </button>
              )}

              {/* If Provider or Claimant and food is accepted */}
              {(isOwner || isClaimant) && donation.status === 'accepted' && (
                <button
                  onClick={handleMarkCollected}
                  disabled={actionLoading}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm Handover & Mark as Collected
                </button>
              )}

              {/* If Provider and food is still available, allow cancel/delete */}
              {isOwner && donation.status === 'available' && (
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Cancel / Remove Listing
                </button>
              )}

              {!isAuthenticated && donation.status === 'available' && (
                <Link
                  to="/login"
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 text-center block"
                >
                  Log in as NGO to Accept Food
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        title="Confirm Surplus Food Acceptance"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Please confirm that your organization has transport and containers ready to collect{' '}
            <strong>"{donation.title}"</strong> before{' '}
            <strong>{formatDate(donation.expiryTime)}</strong>.
          </p>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
            <p><strong>Quantity:</strong> {donation.quantity}</p>
            <p><strong>Pickup City:</strong> {donation.pickupAddress?.city}</p>
            <p><strong>Provider:</strong> {donation.provider?.name} ({donation.pickupAddress?.contactPhone})</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setClaimModalOpen(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleAcceptDonation}
              disabled={actionLoading}
              className="px-4 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm disabled:opacity-50"
            >
              {actionLoading ? 'Accepting...' : 'Yes, Accept Food'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DonationDetails;
