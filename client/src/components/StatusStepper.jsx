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
        <div className="hidden md:block absolute top-6 left-8 right-8 h-1 bg-[#E8DFD5] -z-0">
          <div
            className="h-full bg-[#5C4D43] transition-all duration-500"
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
          let circleBg = 'bg-[#FAF8F6] text-[#AD9C8E] border-[#E8DFD5]';
          if (step.isCompleted) {
            circleBg = 'bg-[#5C4D43] text-[#F7E6CA] border-[#5C4D43] ring-4 ring-[#FAF3E8]';
          } else if (step.isActive) {
            circleBg = 'bg-[#F9F1EE] text-[#754034] border-[#D9BBB0] ring-4 ring-[#FAF3E8]';
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
                <h4 className="font-semibold text-[#2B2421] text-sm md:text-base">
                  {step.name}
                </h4>
                <p className="text-xs text-[#706660] max-w-[200px] mt-0.5">
                  {step.description}
                </p>
                {step.date && (
                  <span className="inline-block mt-1 text-[11px] font-medium text-[#5C4D43] bg-[#FAF3E8] border border-[#E8D59E]/40 px-2 py-0.5 rounded">
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
