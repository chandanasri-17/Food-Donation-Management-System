const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the surplus food'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    foodType: {
      type: String,
      required: [true, 'Please specify the food type'],
      enum: [
        'cooked_meals',
        'raw_groceries',
        'bakery',
        'packaged_food',
        'fruits_vegetables',
        'beverages',
        'other',
      ],
      default: 'cooked_meals',
    },
    dietaryType: {
      type: String,
      enum: ['vegetarian', 'non-vegetarian', 'vegan', 'mixed'],
      default: 'vegetarian',
    },
    quantity: {
      type: String,
      required: [true, 'Please provide the quantity (e.g., "40 boxes" or "15 kg")'],
      trim: true,
    },
    servingsApprox: {
      type: Number,
      required: [true, 'Please specify approximate people this can feed'],
      min: [1, 'Servings must be at least 1'],
    },
    preparedAt: {
      type: Date,
      default: Date.now,
    },
    expiryTime: {
      type: Date,
      required: [true, 'Please provide safe consumption / must collect before time'],
    },
    status: {
      type: String,
      enum: ['available', 'accepted', 'collected', 'cancelled'],
      default: 'available',
      index: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    pickupAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      contactPerson: { type: String, default: '' },
      contactPhone: { type: String, required: true },
    },
    specialInstructions: {
      type: String,
      default: '',
      maxlength: [500, 'Instructions cannot exceed 500 characters'],
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    collectedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual index for searching
donationSchema.index({ status: 1, 'pickupAddress.city': 1, foodType: 1 });

module.exports = mongoose.model('Donation', donationSchema);
