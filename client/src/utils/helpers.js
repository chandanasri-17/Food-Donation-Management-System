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
      color: 'text-rose-800 bg-rose-100 border-rose-200',
    };
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours < 3) {
    return {
      text: `Collect within ${diffHours > 0 ? `${diffHours}h ` : ''}${diffMinutes}m!`,
      isExpired: false,
      isUrgent: true,
      color: 'text-rose-800 bg-rose-100 border-rose-200 animate-urgent',
    };
  }

  if (diffHours < 24) {
    return {
      text: `Safe for ~${diffHours} hours`,
      isExpired: false,
      isUrgent: false,
      color: 'text-gold-800 bg-gold-100 border-gold-200',
    };
  }

  const diffDays = Math.floor(diffHours / 24);
  return {
    text: `Safe for ~${diffDays} day${diffDays > 1 ? 's' : ''}`,
    isExpired: false,
    isUrgent: false,
    color: 'text-taupe-700 bg-taupe-100 border-taupe-200',
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
  vegetarian: { label: 'Veg', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'non-vegetarian': { label: 'Non-Veg', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' },
  vegan: { label: 'Vegan', badgeClass: 'bg-teal-50 text-teal-700 border-teal-200' },
  mixed: { label: 'Mixed', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' },
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
