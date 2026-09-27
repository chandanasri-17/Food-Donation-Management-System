import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Heart, ShieldCheck, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#F5F0E8] text-[#706660] pt-14 pb-8 border-t border-[#E8DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E8DFD5]">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#5C4D43] text-[#F7E6CA] flex items-center justify-center font-bold shadow-sm">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#2B2421]">
                Food<span className="text-[#5C4D43]">Bridge</span>
              </span>
            </Link>
            <p className="text-sm text-[#706660] max-w-md leading-relaxed">
              FoodBridge connects hotels, hostels, caterers, and food stalls with nearby verified
              orphanages and NGOs. We make food rescue fast, safe, and transparent to ensure no good
              meal goes to waste.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-white text-[#5C4D43] border border-[#E8DFD5] font-medium shadow-xs">
                React.js
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white text-[#5C4D43] border border-[#E8DFD5] font-medium shadow-xs">
                Tailwind CSS
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white text-[#5C4D43] border border-[#E8DFD5] font-medium shadow-xs">
                Express.js
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white text-[#5C4D43] border border-[#E8DFD5] font-medium shadow-xs">
                MongoDB Atlas
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white text-[#5C4D43] border border-[#E8DFD5] font-medium shadow-xs">
                JWT Auth
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#2B2421] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-[#706660]">
              <li>
                <Link to="/" className="hover:text-[#5C4D43] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#5C4D43] transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#5C4D43] transition-colors">
                  Register as Provider or NGO
                </Link>
              </li>
              <li>
                <Link to="/donations/create" className="hover:text-[#5C4D43] transition-colors">
                  Post Surplus Food
                </Link>
              </li>
            </ul>
          </div>

          {/* Workflow & Impact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#2B2421] mb-4">
              Our 4-Step Flow
            </h4>
            <ul className="space-y-2 text-xs text-[#706660]">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FAF3E8] text-[#5C4D43] border border-[#E8D59E]/60 flex items-center justify-center font-bold text-[10px]">
                  1
                </span>
                Surplus food becomes available
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FAF3E8] text-[#5C4D43] border border-[#E8D59E]/60 flex items-center justify-center font-bold text-[10px]">
                  2
                </span>
                Food posted with consumption time
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FAF3E8] text-[#5C4D43] border border-[#E8D59E]/60 flex items-center justify-center font-bold text-[10px]">
                  3
                </span>
                NGO notified & accepts pickup
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FAF3E8] text-[#5C4D43] border border-[#E8D59E]/60 flex items-center justify-center font-bold text-[10px]">
                  4
                </span>
                Food collected and distributed
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#AD9C8E] gap-3">
          <p>© {new Date().getFullYear()} FoodBridge Platform. Connecting extra food with people who need it.</p>
          <div className="flex items-center gap-1 text-[#706660]">
            <span>Built with care to end food waste</span>
            <Heart className="w-3.5 h-3.5 text-[#8F5345] fill-[#8F5345]" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
