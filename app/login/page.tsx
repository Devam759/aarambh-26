'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import { auth, db, isFirebaseConfigured, FIREBASE_SETUP_MESSAGE } from '../../lib/firebase';
import { logAdminAction } from '../../lib/audit';

// ============================================================================
// BESPOKE CUSTOM GEOMETRIC SVG ICONS (Gradient-free, Sharp, Heavy-mitre, No standard libraries)
// ============================================================================

const CustomMailIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
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
    <rect x="2" y="4" width="20" height="16" />
    <path d="M22 4L12 13L2 4" />
    <path d="M2 20L9 13" />
    <path d="M22 20L15 13" />
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
    <rect x="3" y="11" width="18" height="11" />
    <path d="M7 11V7C7 4.2 9.2 2 12 2C14.8 2 17 4.2 17 7V11" />
    <line x1="12" y1="15" x2="12" y2="18" />
  </svg>
);

const CustomEyeIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
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
    <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CustomEyeOffIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
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
    <path d="M20 16.5A11 11 0 0 1 12 20C5 20 1 12 1 12S3.5 7.5 8 5" />
    <path d="M12 4c7 0 11 8 11 8s-.8 1.6-2.5 3.5" />
    <path d="M14.2 14.2A3 3 0 0 1 9.8 9.8" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const CustomKeyIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
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
    <circle cx="7" cy="12" r="4" />
    <path d="M11 12H22V16H18V12H15V16H11" />
  </svg>
);

const CustomWarningIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
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
    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
    <line x1="12" y1="8" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CustomLoaderIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3.2" 
    strokeLinecap="square" 
    className={`animate-spin ${className}`}
  >
    <path d="M12 2A10 10 0 0 1 22 12" />
  </svg>
);

// ============================================================================
// LOGIN VIEW PAGE
// ============================================================================

