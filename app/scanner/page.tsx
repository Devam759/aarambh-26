'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Loader2, LogOut } from 'lucide-react';

export default function ScannerView() {
  const [loading, setLoading] = useState(true);
  const [scannerAccount, setScannerAccount] = useState<any>(null);
  const [flash, setFlash] = useState<'success' | 'error' | null>(null);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const isProcessing = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      try {
        const roleDoc = await getDoc(doc(db, 'roles', user.uid));
        if (roleDoc.exists() && roleDoc.data().role === 'scanner') {
          const accountDoc = await getDoc(doc(db, 'scannerAccounts', user.uid));
          if (accountDoc.exists()) {
            setScannerAccount(accountDoc.data());
            
            // Update lastActiveAt
            await updateDoc(doc(db, 'scannerAccounts', user.uid), {
              lastActiveAt: serverTimestamp()
            });
            
            setLoading(false);
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (err) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!loading && scannerAccount) {
      if (!scannerRef.current) {
        scannerRef.current = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );

        scannerRef.current.render(onScanSuccess, onScanFailure);
      }
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
    };
  }, [loading, scannerAccount]);

  const showFlash = (type: 'success' | 'error', text: string) => {
    setFlash(type);
    setMessage(text);
    setTimeout(() => {
      setFlash(null);
      setMessage('');
      isProcessing.current = false;
    }, 2500);
  };

  const onScanSuccess = async (decodedText: string) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      const fresherUID = decodedText;
      const regDocRef = doc(db, 'registrations', fresherUID);
      const regDoc = await getDoc(regDocRef);

      if (!regDoc.exists()) {
        await logScan(fresherUID, 'Unknown', 'rejected');
        showFlash('error', 'Entry Rejected: Invalid QR');
        return;
      }

      const regData = regDoc.data();
      if (regData.hasEntered) {
        await logScan(fresherUID, regData.name, 'rejected');
        showFlash('error', `Entry Rejected: ${regData.name} already entered.`);
        return;
      }

      // Valid entry
      await updateDoc(regDocRef, { hasEntered: true });
      await logScan(fresherUID, regData.name, 'accepted');
      showFlash('success', `Entry Accepted: ${regData.name}`);

    } catch (error) {
      console.error(error);
      showFlash('error', 'Entry Rejected: System Error');
    }
  };

  const logScan = async (fresherUID: string, fresherName: string, result: 'accepted' | 'rejected') => {
    if (!scannerAccount) return;
    await addDoc(collection(db, 'scanLogs'), {
      scannerId: scannerAccount.scannerId || auth.currentUser?.uid,
      volunteerName: scannerAccount.volunteerName || 'Unknown',
      fresherUID,
      fresherName,
      timestamp: serverTimestamp(),
      result
    });
  };

  const onScanFailure = (error: any) => {
    // Ignore frequent scan failures
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col font-adminBody">
      {/* Flash overlay */}
      {flash && (
        <div 
          className={`absolute inset-0 z-50 flex items-center justify-center p-8 text-center transition-opacity duration-300 ${
            flash === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider text-white drop-shadow-lg">
            {message}
          </h1>
        </div>
      )}

      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-white/10 z-10">
        <div>
          <h2 className="font-adminHeading text-xl font-bold">Scanner Mode</h2>
          <p className="text-xs text-gray-400">Vol: {scannerAccount?.volunteerName}</p>
        </div>
        <button onClick={handleLogout} className="p-2 bg-white/10 rounded-lg hover:bg-white/20">
          <LogOut size={20} />
        </button>
      </header>

      {/* Scanner Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white/5 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
          <div id="qr-reader" className="w-full"></div>
        </div>
        <p className="mt-8 text-gray-400 text-sm text-center">
          Point camera at attendee QR code.
        </p>
      </main>
    </div>
  );
}
