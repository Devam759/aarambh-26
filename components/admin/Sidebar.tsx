'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Bell, 
  BarChart2, 
  ClipboardList, 
  FileText, 
  Search,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Scanner Accounts', href: '/admin/scanners', icon: Users },
  { name: 'Event Management', href: '/admin/events', icon: Calendar },
  { name: 'Announcements', href: '/admin/announcements', icon: Bell },
  { name: 'Feedback Analytics', href: '/admin/analytics', icon: BarChart2 },
  { name: 'Registration', href: '/admin/registrations', icon: ClipboardList },
  { name: 'Audit Logs', href: '/admin/audit', icon: FileText },
  { name: 'Search', href: '/admin/search', icon: Search },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-admin-surface border-b border-admin-border flex items-center justify-between px-4 z-50">
        <span className="font-adminHeading text-xl font-bold text-admin-text">Aarambh Admin</span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-admin-text p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-admin-surface border-r border-admin-border flex flex-col transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-admin-border hidden md:flex">
          <span className="font-adminHeading text-xl font-bold text-admin-text">Aarambh Admin</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-admin-accent/10 text-admin-accent font-medium' 
                    : 'text-admin-muted hover:bg-admin-bg hover:text-admin-text'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-admin-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-admin-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