function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = 'length';
  let i;
  const words: number[] = [];
  const asciiLength = ascii[lengthProperty];
  const hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2fcabb73, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  const primes: number[] = [];
  let candidate = 2;
  while (primes[lengthProperty] < 64) {
    let isPrime = true;
    for (i = 0; i < primes[lengthProperty]; i++) {
      if (candidate % primes[i] === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(candidate);
    candidate++;
  }
  for (i = 0; i < 64; i++) {
    if (i < 8) hash[i] = (mathPow(primes[i], 1 / 2) * maxWord) | 0;
    k[i] = (mathPow(primes[i], 1 / 3) * maxWord) | 0;
  }
  let asciiBitLength = asciiLength * 8;
  const paddingBytes = (56 - (asciiLength + 1) % 64 + 64) % 64;
  const paddedAscii = ascii + '\x80' + '\x00'.repeat(paddingBytes);
  for (i = 0; i < paddedAscii[lengthProperty]; i++) {
    const charCode = paddedAscii.charCodeAt(i);
    const wordIndex = i >> 2;
    words[wordIndex] = (words[wordIndex] || 0) | (charCode << (24 - (i % 4) * 8));
  }
  words.push(0);
  words.push(asciiBitLength);
  for (let blockStart = 0; blockStart < words[lengthProperty]; blockStart += 16) {
    const w: number[] = [];
    let a = hash[0], b = hash[1], c = hash[2], d = hash[3],
        e = hash[4], f = hash[5], g = hash[6], h = hash[7];
    for (i = 0; i < 64; i++) {
      if (i < 16) {
        w[i] = words[blockStart + i] || 0;
      } else {
        const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + k[i] + w[i]) | 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;
      h = g; g = f; f = e; e = (d + temp1) | 0; d = c; c = b; b = a; a = (temp1 + temp2) | 0;
    }
    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }
  let hex = '';
  for (i = 0; i < 8; i++) {
    const val = hash[i];
    const unsignedVal = val < 0 ? val + 0x100000000 : val;
    hex += unsignedVal.toString(16).padStart(8, '0');
  }
  return hex;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured() || !auth || !db) {
      setError(FIREBASE_SETUP_MESSAGE);
      return;
    }
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);

    const inputClean = email.trim();
    const isUid = /^AAR-/i.test(inputClean);

    try {
      if (isUid) {
        // UID Login Fallback
        const q = query(collection(db, 'volunteers'), where('uid', '==', inputClean.toUpperCase()));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const volDoc = snap.docs[0];
          const volData = volDoc.data();
          const hashedInput = sha256(password);
          
          if (volData.passwordHash === hashedInput) {
            // Save session
            const sessionData = {
              uid: volDoc.id,
              email: volData.email,
              role: volData.role === 'Team Leader' ? 'team_leader' : 'volunteer',
              name: volData.name,
              volUid: volData.uid
            };
            localStorage.setItem('aarambh_session', JSON.stringify(sessionData));
            
            // Log successful UID fallback login
            const performer = volData.email || volData.name || volData.uid;
            await logAdminAction('LOGIN_UID', 'sessions', `Volunteer ${performer} signed in successfully via UID fallback`, performer);

            router.push('/volunteer');
            return;
          }
        }
        setError('Invalid UID or password.');
      } else {
        // First check if user exists in the Firestore volunteers collection (bypass Auth to avoid dev errors/rate-limiting)
        const q = query(collection(db, 'volunteers'), where('email', '==', inputClean.toLowerCase()));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const volDoc = snap.docs[0];
          const volData = volDoc.data();
          const hashedInput = sha256(password);

          if (volData.passwordHash === hashedInput) {
            const sessionData = {
              uid: volDoc.id,
              email: volData.email,
              role: volData.role === 'Team Leader' ? 'team_leader' : 'volunteer',
              name: volData.name,
              volUid: volData.uid
            };
            localStorage.setItem('aarambh_session', JSON.stringify(sessionData));
            
            // Log successful credentials fallback login
            const performer = volData.email || volData.name || volData.uid;
            await logAdminAction('LOGIN_FALLBACK', 'sessions', `Volunteer ${performer} signed in successfully via credentials fallback`, performer);

            router.push('/volunteer');
            return;
          } else {
            setError('Invalid email or password.');
            return;
          }
        }

        // Standard Email Login with Firebase Auth (for Admin/Scanner roles who aren't in the volunteers collection)
        try {
          const userCredential = await signInWithEmailAndPassword(auth, inputClean, password);
          const uid = userCredential.user.uid;
          
          // Clear any stale local storage session since we are using Firebase Auth
          localStorage.removeItem('aarambh_session');

          const roleDoc = await getDoc(doc(db, 'roles', uid));
          if (roleDoc.exists()) {
            const role = roleDoc.data().role;
            
            // Log successful login
            await logAdminAction('LOGIN', 'sessions', `User ${inputClean} signed in successfully with role: ${role}`);

            if (role === 'admin') {
              router.push('/admin');
            } else if (role === 'scanner') {
              router.push('/scanner');
            } else if (role === 'feedback') {
              router.push('/feedback-portal');
            } else if (role === 'volunteer' || role === 'team_leader') {
              router.push('/volunteer');
            } else {
              setError('Access denied: Invalid account role.');
              await auth.signOut();
            }
          } else {
            setError('Access denied: Unauthorized account.');
            await auth.signOut();
          }
        } catch (authErr) {
          console.error('Login error:', authErr);
          setError('Invalid email or password.');
        }
      }
    } catch (err: any) {
      console.error('Login system error:', err);
      setError('An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cloud flex flex-col items-center justify-center p-4 md:p-8 font-sans relative select-none">
      {/* Background structural design details (grid pattern) */}
      <div className="absolute inset-0 bg-[radial-gradient(#030404_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
      
      <div className="w-full max-w-[440px] z-10">
        {/* Core Premium Card */}
        <div className="bg-white border-4 border-brand-ink p-8 md:p-10 shadow-[8px_8px_0px_0px_#030404] rounded-lg">
          
          {/* Header & Logo */}
          <div className="text-center mb-8">
            <Image 
              src="/logos/Aarambh_new_logo.svg" 
              alt="AARAMBH '26" 
              width={1222} 
              height={482} 
              priority
              unoptimized
              className="h-20 w-auto object-contain mx-auto mb-6"
              style={{ width: 'auto' }}
            />
            <h1 className="text-xl font-display font-black tracking-wider uppercase text-brand-ink">
              Management Portal
            </h1>
            <div className="h-1 w-12 bg-brand-orange mx-auto mt-2.5 border-2 border-brand-ink" />
          </div>

          {/* Firebase Configuration Warnings */}
          {!isFirebaseConfigured() && (
            <div className="mb-6 p-4 bg-brand-orange/15 text-brand-ink text-xs font-semibold border-2 border-brand-ink rounded-md flex gap-3 items-start shadow-comic-sm">
              <CustomWarningIcon className="text-brand-orange shrink-0 mt-0.5" size={18} />
              <div className="leading-relaxed">
                <strong className="block text-sm font-bold uppercase mb-1">Firebase Unconfigured</strong>
                {FIREBASE_SETUP_MESSAGE}
              </div>
            </div>
          )}

          {/* Error Message Display */}
          {error && (
            <div className="mb-6 p-3 bg-brand-orange/15 text-brand-ink text-xs font-bold border-2 border-brand-ink rounded-md flex gap-2 items-center shadow-comic-sm">
              <CustomWarningIcon className="text-brand-orange shrink-0" size={16} />
              <span className="uppercase tracking-wide">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase text-brand-ink/65 tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <CustomMailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/40" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border-2 border-brand-ink rounded-md py-3 pl-11 pr-4 focus:outline-none focus:border-brand-orange text-sm text-brand-ink font-bold placeholder:text-brand-ink/30 transition-colors shadow-inner"
                  placeholder="email@aarambh.jklu.edu.in"
                  required
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-brand-ink/65 tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <CustomLockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink/40" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border-2 border-brand-ink rounded-md py-3 pl-11 pr-11 focus:outline-none focus:border-brand-orange text-sm text-brand-ink font-bold placeholder:text-brand-ink/30 transition-colors shadow-inner"
                  placeholder="••••••••"
                  required
                  suppressHydrationWarning
                />
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-ink/40 hover:text-brand-ink focus:outline-none cursor-pointer transition-colors"
                >
                  {showPassword ? <CustomEyeOffIcon size={16} /> : <CustomEyeIcon size={16} />}
                </button>
              </div>
            </div>

            {/* Submission Button */}
            <button
              type="submit"
              disabled={loading}
              suppressHydrationWarning
              className="comic-btn-orange w-full py-4"
            >
              {loading ? (
                <CustomLoaderIcon className="text-brand-ink" size={18} />
              ) : (
                <>
                  <CustomKeyIcon size={16} />
                  <span className="uppercase tracking-widest text-xs">Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-brand-ink/50 text-[10px] uppercase font-black tracking-[0.2em]">
          JK Lakshmipat University
        </p>
      </div>
    </div>
  );
}
