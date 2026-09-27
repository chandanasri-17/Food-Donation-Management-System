import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  UtensilsCrossed,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Building2,
  HeartHandshake,
  CheckCheck,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { formatTimeAgo } from '../utils/helpers';

const Navbar = () => {
  const { user, isAuthenticated, isProvider, isNgo, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await markAsRead(notif._id);
    }
    setNotifDropdownOpen(false);
    if (notif.donation) {
      navigate(`/donations/${notif.donation._id || notif.donation}`);
    } else {
      if (isProvider) navigate('/provider/dashboard');
      else if (isNgo) navigate('/ngo/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#5C4D43] text-[#F7E6CA] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#2B2421] flex items-center gap-1">
                Food<span className="text-[#5C4D43]">Bridge</span>
              </span>
              <span className="text-[10px] font-medium text-[#AD9C8E] block -mt-1 tracking-wider uppercase">
                Zero Hunger Rescue
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'text-[#5C4D43] bg-[#FAF3E8] border border-[#E8D59E]/50 font-semibold' : 'text-[#706660] hover:text-[#2B2421] hover:bg-[#FAF8F6]'
                }`
              }
            >
              Home
            </NavLink>

            {/* Provider Links */}
            {isProvider && (
              <>
                <NavLink
                  to="/provider/dashboard"
                  className={({ isActive }) =>
                    `px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive ? 'text-[#5C4D43] bg-[#FAF3E8] border border-[#E8D59E]/50 font-semibold' : 'text-[#706660] hover:text-[#2B2421] hover:bg-[#FAF8F6]'
                    }`
                  }
                >
                  Provider Dashboard
                </NavLink>
                <NavLink
                  to="/donations/create"
                  className="ml-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#5C4D43] text-white hover:bg-[#483C34] shadow-sm transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-[#F7E6CA]" /> Post Food
                </NavLink>
              </>
            )}

            {/* NGO Links */}
            {isNgo && (
              <>
                <NavLink
                  to="/ngo/dashboard"
                  className={({ isActive }) =>
                    `px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive ? 'text-[#5C4D43] bg-[#FAF3E8] border border-[#E8D59E]/50 font-semibold' : 'text-[#706660] hover:text-[#2B2421] hover:bg-[#FAF8F6]'
                    }`
                  }
                >
                  Surplus Food Feed & Claims
                </NavLink>
              </>
            )}
          </nav>

          {/* Right Header Section (Notifications & User / Auth buttons) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notification Bell Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                    className="relative p-2 text-[#706660] hover:text-[#2B2421] hover:bg-[#FAF8F6] rounded-xl transition-colors border border-transparent hover:border-[#E8DFD5]"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#D9BBB0] text-[10px] font-bold text-[#754034] shadow-sm ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-[#E8DFD5] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-[#FAF3E8] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-[#2B2421] text-sm">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="bg-[#FAF3E8] text-[#5C4D43] text-[11px] font-medium px-2 py-0.5 rounded-full border border-[#E8D59E]/40">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-[#8F5345] hover:text-[#754034] font-medium flex items-center gap-1"
                          >
                            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-[#FAF8F6]">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-[#AD9C8E]">
                            No notifications yet. You will receive alerts when surplus food is posted or accepted.
                          </div>
                        ) : (
                          notifications.slice(0, 8).map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => handleNotificationClick(notif)}
                              className={`p-3.5 hover:bg-[#FAF8F6] cursor-pointer transition-colors ${
                                !notif.isRead ? 'bg-[#FAF3E8]/60' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h5 className={`text-xs ${!notif.isRead ? 'font-bold text-[#2B2421]' : 'font-medium text-[#706660]'}`}>
                                  {notif.title}
                                </h5>
                                <span className="text-[10px] text-[#AD9C8E] shrink-0">
                                  {formatTimeAgo(notif.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-[#706660] mt-1 line-clamp-2">
                                {notif.message}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-[#E8DFD5] hover:border-[#AD9C8E] bg-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF3E8] text-[#5C4D43] flex items-center justify-center font-bold text-xs border border-[#E8D59E]/40">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden lg:block">
                      <span className="text-xs font-semibold text-[#2B2421] block truncate max-w-[130px]">
                        {user.name}
                      </span>
                      <span className="text-[10px] text-[#AD9C8E] uppercase tracking-wide block">
                        {user.role === 'provider' ? 'Food Provider' : 'NGO / Orphanage'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#AD9C8E]" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-[#E8DFD5] py-2 z-50">
                      <div className="px-4 py-2 border-b border-[#FAF8F6]">
                        <p className="text-xs font-semibold text-[#2B2421] truncate">{user.name}</p>
                        <p className="text-[11px] text-[#706660] truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#FAF3E8] text-[#5C4D43] border border-[#E8D59E]/40">
                          Role: {user.role === 'provider' ? 'Food Provider' : 'NGO / Shelter'}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#5C4D43] hover:bg-[#FAF8F6]"
                        >
                          <User className="w-4 h-4 text-[#AD9C8E]" /> My Organization Profile
                        </Link>
                        {isProvider && (
                          <Link
                            to="/donations/create"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#5C4D43] hover:bg-[#FAF8F6]"
                          >
                            <PlusCircle className="w-4 h-4 text-[#8F5345]" /> Post Surplus Food
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-[#FAF8F6] pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-[#8F5345] hover:bg-[#F9F1EE] text-left transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#5C4D43] hover:text-[#2B2421] hover:bg-[#FAF8F6] rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#5C4D43] hover:bg-[#483C34] rounded-xl shadow-sm transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-[#706660] rounded-lg hover:bg-[#FAF8F6]"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#D9BBB0] rounded-full" />
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#706660] rounded-lg hover:bg-[#FAF8F6]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8DFD5] bg-[#FDFBF7] px-4 pt-3 pb-6 space-y-2">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium rounded-lg text-[#2B2421] hover:bg-[#FAF8F6]"
          >
            Home
          </NavLink>

          {isProvider && (
            <>
              <NavLink
                to="/provider/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium rounded-lg text-[#2B2421] hover:bg-[#FAF8F6]"
              >
                Provider Dashboard
              </NavLink>
              <NavLink
                to="/donations/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-semibold text-[#5C4D43] hover:bg-[#FAF3E8] rounded-lg"
              >
                + Post Surplus Food
              </NavLink>
            </>
          )}

          {isNgo && (
            <NavLink
              to="/ngo/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-base font-medium rounded-lg text-[#2B2421] hover:bg-[#FAF8F6]"
            >
              Surplus Food Feed & Claims
            </NavLink>
          )}

          {isAuthenticated ? (
            <div className="pt-4 border-t border-[#E8DFD5] space-y-2">
              <div className="px-3 py-2 bg-white border border-[#E8DFD5] rounded-lg">
                <p className="text-sm font-bold text-[#2B2421]">{user.name}</p>
                <p className="text-xs text-[#706660]">{user.email}</p>
                <span className="inline-block mt-1 text-[11px] font-medium text-[#5C4D43]">
                  {user.role === 'provider' ? 'Food Provider' : 'NGO / Orphanage'}
                </span>
              </div>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-[#5C4D43] hover:bg-[#FAF8F6] rounded-lg"
              >
                Organization Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm font-medium text-[#8F5345] hover:bg-[#F9F1EE] rounded-lg"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-[#E8DFD5] grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 px-4 text-sm font-medium text-[#5C4D43] bg-white border border-[#E8DFD5] rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 px-4 text-sm font-semibold text-white bg-[#5C4D43] rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
