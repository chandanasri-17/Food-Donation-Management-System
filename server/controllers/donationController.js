const Donation = require('../models/Donation');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Create a new surplus food donation
// @route   POST /api/donations
// @access  Private (Provider only)
exports.createDonation = async (req, res, next) => {
  try {
    const {
      title,
      foodType,
      dietaryType,
      quantity,
      servingsApprox,
      preparedAt,
      expiryTime,
      pickupAddress,
      specialInstructions,
    } = req.body;

    if (!title || !quantity || !expiryTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, quantity, and expiry / consumption window.',
      });
    }

    // Default pickup address from provider profile if not fully filled
    const resolvedAddress = {
      street: pickupAddress?.street || req.user.address?.street || '',
      city: pickupAddress?.city || req.user.address?.city || 'Local Area',
      state: pickupAddress?.state || req.user.address?.state || '',
      pincode: pickupAddress?.pincode || req.user.address?.pincode || '',
      contactPerson: pickupAddress?.contactPerson || req.user.name,
      contactPhone: pickupAddress?.contactPhone || req.user.phone,
    };

    const donation = await Donation.create({
      title,
      foodType: foodType || 'cooked_meals',
      dietaryType: dietaryType || 'vegetarian',
      quantity,
      servingsApprox: Number(servingsApprox) || 10,
      preparedAt: preparedAt || new Date(),
      expiryTime: new Date(expiryTime),
      status: 'available',
      provider: req.user.id,
      pickupAddress: resolvedAddress,
      specialInstructions: specialInstructions || '',
    });

    // Notify all NGOs that new surplus food is available
    await Notification.create({
      recipient: null,
      recipientRole: 'ngo',
      type: 'food_available',
      title: 'New Surplus Food Available!',
      message: `${req.user.name} posted ${title} (${quantity}) in ${resolvedAddress.city}. Available for pickup!`,
      donation: donation._id,
    });

    const populatedDonation = await Donation.findById(donation._id).populate(
      'provider',
      'name email phone organizationType address'
    );

    res.status(201).json({
      success: true,
      message: 'Surplus food posted successfully. NGOs have been notified!',
      data: populatedDonation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donations with optional filters
// @route   GET /api/donations
// @access  Public / Authenticated
exports.getDonations = async (req, res, next) => {
  try {
    const { status, foodType, dietaryType, city, search } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (foodType && foodType !== 'all') {
      query.foodType = foodType;
    }
    if (dietaryType && dietaryType !== 'all') {
      query.dietaryType = dietaryType;
    }
    if (city) {
      query['pickupAddress.city'] = new RegExp(city, 'i');
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { specialInstructions: new RegExp(search, 'i') },
        { 'pickupAddress.city': new RegExp(search, 'i') },
      ];
    }

    const donations = await Donation.find(query)
      .populate('provider', 'name email phone organizationType address')
      .populate('claimedBy', 'name email phone organizationType address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donations posted by logged in provider
// @route   GET /api/donations/my-donations
// @access  Private (Provider only)
exports.getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ provider: req.user.id })
      .populate('claimedBy', 'name email phone organizationType address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donations claimed/accepted by logged in NGO
// @route   GET /api/donations/my-claims
// @access  Private (NGO only)
exports.getMyClaims = async (req, res, next) => {
  try {
    const claims = await Donation.find({ claimedBy: req.user.id })
      .populate('provider', 'name email phone organizationType address')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donation by ID
// @route   GET /api/donations/:id
// @access  Public / Authenticated
exports.getDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('provider', 'name email phone organizationType address')
      .populate('claimedBy', 'name email phone organizationType address');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Food donation listing not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    NGO accepts/claims available food
// @route   PATCH /api/donations/:id/accept
// @access  Private (NGO only)
exports.acceptDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Food donation listing not found.',
      });
    }

    if (donation.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `This donation is no longer available (Current status: ${donation.status}).`,
      });
    }

    // Check if food has already expired
    if (new Date() > new Date(donation.expiryTime)) {
      return res.status(400).json({
        success: false,
        message: 'This food donation has expired and cannot be accepted.',
      });
    }

    donation.status = 'accepted';
    donation.claimedBy = req.user.id;
    donation.acceptedAt = new Date();
    await donation.save();

    // Notify the Food Provider that their donation was accepted
    await Notification.create({
      recipient: donation.provider,
      recipientRole: 'provider',
      type: 'food_accepted',
      title: 'Food Donation Accepted!',
      message: `${req.user.name} (${req.user.phone}) has accepted your donation: "${donation.title}". Please have it ready for collection.`,
      donation: donation._id,
    });

    const updatedDonation = await Donation.findById(donation._id)
      .populate('provider', 'name email phone organizationType address')
      .populate('claimedBy', 'name email phone organizationType address');

    res.status(200).json({
      success: true,
      message: 'You have accepted this food donation! Please proceed to pickup.',
      data: updatedDonation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update donation status (e.g. accepted -> collected)
// @route   PATCH /api/donations/:id/status
// @access  Private (Provider or Claimed NGO)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Food donation listing not found.',
      });
    }

    const isProvider = donation.provider.toString() === req.user.id;
    const isClaimant = donation.claimedBy && donation.claimedBy.toString() === req.user.id;

    if (!isProvider && !isClaimant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update status for this donation.',
      });
    }

    if (status === 'collected') {
      if (donation.status !== 'accepted') {
        return res.status(400).json({
          success: false,
          message: 'Donation must be accepted before it can be marked as collected.',
        });
      }
      donation.status = 'collected';
      donation.collectedAt = new Date();
      await donation.save();

      // Notify the other party
      const notifyTarget = isProvider ? donation.claimedBy : donation.provider;
      const targetRole = isProvider ? 'ngo' : 'provider';

      await Notification.create({
        recipient: notifyTarget,
        recipientRole: targetRole,
        type: 'food_collected',
        title: 'Food Successfully Collected! 🎉',
        message: `Donation "${donation.title}" has been marked as collected. Thank you for saving food and feeding people!`,
        donation: donation._id,
      });
    } else if (status === 'cancelled') {
      if (!isProvider) {
        return res.status(403).json({
          success: false,
          message: 'Only the provider can cancel this food donation.',
        });
      }
      if (donation.status === 'collected') {
        return res.status(400).json({
          success: false,
          message: 'Cannot cancel a donation that has already been collected.',
        });
      }
      donation.status = 'cancelled';
      await donation.save();
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid status update transition.',
      });
    }

    const updated = await Donation.findById(donation._id)
      .populate('provider', 'name email phone organizationType address')
      .populate('claimedBy', 'name email phone organizationType address');

    res.status(200).json({
      success: true,
      message: `Status successfully updated to ${status}.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a donation (if still available)
// @route   DELETE /api/donations/:id
// @access  Private (Provider only)
exports.deleteDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Food donation listing not found.',
      });
    }

    if (donation.provider.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this donation.',
      });
    }

    if (donation.status === 'collected') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a donation that has already been collected.',
      });
    }

    await Donation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Donation listing removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform impact metrics
// @route   GET /api/donations/stats/impact
// @access  Public
exports.getImpactStats = async (req, res, next) => {
  try {
    const totalDonations = await Donation.countDocuments();
    const availableCount = await Donation.countDocuments({ status: 'available' });
    const acceptedCount = await Donation.countDocuments({ status: 'accepted' });
    const collectedCount = await Donation.countDocuments({ status: 'collected' });

    // Aggregate total meals saved
    const servingsAgg = await Donation.aggregate([
      { $match: { status: 'collected' } },
      { $group: { _id: null, totalServings: { $sum: '$servingsApprox' } } },
    ]);
    const totalServingsRescued = servingsAgg[0]?.totalServings || 0;

    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalNgos = await User.countDocuments({ role: 'ngo' });

    res.status(200).json({
      success: true,
      data: {
        totalDonations,
        availableCount,
        acceptedCount,
        collectedCount,
        totalServingsRescued,
        totalProviders,
        totalNgos,
      },
    });
  } catch (error) {
    next(error);
  }
};
