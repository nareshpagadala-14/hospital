"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HeartPulse,
  PhoneCall,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Calendar,
  LayoutDashboard,
  Shield,
  Activity,
  ChevronDown,
} from "lucide-react";
import GlobalSearchModal from "./global-search-modal";
import EmergencyModal from "./emergency-modal";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Check auth status
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    checkAuth();
  }, [pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setUserDropdownOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Departments", href: "/departments" },
    { name: "Doctors", href: "/doctors" },
    { name: "Services", href: "/services" },
    { name: "Health Packages", href: "/health-packages" },
    { name: "Articles", href: "/articles" },
    { name: "Contact", href: "/contact" },
  ];

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "ADMIN":
        return "/admin/dashboard";
      case "DOCTOR":
        return "/doctor/dashboard";
      case "RECEPTIONIST":
        return "/reception/dashboard";
      case "PATIENT":
      default:
        return "/patient/dashboard";
    }
  };

  const isPortalRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/doctor") ||
    pathname.startsWith("/reception") ||
    pathname.startsWith("/patient");

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled || isPortalRoute
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5"
            : "bg-white/80 backdrop-blur-sm border-b border-slate-100 py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Hospital Logo & Brand Identity */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-700 via-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:scale-105 transition">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 leading-tight">
                  AIMS PRIME
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-sky-700">
                  Super Speciality &bull; Guntur
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition ${
                      isActive
                        ? "text-sky-700 bg-sky-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons & Quick Access */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Global Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-xs transition"
                title="Search (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden xl:inline text-[11px]">Search</span>
                <kbd className="hidden xl:inline text-[9px] bg-white border border-slate-300 px-1 py-0.5 rounded text-slate-400">
                  Ctrl K
                </kbd>
              </button>

              {/* 24/7 Emergency Quick Hotline */}
              <button
                onClick={() => setEmergencyOpen(true)}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200/80 hover:bg-red-100/80 text-xs font-bold transition group"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                <PhoneCall className="w-3.5 h-3.5 text-red-600 group-hover:rotate-12 transition" />
                <span>24/7 Emergency</span>
              </button>

              {/* Dynamic User Profile or Login/Book Button */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition"
                  >
                    <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden md:inline text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                      {user.role}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      <Link
                        href={getDashboardLink()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2.5 text-sky-600" />
                        {user.role} Portal Dashboard
                      </Link>

                      {user.role === "PATIENT" && (
                        <Link
                          href="/patient/appointments"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                        >
                          <Calendar className="w-4 h-4 mr-2.5 text-teal-600" />
                          My Appointments
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition border-t border-slate-100 mt-1"
                      >
                        <LogOut className="w-4 h-4 mr-2.5" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="text-xs font-semibold text-slate-700 hover:text-sky-700 px-2.5 py-1.5 rounded-lg transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/#appointment"
                    className="flex items-center space-x-1.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm shadow-sky-600/20 transition transform hover:-translate-y-0.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Appointment</span>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Animated Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4">
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setEmergencyOpen(true);
                }}
                className="flex items-center justify-center space-x-1.5 bg-red-600 text-white py-2.5 px-3 rounded-xl text-xs font-bold shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>24/7 Emergency</span>
              </button>

              <Link
                href="/#appointment"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-1.5 bg-sky-600 text-white py-2.5 px-3 rounded-xl text-xs font-bold shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Slot</span>
              </Link>
            </div>

            <div className="flex flex-col space-y-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    pathname === link.href
                      ? "text-sky-700 bg-sky-50"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {user ? (
              <div className="pt-3 border-t border-slate-200">
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-sm font-bold text-sky-700 py-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Go to {user.role} Portal</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-sm font-semibold text-rose-600 py-1.5 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out ({user.name})</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-200">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center w-full py-2.5 rounded-xl border border-slate-300 text-slate-800 font-bold text-sm"
                >
                  Sign In to Patient / Staff Portal
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Modals */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <EmergencyModal isOpen={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </>
  );
}
