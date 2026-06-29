'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../../lib/firebase';

// ============================================================================
// BESPOKE CUSTOM GEOMETRIC SVG ICONS FOR SIDEBAR (Gradient-free, Sharp, Heavy-mitre)
// ============================================================================

const CustomShieldIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const CustomDashboardIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const CustomBarChartIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <rect x="3" y="13" width="4" height="8" />
    <rect x="10" y="7" width="4" height="14" />
    <rect x="17" y="3" width="4" height="18" />
  </svg>
);

const CustomClipboardIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <rect x="5" y="5" width="14" height="16" />
    <path d="M9 5V2H15V5" />
    <line x1="9" y1="10" x2="15" y2="10" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
);

const CustomEntryLogsIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" />
    <path d="M9 9l3 3-3 3" />
    <line x1="15" y1="12" x2="12" y2="12" />
  </svg>
);

const CustomAuditIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <rect x="3" y="4" width="18" height="16" />
    <line x1="7" y1="8" x2="17" y2="8" />
    <line x1="7" y1="12" x2="13" y2="12" />
    <line x1="7" y1="16" x2="11" y2="16" />
  </svg>
);

const CustomDutyIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <rect x="3" y="4" width="18" height="16" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

const CustomLogoutIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <path d="M10 22H3V2H10" />
    <path d="M21 12H9" />
    <path d="M16 7L21 12L16 17" />
  </svg>
);

const CustomTagIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const CustomMenuIcon = ({ className = '', size = 24 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    className={className}
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CustomCloseIcon = ({ className = '', size = 24 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    className={className}
  >
    <line x1="4" y1="4" x2="20" y2="20" />
    <line x1="20" y1="4" x2="4" y2="20" />
  </svg>
);

const CustomScannerIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <path d="M4 4h4V2H2v6h2V4zm12-2v2h4v4h2V2h-6zM4 20h4v2H2v-6h2v4zm16 2v-2h-4v-2h6v6h-2z" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </svg>
);

const CustomSettingsIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const CustomLockIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CustomAlertCircleIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const CustomLightbulbIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <path d="M9 21h6" />
    <path d="M9 18h6" />
    <path d="M10 15H14c.55 0 1-.45 1-1v-1c1.2-1.2 2-2.8 2-4.5C17 5.02 14.76 3 12 3S7 5.02 7 8.5c0 1.7.8 3.3 2 4.5v1c0 .55.45 1 1 1z" />
  </svg>
);

const CustomHubIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={className}
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <path d="M10 6.5h4M10 17.5h4M6.5 10v4M17.5 10v4" />
  </svg>
);

