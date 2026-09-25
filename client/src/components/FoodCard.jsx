import React from 'react';
import { Link } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Users,
  Utensils,
  Building2,
  Calendar,
  ArrowRight,
  HandHeart,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import {
  FOOD_TYPE_LABELS,
  DIETARY_LABELS,
  ORG_TYPE_LABELS,
  getExpiryStatus,
  formatTimeAgo,
} from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const FoodCard = ({ donation, onAccept }) => {
  const { user, isNgo } = useAuth();
  const expiry = getExpiryStatus(donation.expiryTime);
  const dietary = DIETARY_LABELS[donation.dietaryType] || DIETARY_LABELS.vegetarian;
  const foodTypeLabel = FOOD_TYPE_LABELS[donation.foodType] || 'Prepared Food';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-card flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Top Header with Badges */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${dietary.badgeClass}`}
            >
              {dietary.label}
            </span>
            <StatusBadge status={donation.status} size="sm" />
          </div>

          <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {donation.title}
          </h3>

          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <Utensils className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">{foodTypeLabel}</span>
            <span>•</span>
            <span>Posted {formatTimeAgo(donation.createdAt)}</span>
          </p>
        </div>

        {/* Vital Specs */}
        <div className="px-5 py-3 bg-slate-50/70 border-y border-slate-100 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <div className="w-7 h-7 rounded-lg bg-emerald-100/60 text-emerald-700 flex items-center justify-center shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Servings</span>
              <span className="font-semibold text-slate-900">~{donation.servingsApprox} people</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <div className="w-7 h-7 rounded-lg bg-amber-100/60 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Quantity</span>
              <span className="font-semibold text-slate-900 truncate block max-w-[120px]" title={donation.quantity}>
                {donation.quantity}
              </span>
            </div>
          </div>
        </div>

        {/* Location & Expiry */}
        <div className="p-5 pt-3.5 space-y-2.5 text-xs text-slate-600">
          {/* Expiry Pill */}
          <div
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border font-medium ${expiry.color}`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{expiry.text}</span>
          </div>

          {/* Provider and Location */}
          <div className="flex items-start gap-2 pt-1 text-slate-600">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="truncate">
              <strong className="text-slate-800">{donation.pickupAddress?.city || 'Local Area'}</strong>
              {donation.pickupAddress?.street ? ` - ${donation.pickupAddress.street}` : ''}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              Provider: <span className="text-slate-700 font-medium">{donation.provider?.name || 'Local Food Provider'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="p-5 pt-0 mt-2">
        <div className="flex items-center gap-2">
          <NavLink
            to={`/donations/${donation._id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Details <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>

          {/* If logged in NGO and food is available, allow immediate Accept */}
          {isNgo && donation.status === 'available' && !expiry.isExpired && (
            <button
              onClick={() => onAccept && onAccept(donation)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors"
            >
              <HandHeart className="w-3.5 h-3.5" />
              Accept Food
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
