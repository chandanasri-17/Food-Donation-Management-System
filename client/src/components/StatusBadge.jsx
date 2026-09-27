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
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-[#FAF5E8] text-[#6B5728] border border-[#E8D59E] ${sizeClasses[size]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#8C733E] animate-pulse"></span>
          Available
        </span>
      );
    case 'accepted':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-[#F9F1EE] text-[#754034] border border-[#D9BBB0] ${sizeClasses[size]}`}
        >
          <Clock className="w-3.5 h-3.5 text-[#8F5345]" />
          Accepted (Pickup in progress)
        </span>
      );
    case 'collected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-[#FAF8F6] text-[#5C4D43] border border-[#E8DFD5] ${sizeClasses[size]}`}
        >
          <PackageCheck className="w-3.5 h-3.5 text-[#5C4D43]" />
          Collected & Saved
        </span>
      );
    case 'cancelled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-[#F9F1EE] text-[#754034] border border-[#D9BBB0] ${sizeClasses[size]}`}
        >
          <XCircle className="w-3.5 h-3.5 text-[#8F5345]" />
          Cancelled
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-[#FAF8F6] text-[#706660] border border-[#E8DFD5] ${sizeClasses[size]}`}
        >
          {status}
        </span>
      );
  }
};

export default StatusBadge;
