const express = require('express');
const router = express.Router();
const {
  createDonation,
  getDonations,
  getMyDonations,
  getMyClaims,
  getDonationById,
  acceptDonation,
  updateStatus,
  deleteDonation,
  getImpactStats,
} = require('../controllers/donationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public impact stats
router.get('/stats/impact', getImpactStats);

// List all donations (supports filters: status, foodType, city, search)
router.get('/', getDonations);

// Provider specific route: list my postings
router.get('/my-donations', protect, authorizeRoles('provider'), getMyDonations);

// NGO specific route: list my claimed donations
router.get('/my-claims', protect, authorizeRoles('ngo'), getMyClaims);

// Create donation (Provider only)
router.post('/', protect, authorizeRoles('provider'), createDonation);

// Get single donation details
router.get('/:id', getDonationById);

// Accept donation for pickup (NGO only)
router.patch('/:id/accept', protect, authorizeRoles('ngo'), acceptDonation);

// Update status (e.g., accepted -> collected) (Provider or Claimant)
router.patch('/:id/status', protect, updateStatus);

// Delete donation (Provider only, if still available)
router.delete('/:id', protect, authorizeRoles('provider'), deleteDonation);

module.exports = router;
