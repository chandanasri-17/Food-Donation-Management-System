const Notification = require('../models/Notification');

// @desc    Get notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { recipient: req.user.id },
        {
          recipient: null,
          recipientRole: { $in: [req.user.role, 'all'] },
        },
      ],
    })
      .populate('donation', 'title status pickupAddress')
      .sort({ createdAt: -1 })
      .limit(30);

    // Map through notifications and calculate read status for broadcast notifications
    const formatted = notifications.map((notif) => {
      const isRead =
        notif.isRead ||
        (notif.readBy && notif.readBy.some((id) => id.toString() === req.user.id));
      return {
        _id: notif._id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        donation: notif.donation,
        isRead,
        createdAt: notif.createdAt,
      };
    });

    const unreadCount = formatted.filter((n) => !n.isRead).length;

    res.status(200).json({
      success: true,
      unreadCount,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a single notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.',
      });
    }

    if (notification.recipient && notification.recipient.toString() === req.user.id) {
      notification.isRead = true;
    } else {
      if (!notification.readBy.includes(req.user.id)) {
        notification.readBy.push(req.user.id);
      }
    }

    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    // Direct notifications
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    // Broadcast notifications
    await Notification.updateMany(
      {
        recipient: null,
        recipientRole: { $in: [req.user.role, 'all'] },
        readBy: { $ne: req.user.id },
      },
      { $addToSet: { readBy: req.user.id } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    next(error);
  }
};
