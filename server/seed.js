const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Donation = require('./models/Donation');
const Notification = require('./models/Notification');

dotenv.config();

const seedDataInternal = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Donation.deleteMany({});
    await Notification.deleteMany({});

    // 1. Create Demo Users
    const provider1 = await User.create({
      name: 'Grand Orchid Luxury Hotel',
      email: 'hotel@demo.com',
      password: 'password123',
      role: 'provider',
      organizationType: 'hotel',
      phone: '+91 98765 43210',
      address: {
        street: '45 Marina Boulevard, Near Central Park',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
      },
      description: '5-star hotel banquet and restaurant surplus food contributor.',
    });

    const provider2 = await User.create({
      name: 'Sunrise College Hostel Mess',
      email: 'hostel@demo.com',
      password: 'password123',
      role: 'provider',
      organizationType: 'hostel',
      phone: '+91 98111 22334',
      address: {
        street: 'Gate 3, University Campus Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400076',
      },
      description: 'Hostel mess cooking wholesome meals for 600 students daily.',
    });

    const provider3 = await User.create({
      name: 'Royal Feast Caterers',
      email: 'stall@demo.com',
      password: 'password123',
      role: 'provider',
      organizationType: 'caterer',
      phone: '+91 98222 33445',
      address: {
        street: 'Shop 12, Market Square',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
      },
      description: 'Event and wedding catering service committed to zero food waste.',
    });

    const ngo1 = await User.create({
      name: 'Sunshine Children Orphanage',
      email: 'orphanage@demo.com',
      password: 'password123',
      role: 'ngo',
      organizationType: 'orphanage',
      phone: '+91 98333 44556',
      address: {
        street: 'Sector 4, Hope Colony',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
      },
      description: 'Providing food, shelter, and education to 85 orphaned children.',
    });

    const ngo2 = await User.create({
      name: 'Care & Feed Community NGO',
      email: 'ngo@demo.com',
      password: 'password123',
      role: 'ngo',
      organizationType: 'ngo',
      phone: '+91 98444 55667',
      address: {
        street: '18 Gandhi Marg, Wadala',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400031',
      },
      description: 'Grassroots volunteer network distributing hot meals to homeless shelters.',
    });

    // 2. Create Sample Donations
    const now = new Date();
    const fourHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const donation1 = await Donation.create({
      title: '50 Fresh Paneer Biryani & Dal Boxes',
      foodType: 'cooked_meals',
      dietaryType: 'vegetarian',
      quantity: '50 meal containers (~20 kg)',
      servingsApprox: 50,
      preparedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      expiryTime: fourHoursLater,
      status: 'available',
      provider: provider1._id,
      pickupAddress: {
        street: provider1.address.street,
        city: provider1.address.city,
        state: provider1.address.state,
        pincode: provider1.address.pincode,
        contactPerson: 'Chef Rajesh Sharma',
        contactPhone: provider1.phone,
      },
      specialInstructions: 'Packed in food-grade foil containers. Please bring thermal delivery bags.',
    });

    const donation2 = await Donation.create({
      title: '30 Chapati & Mixed Veg Curry Meals',
      foodType: 'cooked_meals',
      dietaryType: 'vegetarian',
      quantity: '30 portions (~12 kg)',
      servingsApprox: 30,
      preparedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      expiryTime: sixHoursLater,
      status: 'available',
      provider: provider2._id,
      pickupAddress: {
        street: provider2.address.street,
        city: provider2.address.city,
        state: provider2.address.state,
        pincode: provider2.address.pincode,
        contactPerson: 'Mess Manager Ramesh',
        contactPhone: provider2.phone,
      },
      specialInstructions: 'Hot food in stainless steel vessel, please bring vessels for transfer.',
    });

    const donation3 = await Donation.create({
      title: '60 Assorted Breads, Buns & Tea Cakes',
      foodType: 'bakery',
      dietaryType: 'vegetarian',
      quantity: '60 baked items',
      servingsApprox: 60,
      preparedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      expiryTime: tomorrow,
      status: 'available',
      provider: provider1._id,
      pickupAddress: {
        street: provider1.address.street,
        city: provider1.address.city,
        state: provider1.address.state,
        pincode: provider1.address.pincode,
        contactPerson: 'Pastry Chef Anita',
        contactPhone: provider1.phone,
      },
      specialInstructions: 'Freshly baked surplus from morning buffet. Ready in bakery boxes.',
    });

    const donation4 = await Donation.create({
      title: '40 Vegetable Pulao & Raita Packets',
      foodType: 'cooked_meals',
      dietaryType: 'vegetarian',
      quantity: '40 meal packets',
      servingsApprox: 40,
      preparedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      expiryTime: fourHoursLater,
      status: 'accepted',
      provider: provider3._id,
      claimedBy: ngo1._id,
      pickupAddress: {
        street: provider3.address.street,
        city: provider3.address.city,
        state: provider3.address.state,
        pincode: provider3.address.pincode,
        contactPerson: 'Sunil Kumar',
        contactPhone: provider3.phone,
      },
      specialInstructions: 'Collected from wedding lunch. Please pick up before 6:00 PM.',
      acceptedAt: new Date(now.getTime() - 30 * 60 * 1000),
    });

    const donation5 = await Donation.create({
      title: '75 Rice, Sambar & Sweet Halwa Meals',
      foodType: 'cooked_meals',
      dietaryType: 'vegetarian',
      quantity: '75 servings (~30 kg)',
      servingsApprox: 75,
      preparedAt: yesterday,
      expiryTime: new Date(yesterday.getTime() + 8 * 60 * 60 * 1000),
      status: 'collected',
      provider: provider1._id,
      claimedBy: ngo2._id,
      pickupAddress: {
        street: provider1.address.street,
        city: provider1.address.city,
        state: provider1.address.state,
        pincode: provider1.address.pincode,
        contactPerson: 'Chef Rajesh Sharma',
        contactPhone: provider1.phone,
      },
      specialInstructions: 'Delivered to shelter.',
      acceptedAt: new Date(yesterday.getTime() + 2 * 60 * 60 * 1000),
      collectedAt: new Date(yesterday.getTime() + 4 * 60 * 60 * 1000),
    });

    // 3. Create Sample Notifications
    await Notification.create([
      {
        recipient: null,
        recipientRole: 'ngo',
        type: 'food_available',
        title: 'New Surplus Food Available!',
        message: 'Grand Orchid Luxury Hotel posted 50 Fresh Paneer Biryani & Dal Boxes in Mumbai.',
        donation: donation1._id,
        isRead: false,
      },
      {
        recipient: null,
        recipientRole: 'ngo',
        type: 'food_available',
        title: 'Fresh Bakery Surplus Available!',
        message: 'Grand Orchid Luxury Hotel posted 60 Assorted Breads & Cakes in Mumbai.',
        donation: donation3._id,
        isRead: false,
      },
      {
        recipient: provider3._id,
        recipientRole: 'provider',
        type: 'food_accepted',
        title: 'Food Donation Accepted!',
        message: 'Sunshine Children Orphanage accepted your donation: "40 Vegetable Pulao & Raita Packets".',
        donation: donation4._id,
        isRead: false,
      },
    ]);

    console.log('✅ Demo seed data loaded successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
  }
};

const runStandalone = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/food_donation';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB for standalone seeding...');
  await seedDataInternal();
  process.exit(0);
};

if (require.main === module) {
  runStandalone();
}

module.exports = { seedDataInternal };
