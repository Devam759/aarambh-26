import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark/50 border-t border-white/10 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white mb-4 block">
            AARAMBH<span className="text-primary">2026</span>
          </Link>
          <p className="text-gray-500 max-w-sm">
            The largest technology and cultural fest of the year. 
            Embrace the future of innovation and excellence.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Navigation</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="#about">About Us</Link></li>
            <li><Link href="#schedule">Event Schedule</Link></li>
            <li><Link href="#speakers">Guest Speakers</Link></li>
            <li><Link href="/volunteer">Volunteer Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Connect</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Twitter (X)</a></li>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">WhatsApp Channel</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-600">
        &copy; 2026 Aarambh Event Management. All rights reserved.
      </div>
    </footer>
  );
}
