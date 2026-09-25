import React from 'react';
import { CheckCircle2, Clock, PackageCheck, XCircle } from 'lucide-react';

const StatusBadge = ({ status, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm font-medium',
    lg: 'px-4 py-1.5 text-base font-semibold',
  };

  switch (status) {
    case 'available':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses[size]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Available
        </span>
      );
    case 'accepted':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-300 ${sizeClasses[size]}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          Accepted (Pickup in progress)
        </span>
      );
    case 'collected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses[size]}`}
        >
          <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
          Collected & Saved
        </span>
      );
    case 'cancelled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-slate-300 ${sizeClasses[size]}`}
        >
          <XCircle className="w-3.5 h-3.5 text-slate-500" />
          Cancelled
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-slate-100 text-slate-700 ${sizeClasses[size]}`}
        >
          {status}
        </span>
      );
  }
};

export default StatusBadge;
