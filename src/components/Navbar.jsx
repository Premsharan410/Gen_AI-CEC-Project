import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X, Settings } from 'lucide-react';
import StatusIndicator from './StatusIndicator';

export default function Navbar({ runtimeStatus, onOpenSettings, onLaunchStudio }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isCurrent = (path) => location.pathname === path;
  const isStudioRoute = location.pathname === '/generate';

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#EEF5FA]/90 backdrop-blur-md border-b border-[#D5E0E9] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Custom GenMol AI Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue rounded-lg"
          >
            {/* Custom Molecular Geometric Symbol */}
            <div className="relative w-9 h-9 rounded-xl bg-white border border-[#D5E0E9] flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 group-hover:border-brand-blue/40">
              <svg
                viewBox="0 0 36 36"
                className="w-7 h-7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer Hexagonal Valence Core */}
                <polygon
                  points="18,4.5 29.5,11.2 29.5,24.8 18,31.5 6.5,24.8 6.5,11.2"
                  stroke="#2864DC"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                  className="transition-colors group-hover:stroke-brand-blue"
                />
                {/* Delocalized Resonance Core */}
                <circle
                  cx="18"
                  cy="18"
                  r="5.5"
                  stroke="#168A83"
                  strokeWidth="1.4"
                  strokeDasharray="2.5 2"
                />
                {/* Dynamic Orbital Axis */}
                <path
                  d="M5 14 C9 6, 27 6, 31 14 C27 22, 9 22, 5 14 Z"
                  stroke="#7961D9"
                  strokeWidth="0.9"
                  strokeDasharray="1.5 2"
                  className="opacity-70"
                />
                {/* Vertex Atom Centers */}
                <circle cx="18" cy="4.5" r="2.2" fill="#168A83" />
                <circle cx="29.5" cy="11.2" r="2" fill="#2864DC" />
                <circle cx="29.5" cy="24.8" r="2" fill="#7961D9" />
                <circle cx="18" cy="31.5" r="2.2" fill="#168A83" />
                <circle cx="6.5" cy="24.8" r="2" fill="#2864DC" />
                <circle cx="6.5" cy="11.2" r="2" fill="#7961D9" />
                <circle cx="18" cy="18" r="2.4" fill="#2864DC" />
              </svg>
            </div>

            {/* Brand Typography */}
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-[#24313D] leading-none">
                GenMol
              </span>
              <span className="text-xs font-mono font-bold text-white bg-brand-blue px-1.5 py-0.5 rounded shadow-xs leading-none">
                AI
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm transition-colors ${isCurrent('/')
                  ? 'text-brand-blue font-bold border-b-2 border-brand-blue py-1'
                  : 'text-[#526477] hover:text-[#24313D] font-medium py-1'
                }`}
            >
              Overview
            </Link>
            <a
              href="/#methodology"
              className="text-sm text-[#526477] hover:text-[#24313D] font-medium transition-colors py-1"
            >
              Methodology
            </a>
            <a
              href="/#technology"
              className="text-sm text-[#526477] hover:text-[#24313D] font-medium transition-colors py-1"
            >
              Technology
            </a>
          </div>

          {/* Right: Status Indicator + Open Research Studio Button */}
          <div className="hidden md:flex items-center gap-3">
            {/* <StatusIndicator
              status={runtimeStatus}
              onOpenSettings={onOpenSettings}
            /> */}

            {isStudioRoute ? (
              <div
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-[#168A83] bg-[#E2F3E9] border border-[#D5E0E9] cursor-default select-none shadow-xs"
                role="status"
                aria-label="Research Studio is currently active"
              >
                <span className="w-2 h-2 rounded-full bg-[#168A83]" />
                <span>Studio Open</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onLaunchStudio}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-blue hover:bg-brand-blue-hover transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
              >
                <span>Open Research Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <StatusIndicator
              status={runtimeStatus}
              onOpenSettings={onOpenSettings}
              compact={true}
            />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-lg text-[#526477] hover:text-[#24313D] hover:bg-white/60 border border-[#D5E0E9] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#D5E0E9] bg-[#EEF5FA] px-4 pt-3 pb-5 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${isCurrent('/') ? 'bg-white text-brand-blue shadow-xs' : 'text-[#24313D] hover:bg-white/60'
                }`}
            >
              Overview
            </Link>
            <a
              href="/#methodology"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#24313D] hover:bg-white/60 transition-colors"
            >
              Methodology
            </a>
            <a
              href="/#technology"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#24313D] hover:bg-white/60 transition-colors"
            >
              Technology
            </a>
          </div>

          <div className="pt-3 border-t border-[#D5E0E9] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSettings();
              }}
              type="button"
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-white border border-[#D5E0E9] text-[#24313D] flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-brand-blue" />
              <span>Backend Settings ({runtimeStatus})</span>
            </button>

            {isStudioRoute ? (
              <div
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-[#168A83] bg-[#E2F3E9] border border-[#D5E0E9] text-center flex items-center justify-center gap-2 shadow-xs cursor-default select-none"
                role="status"
                aria-label="Research Studio is currently active"
              >
                <span className="w-2 h-2 rounded-full bg-[#168A83]" />
                <span>Research Studio Open</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onLaunchStudio) onLaunchStudio();
                }}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-brand-blue text-white text-center shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open Research Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
