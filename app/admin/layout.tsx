'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import Sidebar from '../../components/admin/Sidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      
      try {
        const roleDoc = await getDoc(doc(db, 'roles', user.uid));
        if (roleDoc.exists() && roleDoc.data().role === 'admin') {
          setLoading(false);
        } else {
          router.push('/scanner');
        }
      } catch (err) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-admin-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-admin-accent" size={48} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-admin-bg text-admin-text font-adminBody">
      <Sidebar />
      <main className="flex-1 w-full md:w-[calc(100%-16rem)] pt-16 md:pt-0 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
