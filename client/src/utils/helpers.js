export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffInMinutes = Math.floor((now - past) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export const getExpiryStatus = (expiryDate) => {
  if (!expiryDate) return { text: 'Unknown', isExpired: false, isUrgent: false };
  const now = new Date();
  const target = new Date(expiryDate);
  const diffMs = target - now;

  if (diffMs <= 0) {
    return {
      text: 'Expired',
      isExpired: true,
      isUrgent: false,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    };
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours < 3) {
    return {
      text: `Collect within ${diffHours > 0 ? `${diffHours}h ` : ''}${diffMinutes}m!`,
      isExpired: false,
      isUrgent: true,
      color: 'text-amber-700 bg-amber-50 border-amber-300 animate-urgent',
    };
  }

  if (diffHours < 24) {
    return {
      text: `Safe for ~${diffHours} hours`,
      isExpired: false,
      isUrgent: false,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    };
  }

  const diffDays = Math.floor(diffHours / 24);
  return {
    text: `Safe for ~${diffDays} day${diffDays > 1 ? 's' : ''}`,
    isExpired: false,
    isUrgent: false,
    color: 'text-slate-700 bg-slate-100 border-slate-200',
  };
};

export const FOOD_TYPE_LABELS = {
  cooked_meals: 'Cooked Meals',
  raw_groceries: 'Raw Groceries',
  bakery: 'Bakery & Bread',
  packaged_food: 'Packaged Food',
  fruits_vegetables: 'Fruits & Veggies',
  beverages: 'Beverages',
  other: 'Other Food',
};

export const DIETARY_LABELS = {
  vegetarian: { label: 'Veg', badgeClass: 'bg-green-100 text-green-800 border-green-300' },
  'non-vegetarian': { label: 'Non-Veg', badgeClass: 'bg-red-100 text-red-800 border-red-300' },
  vegan: { label: 'Vegan', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  mixed: { label: 'Mixed', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300' },
};

export const ORG_TYPE_LABELS = {
  hotel: 'Hotel & Restaurant',
  hostel: 'Hostel Mess',
  restaurant: 'Restaurant / Cafe',
  food_stall: 'Food Stall / Food Truck',
  caterer: 'Catering Service',
  ngo: 'Non-Profit NGO',
  orphanage: 'Children Orphanage',
  shelter: 'Homeless / Community Shelter',
  other: 'Community Organization',
};