const CustomChevronIcon = ({ isOpen, size = 12, className = '' }: { isOpen: boolean; size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3.2" 
    strokeLinecap="square" 
    strokeLinejoin="miter" 
    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${className}`}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab');
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [pendingComplaintsCount, setPendingComplaintsCount] = useState(0);
  const [pendingSuggestionsCount, setPendingSuggestionsCount] = useState(0);

  const isFeedbackActive = pathname === '/admin/analytics';
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (isOpen) {
        setIsVisible(true);
        return;
      }

      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false); // Scroll down
      } else {
        setIsVisible(true); // Scroll up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isOpen]);

  useEffect(() => {
    if (isFeedbackActive) {
      setIsFeedbackOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (!isFirebaseConfigured() || !db) return;

    const unsubComplaints = onSnapshot(collection(db, 'complaints'), (snap) => {
      const pending = snap.docs.filter((d) => d.data().status !== 'resolved').length;
      setPendingComplaintsCount(pending);
    }, (err) => {
      console.warn("Sidebar complaints snapshot listener error:", err);
    });

    const unsubSuggestions = onSnapshot(collection(db, 'suggestions'), (snap) => {
      const pending = snap.docs.filter((d) => d.data().status !== 'reviewed').length;
      setPendingSuggestionsCount(pending);
    }, (err) => {
      console.warn("Sidebar suggestions snapshot listener error:", err);
    });

    return () => {
      unsubComplaints();
      unsubSuggestions();
    };
  }, []);

  const navItems = [
    { name: 'Overview', href: '/admin', icon: CustomDashboardIcon },
    { name: 'Registration', href: '/admin/registrations', icon: CustomClipboardIcon },
    { name: 'Ticket Scanner', href: '/admin/scanner', icon: CustomScannerIcon },
    { name: 'Entry Logs', href: '/admin/entry-logs', icon: CustomEntryLogsIcon },
    { name: 'Audit Logs', href: '/admin/audit', icon: CustomAuditIcon },
    { name: 'Duty Management', href: '/admin/duty-management', icon: CustomDutyIcon },
    { name: 'Coupons', href: '/admin/coupons', icon: CustomTagIcon },
    { name: 'Warden Portal', href: '/admin/warden', icon: CustomShieldIcon },
  ];

  const feedbackSubItems = [
    { name: 'Form Builder', href: '/admin/analytics?tab=configurator', icon: CustomSettingsIcon },
    { name: 'Form Access', href: '/admin/analytics?tab=access', icon: CustomLockIcon },
    { name: 'Responses', href: '/admin/analytics?tab=analytics', icon: CustomBarChartIcon },
    { name: 'Complaints', href: '/admin/analytics?tab=complaints', icon: CustomAlertCircleIcon, badge: pendingComplaintsCount, badgeColor: 'bg-brand-pink text-white border-2 border-brand-ink' },
    { name: 'Suggestions', href: '/admin/analytics?tab=suggestions', icon: CustomLightbulbIcon, badge: pendingSuggestionsCount, badgeColor: 'bg-brand-orange text-brand-ink border-2 border-brand-ink' },
  ];

  const handleLogout = async () => {
    let performer = 'Admin';
    if (isFirebaseConfigured() && auth && auth.currentUser) {
      performer = auth.currentUser.email || auth.currentUser.uid || 'Admin';
    }
    try {
      const { logAdminAction } = await import('../../lib/audit');
      await logAdminAction('LOGOUT', 'sessions', `Admin ${performer} signed out successfully`, performer);
    } catch (err) {
      console.error("Failed to log logout action:", err);
    }
    if (isFirebaseConfigured() && auth) {
      await auth.signOut();
    }
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Hamburger Header */}
      <div className={`md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b-2 border-brand-ink flex items-center justify-between px-4 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <Link href="/admin" className="flex items-center gap-2">
          <img src="/logos/Aarambh_new_logo.svg" alt="Aarambh Logo" className="h-8 w-auto object-contain" />
          <span className="font-adminHeading text-md font-black text-brand-ink hidden">Admin</span>
        </Link>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-brand-ink p-2 cursor-pointer focus:outline-none"
        >
          {isOpen ? <CustomCloseIcon size={24} /> : <CustomMenuIcon size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-[#030404]/40 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Contents */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r-2 border-brand-ink flex flex-col transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Desktop Sidebar Logo */}
        <div className="h-16 flex items-center px-6 border-b-2 border-brand-ink bg-white hidden md:flex">
          <Link href="/admin" className="flex items-center gap-2">
            <img src="/logos/Aarambh_new_logo.svg" alt="Aarambh Logo" className="h-16 w-auto object-contain" />
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 bg-white">
          {navItems.map((item: any) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href) && !pathname.startsWith('/admin/analytics'));
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 border-2 transition-all duration-100 ${
                  isActive 
                    ? 'bg-brand-cloud border-brand-ink text-brand-ink font-black shadow-[3px_3px_0px_0px_#030404] rounded-md translate-x-[-2px] translate-y-[-2px]' 
                    : 'border-transparent text-admin-muted hover:bg-admin-bg hover:text-brand-ink hover:border-brand-ink hover:rounded-md'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span className="text-sm tracking-wide uppercase font-black text-xs">{item.name}</span>
                </div>
              </Link>
            );
          })}

          {/* Feedback Control Hub Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
              className={`flex items-center justify-between px-4 py-3 w-full border-2 transition-all duration-100 cursor-pointer ${
                isFeedbackActive 
                  ? 'bg-brand-cloud border-brand-ink text-brand-ink font-black shadow-[3px_3px_0px_0px_#030404] rounded-md translate-x-[-2px] translate-y-[-2px]' 
                  : 'border-transparent text-admin-muted hover:bg-admin-bg hover:text-brand-ink hover:border-brand-ink hover:rounded-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <CustomHubIcon size={18} />
                <span className="text-sm tracking-wide uppercase font-black text-xs">Feedback Control Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <CustomChevronIcon isOpen={isFeedbackOpen} />
              </div>
            </button>
            
            {isFeedbackOpen && (
              <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-dashed border-brand-ink/30 ml-6 mt-1 transition-all duration-150">
                {feedbackSubItems.map((subItem) => {
                  const isActive = pathname === '/admin/analytics' && currentTab === subItem.href.split('?tab=')[1];
                  const SubIcon = subItem.icon;
                  
                  return (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 border-2 transition-all duration-100 rounded-md ${
                        isActive
                          ? 'bg-brand-cloud border-brand-ink text-brand-ink font-black shadow-[2px_2px_0px_0px_#030404] translate-x-[-1px] translate-y-[-1px]'
                          : 'border-transparent text-admin-muted hover:bg-admin-bg hover:text-brand-ink hover:border-brand-ink/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <SubIcon size={15} />
                        <span className="text-[10px] uppercase font-bold tracking-wider">{subItem.name}</span>
                      </div>
                      {subItem.badge !== undefined && subItem.badge > 0 && (
                        <span className={`${subItem.badgeColor || 'bg-brand-orange text-brand-ink border-2 border-brand-ink'} px-1 py-0.1 text-[8px] font-black rounded-md`}>
                          {subItem.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t-2 border-brand-ink bg-white">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-md border-2 border-transparent text-admin-muted hover:border-brand-ink hover:bg-brand-orange/15 hover:text-brand-orange hover:font-black hover:shadow-[3px_3px_0px_0px_#030404] transition-all duration-100 cursor-pointer"
          >
            <CustomLogoutIcon size={18} />
            <span className="text-sm tracking-wide uppercase font-black text-xs">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

