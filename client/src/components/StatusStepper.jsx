import React from 'react';
import { Check, Clock, PackageCheck, Utensils } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const StatusStepper = ({ donation }) => {
  if (!donation) return null;

  const { status, createdAt, acceptedAt, collectedAt, provider, claimedBy } = donation;

  const steps = [
    {
      id: 1,
      name: 'Surplus Food Posted',
      description: `Posted by ${provider?.name || 'Food Provider'}`,
      date: formatDate(createdAt),
      icon: Utensils,
      isCompleted: true,
      isActive: status === 'available',
    },
    {
      id: 2,
      name: 'Accepted for Collection',
      description: claimedBy
        ? `Accepted by ${claimedBy.name}`
        : 'Awaiting claim from an NGO or orphanage',
      date: acceptedAt ? formatDate(acceptedAt) : null,
      icon: Clock,
      isCompleted: ['accepted', 'collected'].includes(status),
      isActive: status === 'accepted',
    },
    {
      id: 3,
      name: 'Food Collected',
      description: collectedAt
        ? 'Successfully collected and delivered'
        : 'Pending physical pickup at location',
      date: collectedAt ? formatDate(collectedAt) : null,
      icon: PackageCheck,
      isCompleted: status === 'collected',
      isActive: status === 'collected',
    },
  ];

  return (
    <div className="w-full py-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
        {/* Background connector line for desktop */}
        <div className="hidden md:block absolute top-6 left-8 right-8 h-1 bg-slate-200 -z-0">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{
              width:
                status === 'collected'
                  ? '100%'
                  : status === 'accepted'
                  ? '50%'
                  : '10%',
            }}
          />
        </div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          let circleBg = 'bg-slate-100 text-slate-400 border-slate-300';
          if (step.isCompleted) {
            circleBg = 'bg-emerald-600 text-white border-emerald-600 ring-4 ring-emerald-50';
          } else if (step.isActive) {
            circleBg = 'bg-amber-500 text-white border-amber-500 ring-4 ring-amber-50';
          }

          return (
            <div
              key={step.id}
              className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 relative z-10 text-left md:text-center"
            >
              <div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${circleBg}`}
              >
                {step.isCompleted && status !== 'available' && idx < 2 ? (
                  <Check className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm md:text-base">
                  {step.name}
                </h4>
                <p className="text-xs text-slate-500 max-w-[200px] mt-0.5">
                  {step.description}
                </p>
                {step.date && (
                  <span className="inline-block mt-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {step.date}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusStepper;
