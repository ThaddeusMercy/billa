'use client'

import React, { useState } from 'react';
import { FaHome, FaPaperPlane, FaUser } from 'react-icons/fa';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const currentPath = usePathname();
  const { user, profile } = useAuthContext();

  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUsername = () => {
    if (profile?.username) return profile.username;
    if (user?.email) return user.email.split('@')[0];
    return 'user';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const NavigationContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <ul className="space-y-2 p-4 flex flex-col items-left gap-4">
          <li className="text-3xl font-bold mt-10">
            <Link href="/dashboard" className="text-black" onClick={() => setIsMobileMenuOpen(false)}>Billa.</Link>
          </li>
          <li className={`flex text-right p-2 rounded cursor-pointer ${
            currentPath === '/dashboard' ? '' : ''
          }`}>
            <Link href="/dashboard" className={`flex items-center ${
              currentPath === '/dashboard' ? 'text-orange-500' : 'text-black'
            }`} onClick={() => setIsMobileMenuOpen(false)}>
              <FaHome className={`mr-2 ${
                currentPath === '/dashboard' ? 'text-orange-500' : ''
              }`} /> Home
            </Link>
          </li>
          <li className={`flex text-right  p-2 rounded cursor-pointer ${
            currentPath === '/preview' ? '' : ''
          }`}>
            <Link href="/preview" className={`flex items-center ${
              currentPath === '/preview' ? 'text-orange-500' : 'text-black'
            }`} onClick={() => setIsMobileMenuOpen(false)}>
              <FaPaperPlane className={`mr-2 ${
                currentPath === '/preview' ? 'text-orange-500' : ''
              }`} /> Preview
            </Link>
          </li>
          <li className={`flex text-right  p-2 rounded cursor-pointer ${
            currentPath === '/account' ? '' : ''
          }`}>
            <Link href="/account" className={`flex items-center ${
              currentPath === '/account' ? 'text-orange-500' : 'text-black'
            }`} onClick={() => setIsMobileMenuOpen(false)}>
              <FaUser className={`mr-2 ${
                currentPath === '/account' ? 'text-orange-500' : ''
              }`} /> Account
            </Link>
          </li>
        </ul>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-black to-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {getInitials()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black truncate">{getDisplayName()}</p>
            <p className="text-xs text-black/60 truncate">@{getUsername()}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard" className="text-2xl font-bold text-black">
            Billa.
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Menu size={24} className="text-black" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2"
            >
              <X size={24} className="text-black" />
            </button>
            <NavigationContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-60 h-screen bg-white shadow-md border-r border-black/10 fixed left-0 top-0 z-40">
        <NavigationContent />
      </div>
    </>
  );
};

export default Sidebar; 