'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, CreditCard, ArrowLeft, ArrowRight, User, ShieldCheck, Home as HomeIcon, Lock, Unlock, Check, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import ComicBackground from '@/components/ComicBackground';
import { validateRegistrationNumber, formatRegistrationNumber } from '@/lib/utils';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi NCR', 'Jammu and Kashmir', 
  'Ladakh', 'Lakshadweep', 'Puducherry', 'International / Other'
];

const PINCODE_STATE_MAP: { [key: string]: string } = {
  '11': 'Delhi NCR',
  '12': 'Haryana',
  '13': 'Haryana',
  '14': 'Punjab',
  '15': 'Punjab',
  '16': 'Chandigarh',
  '17': 'Himachal Pradesh',
  '18': 'Jammu and Kashmir',
  '19': 'Jammu and Kashmir',
  '20': 'Uttar Pradesh',
  '21': 'Uttar Pradesh',
  '22': 'Uttar Pradesh',
  '23': 'Uttar Pradesh',
  '24': 'Uttar Pradesh',
  '25': 'Uttar Pradesh',
  '26': 'Uttar Pradesh',
  '27': 'Uttar Pradesh',
  '28': 'Uttar Pradesh',
  '30': 'Rajasthan',
  '31': 'Rajasthan',
  '32': 'Rajasthan',
  '33': 'Rajasthan',
  '34': 'Rajasthan',
  '36': 'Gujarat',
  '37': 'Gujarat',
  '38': 'Gujarat',
  '39': 'Gujarat',
  '40': 'Maharashtra',
  '41': 'Maharashtra',
  '42': 'Maharashtra',
  '43': 'Maharashtra',
  '44': 'Maharashtra',
  '45': 'Madhya Pradesh',
  '46': 'Madhya Pradesh',
  '47': 'Madhya Pradesh',
  '48': 'Madhya Pradesh',
  '49': 'Chhattisgarh',
  '50': 'Telangana',
  '51': 'Andhra Pradesh',
  '52': 'Andhra Pradesh',
  '53': 'Andhra Pradesh',
  '56': 'Karnataka',
  '57': 'Karnataka',
  '58': 'Karnataka',
  '59': 'Karnataka',
  '60': 'Tamil Nadu',
  '61': 'Tamil Nadu',
  '62': 'Tamil Nadu',
  '63': 'Tamil Nadu',
  '64': 'Tamil Nadu',
  '67': 'Kerala',
  '68': 'Kerala',
  '69': 'Kerala',
  '70': 'West Bengal',
  '71': 'West Bengal',
  '72': 'West Bengal',
  '73': 'West Bengal',
  '74': 'West Bengal',
  '75': 'Odisha',
  '76': 'Odisha',
  '77': 'Odisha',
  '78': 'Assam',
  '79': 'Assam',
  '80': 'Bihar',
  '81': 'Bihar',
  '82': 'Bihar',
  '83': 'Jharkhand',
  '84': 'Bihar',
  '85': 'Bihar',
};

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [regId, setRegId] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [showPopup, setShowPopup] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    registrationNumber: '',
    gender: '',
    course: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    pincode: '',
    region: '',
    city: '',
    coupon: '',
  });

  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState('');

  useEffect(() => {
    const pin = (formData.pincode || '').trim();
    
    // 1. Instant State suggestion on 2+ digit prefix matching
    if (pin.length >= 2 && /^\d+$/.test(pin.slice(0, 2))) {
      const prefix = pin.slice(0, 2);
      const suggestedState = PINCODE_STATE_MAP[prefix];
      if (suggestedState) {
        setFormData(prev => {
          const matchingState = INDIAN_STATES.find(s => s.toLowerCase() === suggestedState.toLowerCase());
          return { ...prev, region: matchingState || suggestedState };
        });
      }
    }

    // 2. Background city lookup on entering a complete 6-digit pincode
    if (pin.length === 6 && /^\d+$/.test(pin)) {
      const fetchAddress = async () => {
        setIsFetchingPincode(true);
        setPincodeStatus('');
        try {
          const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'VERIFY_PINCODE', pincode: pin })
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice[0]) {
              const po = data[0].PostOffice[0];
              const resolvedState = po.State || '';
              const resolvedCity = po.District || po.Division || po.Region || '';
              
              setFormData(prev => {
                const updated = { ...prev };
                updated.city = resolvedCity;
                const matchingState = INDIAN_STATES.find(s => s.toLowerCase() === resolvedState.toLowerCase());
                if (matchingState) {
                  updated.region = matchingState;
                }
                return updated;
              });
              setPincodeStatus(`Detected: ${resolvedCity}, ${resolvedState}`);
            } else {
              setPincodeStatus('No records found');
            }
          } else {
            setPincodeStatus('Failed to verify pincode');
          }
        } catch (err) {
          console.error("Error auto-fetching pincode details:", err);
          setPincodeStatus('Failed to verify pincode');
        } finally {
          setIsFetchingPincode(false);
        }
      };
      fetchAddress();
    } else {
      setPincodeStatus('');
    }
  }, [formData.pincode]);

  const [touched, setTouched] = useState({
    mobile: false,
    email: false,
    parentPhone: false,
    parentEmail: false,
    registrationNumber: false,
  });

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof typeof touched;
    if (name === 'mobile' || name === 'email' || name === 'parentPhone' || name === 'parentEmail' || name === 'registrationNumber') {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  useEffect(() => {
    const oId = searchParams.get('order_id');
    if (oId) {
      setOrderId(oId);
      verifyPayment(oId);
    }
  }, [searchParams]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showPopup]);

  const verifyPayment = async (oId: string) => {
    setIsProcessing(true);
    try {
      // Only orderId is stored in localStorage, not full PII form data.
      // The server retrieves the full formData from Firestore's pendingRegistrations collection.
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'VERIFY_PAYMENT', orderId: oId })
      });

      const text = await res.text();
      let result: any;
      try {
        result = JSON.parse(text);
      } catch {
        console.error('Verification response is not valid JSON:', text);
        alert(`Server error during verification. Please contact support. (${res.status})`);
        return;
      }

      if (result.success) {
        setIsSuccess(true);
        setRegId(result.id);
        if (result.email) {
          setFormData(prev => ({ ...prev, email: result.email }));
        }
        localStorage.removeItem('pending_registration_id');
      } else {
        alert(result.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'course') {
      setFormData(prev => {
        const updated = { ...prev, course: value };
        if (!prev.registrationNumber || prev.registrationNumber === 'JKLU' || prev.registrationNumber === 'JKLU/') {
          const courseCode = value.toUpperCase().replace(/\./g, '');
          updated.registrationNumber = `JKLU/${courseCode}/2025/`;
        }
        return updated;
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setCouponMessage('Please enter a coupon code.');
      return;
    }
    setCouponMessage('Verifying...');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'VERIFY_COUPON', coupon: couponInput })
      });
      const result = await res.json();
      if (res.ok && result.valid) {
        setFormData(prev => ({ ...prev, coupon: couponInput.trim().toUpperCase() }));
        setCouponMessage('Coupon applied successfully!');
      } else {
        setFormData(prev => ({ ...prev, coupon: '' }));
        setCouponMessage('Invalid coupon code');
      }
    } catch (err) {
      setFormData(prev => ({ ...prev, coupon: '' }));
      setCouponMessage('Error verifying coupon');
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'CREATE_ORDER', 
          honeypot: (document.getElementById('hp_field') as HTMLInputElement)?.value,
          ...formData 
        })
      });

      const text = await res.text();
      let order: any;
      try {
        order = JSON.parse(text);
      } catch {
        console.error('CREATE_ORDER response is not valid JSON:', text);
        throw new Error(`Server error (${res.status}): ${text.slice(0, 200)}`);
      }

      if (!res.ok) {
        throw new Error(order?.error || `Server returned ${res.status}`);
      }
      if (!order.payment_session_id) throw new Error('Failed to create payment session');

      // Store only orderId — full form data is safely in Firestore's pendingRegistrations
      localStorage.setItem('pending_registration_id', order.order_id);

      if (order.is_mock) {
        console.log("Mock mode enabled: Bypassing payment");
        await verifyPayment(order.order_id);
        return;
      }

      const { load } = await import("@cashfreepayments/cashfree-js");
      const cashfree = await load({ 
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === 'PRODUCTION' ? "production" : "sandbox" 
      });
      
      cashfree.checkout({
        paymentSessionId: order.payment_session_id,
        redirectTarget: "_self",
      }).then((result: any) => {
        if (result.error) {
          console.error("Payment failed or cancelled:", result.error);
        } else if (!result.redirect) {
          verifyPayment(order.order_id);
        }
      });

    } catch (error) {
      console.error("Payment error:", error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    handlePayment();
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  };

  const validateMobile = (mobile: string) => {
    const digits = mobile.replace(/\D/g, '');
    if (digits.length === 10) return true;
    if (digits.length === 12 && digits.startsWith('91')) return true;
    if (digits.length === 11 && digits.startsWith('0')) return true;
    return false;
  };

  // Section validation logic
  const studentStarted = 
    formData.name.trim() !== '' ||
    formData.registrationNumber.trim() !== '' ||
    formData.mobile.trim() !== '' ||
    formData.email.trim() !== '' ||
    formData.gender.trim() !== '' ||
    formData.course.trim() !== '';

  const isStudentValid = 
    formData.name.trim() !== '' &&
    formData.registrationNumber.trim() !== '' &&
    validateRegistrationNumber(formData.registrationNumber) &&
    formData.mobile.trim() !== '' &&
    validateMobile(formData.mobile) &&
    formData.email.trim() !== '' &&
    validateEmail(formData.email) &&
    formData.gender.trim() !== '' &&
    formData.course.trim() !== '';

  const parentsStarted = 
    formData.parentName.trim() !== '' ||
    formData.parentPhone.trim() !== '' ||
    formData.parentEmail.trim() !== '';
 
  const isParentsValid = 
    formData.parentName.trim() !== '' &&
    formData.parentPhone.trim() !== '' &&
    validateMobile(formData.parentPhone) &&
    (formData.parentEmail.trim() === '' || validateEmail(formData.parentEmail));

  const isAddressValid = 
    formData.address.trim().length >= 10 &&
    formData.pincode.trim().length === 6 &&
    formData.city.trim() !== '' &&
    formData.region.trim() !== '';

  if (isSuccess) {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center p-4 pt-28 pb-12 sm:p-6 sm:pt-32 selection:bg-brand-ink selection:text-brand-cloud text-brand-ink overflow-hidden">
        <ComicBackground />

        <div className="max-w-md w-full bg-brand-cloud border-comic p-6 sm:p-8 md:p-12 text-center flex flex-col items-center rounded-2xl shadow-comic-lg relative z-10">
          
          <h1 className="text-3xl md:text-4xl font-bricks text-brand-ink mb-4">
            Registration Successful!
          </h1>
          <p className="font-sans font-medium text-sm text-brand-ink/70 mb-6 leading-relaxed">
            Your payment has been processed. A copy of your details has been mailed to <strong className="text-brand-orange font-semibold">{formData.email}</strong>.
          </p>
          <div className="bg-white border-comic-thin px-4 py-2.5 rounded-xl font-mono text-xs tracking-wider mb-8 text-brand-ink w-full shadow-comic-sm">
            REGISTRATION ID: {regId}
          </div>
          <button 
            onClick={() => router.push('/')} 
            className="w-full py-4 bg-brand-orange hover:bg-brand-orange/90 text-brand-cloud border-comic shadow-comic font-sans font-black text-sm uppercase tracking-wider rounded-xl comic-interactive cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen pt-28 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 px-3 sm:px-4 flex flex-col items-center selection:bg-brand-ink selection:text-brand-cloud text-brand-ink overflow-hidden">
      <ComicBackground />

      <div className="w-full max-w-3xl relative z-10">
        <div className="relative mb-8 sm:mb-10 md:mb-14 flex flex-col items-center justify-center gap-4 text-center">
          <h1 
            className="text-5xl sm:text-7xl md:text-8xl font-bricks font-black uppercase leading-[0.9] text-center tracking-tight select-none py-2"
            style={{
              color: '#FF9A00',
              WebkitTextStroke: '2.5px #030404',
            }}
          >
            Aarambh &apos;26 <br />
            Registration
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl font-sans font-bold text-brand-ink/80 max-w-2xl px-4 leading-relaxed">
            Register yourself and be a part of the Aarambh&apos;26 journey
          </p>
        </div>

        <div className="border-comic bg-brand-cloud/80 backdrop-blur-md text-brand-ink p-4 sm:p-6 md:p-12 rounded-2xl shadow-comic-lg relative overflow-hidden bg-halftone-black">
          {isProcessing ? (
            <div className="py-40 flex flex-col items-center justify-center gap-4 min-h-[550px] text-center">
              <Loader2 size={48} className="text-brand-orange animate-spin stroke-[3]" />
              <p className="text-brand-ink/75 font-semibold animate-pulse font-display uppercase tracking-wider text-xs">
                Processing your registration...
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-12">
              {/* Honeypot field */}
              <div className="hidden" aria-hidden="true">
                <input id="hp_field" type="text" name="hp_field" tabIndex={-1} autoComplete="off" />
              </div>

              {/* SECTION 1. STUDENT DETAILS */}
              <div className="space-y-6">
                <div className="flex flex-row items-center justify-between gap-3 border-b-4 border-brand-ink pb-4">
                  <div className="flex items-center gap-3 text-brand-orange">
                    <h2 className="text-2xl sm:text-3xl font-bricks text-brand-ink">Student Details</h2>
                  </div>
                  {isStudentValid ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 border-2 border-brand-ink bg-green-400 text-brand-ink font-display text-[8px] font-black uppercase rounded shadow-comic-sm rotate-3 whitespace-nowrap text-right">
                      <Check size={10} className="stroke-[4] shrink-0" />
                      <span className="flex flex-col text-right leading-tight">
                        <span>Requirement</span>
                        <span>Fulfilled</span>
                      </span>
                    </span>
                  ) : studentStarted ? (
                    <span className="px-2 py-0.5 border-2 border-brand-ink bg-brand-orange text-brand-cloud font-display text-[8px] font-black uppercase rounded shadow-comic-sm -rotate-2 whitespace-nowrap">
                      IN PROGRESS
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 border-2 border-brand-ink bg-brand-blue text-brand-cloud font-display text-[8px] font-black uppercase rounded shadow-comic-sm -rotate-2 whitespace-nowrap">
                      ACTIVE
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-ink/75 block mb-1">Full Name *</label>
                    <input 
                      required 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl"
                      placeholder="Enter your full name" 
                      suppressHydrationWarning 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-ink/75 block mb-1">Application Number *</label>
                    <input 
                      required 
                      name="registrationNumber" 
                      value={formData.registrationNumber} 
                      onChange={(e) => {
                        const formatted = formatRegistrationNumber(e.target.value, formData.registrationNumber);
                        setFormData({ ...formData, registrationNumber: formatted });
                      }}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-white text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl ${
                        touched.registrationNumber && !validateRegistrationNumber(formData.registrationNumber)
                          ? 'border-2 border-brand-orange bg-[#FFF5F8] focus:border-brand-orange focus:shadow-[2px_2px_0px_#FF9A00]'
                          : 'border-comic-thin focus:border-brand-ink'
                      }`}
                      placeholder="JKLU/BBA/2025/0310" 
                      suppressHydrationWarning 
                    />
                    {touched.registrationNumber && !validateRegistrationNumber(formData.registrationNumber) && (
                      <p className="text-[10px] font-black uppercase tracking-wider text-brand-orange mt-1.5">
                        PLEASE ENTER A VALID APPLICATION NUMBER (E.G. JKLU/BBA/2025/0310)
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-ink/75 block mb-1">Mobile Number *</label>
                    <input 
                      required 
                      type="tel" 
                      name="mobile" 
                      value={formData.mobile} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-white text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl ${
                        touched.mobile && !validateMobile(formData.mobile)
                          ? 'border-2 border-brand-orange bg-[#FFF5F8] focus:border-brand-orange focus:shadow-[2px_2px_0px_#FF9A00]'
                          : 'border-comic-thin focus:border-brand-ink'
                      }`}
                      placeholder="+91 98765 43210" 
                      suppressHydrationWarning 
                    />
                    {touched.mobile && !validateMobile(formData.mobile) && (
                      <p className="text-[10px] font-black uppercase tracking-wider text-brand-orange mt-1.5">
                        PLEASE ENTER A VALID 10-DIGIT MOBILE NUMBER
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-ink/75 block mb-1">Email ID *</label>
                    <input 
                      required 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 bg-white text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl ${
                        touched.email && !validateEmail(formData.email)
                          ? 'border-2 border-brand-orange bg-[#FFF5F8] focus:border-brand-orange focus:shadow-[2px_2px_0px_#FF9A00]'
                          : 'border-comic-thin focus:border-brand-ink'
                      }`}
                      placeholder="Enter your email" 
                      suppressHydrationWarning 
                    />
                    {touched.email && !validateEmail(formData.email) && (
                      <p className="text-[10px] font-black uppercase tracking-wider text-brand-orange mt-1.5">
                        PLEASE ENTER A VALID EMAIL ADDRESS
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-ink/75 block mb-1">Course *</label>
                    <select
                      required
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white border-comic-thin font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl appearance-none cursor-pointer pr-10 ${
                        formData.course ? 'text-brand-ink' : 'text-brand-ink/40'
                      }`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23030404' stroke-width='3' stroke-linecap='square' stroke-linejoin='miter'%3e%3cpath d='M6 9l6 6 6-6'/%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '1.25rem',
                      }}
                    >
                      <option value="" disabled hidden>Select Course</option>
                      <option value="B.Tech" className="text-brand-ink font-bold">B.Tech</option>
                      <option value="BBA" className="text-brand-ink font-bold">BBA</option>
                      <option value="B.Des" className="text-brand-ink font-bold">B.Des</option>
                      <option value="M.Des" className="text-brand-ink font-bold">M.Des</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-ink/75 block mb-1">Gender *</label>
                    <select
                      required
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-white border-comic-thin font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl appearance-none cursor-pointer pr-10 ${
                        formData.gender ? 'text-brand-ink' : 'text-brand-ink/40'
                      }`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23030404' stroke-width='3' stroke-linecap='square' stroke-linejoin='miter'%3e%3cpath d='M6 9l6 6 6-6'/%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '1.25rem',
                      }}
                    >
                      <option value="" disabled hidden>Select Gender</option>
                      <option value="Male" className="text-brand-ink font-bold">Male</option>
                      <option value="Female" className="text-brand-ink font-bold">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2. PARENTS DETAILS (ACCORDION) */}
              <div className="space-y-6">
                <div className={`flex flex-row items-center justify-between gap-3 border-b-4 border-brand-ink pb-4 transition-all duration-300 ${!isStudentValid ? 'opacity-30' : ''}`}>
                  <div className="flex items-center gap-3 text-brand-blue">
                    <h2 className="text-2xl sm:text-3xl font-bricks text-brand-ink">Parents Details</h2>
                  </div>
                  {isStudentValid ? (
                    isParentsValid ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 border-2 border-brand-ink bg-green-400 text-brand-ink font-display text-[8px] font-black uppercase rounded shadow-comic-sm rotate-3 whitespace-nowrap text-right">
                        <Check size={10} className="stroke-[4] shrink-0" />
                        <span className="flex flex-col text-right leading-tight">
                          <span>Requirement</span>
                          <span>Fulfilled</span>
                        </span>
                      </span>
                    ) : parentsStarted ? (
                      <span className="px-2 py-0.5 border-2 border-brand-ink bg-brand-orange text-brand-cloud font-display text-[8px] font-black uppercase rounded shadow-comic-sm -rotate-2 whitespace-nowrap">
                        IN PROGRESS
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 border-2 border-brand-ink bg-brand-blue text-brand-cloud font-display text-[8px] font-black uppercase rounded shadow-comic-sm -rotate-2 whitespace-nowrap">
                        ACTIVE
                      </span>
                    )
                  ) : (
                    <span className="px-2 py-0.5 border-2 border-brand-ink bg-[#F5F1E5] text-brand-ink/40 font-display text-[8px] font-black uppercase rounded shadow-comic-sm whitespace-nowrap">
                      🔒 LOCKED
                    </span>
                  )}
                </div>
                
                <AnimatePresence initial={false}>
                  {isStudentValid && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden space-y-6 pb-3"
                    >
                      {/* Parent Details Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-ink/75 block mb-1">Parent&apos;s Name *</label>
                          <input 
                            required={isStudentValid}
                            name="parentName" 
                            value={formData.parentName} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl" 
                            placeholder="Parent's full name"
                            suppressHydrationWarning 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-ink/75 block mb-1">Parent&apos;s Mobile *</label>
                          <input 
                            required={isStudentValid}
                            name="parentPhone" 
                            value={formData.parentPhone} 
                            onChange={handleChange} 
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 bg-white text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl ${
                              touched.parentPhone && !validateMobile(formData.parentPhone)
                                ? 'border-2 border-brand-orange bg-[#FFF5F8] focus:border-brand-orange focus:shadow-[2px_2px_0px_#FF9A00]'
                                : 'border-comic-thin focus:border-brand-ink'
                            }`} 
                            placeholder="Parent's mobile number"
                            suppressHydrationWarning 
                          />
                          {touched.parentPhone && !validateMobile(formData.parentPhone) && (
                            <p className="text-[10px] font-black uppercase tracking-wider text-brand-orange mt-1.5">
                              PLEASE ENTER A VALID 10-DIGIT MOBILE NUMBER
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-ink/75 block mb-1">Parent&apos;s Email</label>
                          <input 
                            name="parentEmail" 
                            value={formData.parentEmail} 
                            onChange={handleChange} 
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 bg-white text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl ${
                              formData.parentEmail.trim() !== '' && touched.parentEmail && !validateEmail(formData.parentEmail)
                                ? 'border-2 border-brand-orange bg-[#FFF5F8] focus:border-brand-orange focus:shadow-[2px_2px_0px_#FF9A00]'
                                : 'border-comic-thin focus:border-brand-ink'
                            }`} 
                            placeholder="parents@email.com"
                            suppressHydrationWarning 
                          />
                          {formData.parentEmail.trim() !== '' && touched.parentEmail && !validateEmail(formData.parentEmail) && (
                            <p className="text-[10px] font-black uppercase tracking-wider text-brand-orange mt-1.5">
                              PLEASE ENTER A VALID EMAIL ADDRESS
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SECTION 3. ADDRESS & PAYMENT (ACCORDION) */}
              <div className="space-y-6">
                <div className={`flex flex-row items-center justify-between gap-3 border-b-4 border-brand-ink pb-4 transition-all duration-300 ${(!isStudentValid || !isParentsValid) ? 'opacity-30' : ''}`}>
                  <div className="flex items-center gap-3 text-brand-orange">
                    <h2 className="text-xl sm:text-3xl font-bricks text-brand-ink">Address & Verification</h2>
                  </div>
                  {isStudentValid && isParentsValid ? (
                    isAddressValid ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 border-2 border-brand-ink bg-green-400 text-brand-ink font-display text-[8px] font-black uppercase rounded shadow-comic-sm rotate-3 whitespace-nowrap text-right">
                        <Check size={10} className="stroke-[4] shrink-0" />
                        <span className="flex flex-col text-right leading-tight">
                          <span>Requirement</span>
                          <span>Fulfilled</span>
                        </span>
                      </span>
                    ) : formData.address.trim().length > 0 ? (
                      <span className="px-2 py-0.5 border-2 border-brand-ink bg-brand-orange text-brand-cloud font-display text-[8px] font-black uppercase rounded shadow-comic-sm -rotate-2 whitespace-nowrap">
                        IN PROGRESS
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 border-2 border-brand-ink bg-brand-blue text-brand-cloud font-display text-[8px] font-black uppercase rounded shadow-comic-sm -rotate-2 whitespace-nowrap">
                        ACTIVE
                      </span>
                    )
                  ) : (
                    <span className="px-2 py-0.5 border-2 border-brand-ink bg-[#F5F1E5] text-brand-ink/40 font-display text-[8px] font-black uppercase rounded shadow-comic-sm whitespace-nowrap">
                      🔒 LOCKED
                    </span>
                  )}
                </div>
                
                <AnimatePresence initial={false}>
                  {isStudentValid && isParentsValid && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden space-y-6 pb-3"
                    >
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-ink/75 block mb-1">Full Address *</label>
                        <textarea 
                          required={isStudentValid && isParentsValid}
                          name="address" 
                          value={formData.address} 
                          onChange={handleChange} 
                          rows={3} 
                          className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl resize-none" 
                          placeholder="House No, Street, Landmark, City, State, Pincode" 
                          suppressHydrationWarning 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-ink/75 block mb-1">Pincode *</label>
                          <input 
                            required={isStudentValid && isParentsValid}
                            name="pincode" 
                            maxLength={6}
                            value={formData.pincode} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl"
                            placeholder="302026" 
                            suppressHydrationWarning 
                          />
                          {isFetchingPincode && (
                            <p className="text-[10px] font-bold text-brand-ink/50 animate-pulse mt-1">
                              Fetching...
                            </p>
                          )}
                          {pincodeStatus && !isFetchingPincode && (
                            <p className={`text-[10px] font-bold mt-1 ${pincodeStatus.startsWith('Detected') ? 'text-green-700' : 'text-brand-orange'}`}>
                              {pincodeStatus}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-ink/75 block mb-1">City *</label>
                          <input 
                            required={isStudentValid && isParentsValid}
                            name="city" 
                            value={formData.city} 
                            onChange={handleChange} 
                            className="w-full px-4 py-3 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/40 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl"
                            placeholder="Jaipur" 
                            suppressHydrationWarning
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-brand-ink/75 block mb-1">Region / State *</label>
                          <select
                            required={isStudentValid && isParentsValid}
                            name="region"
                            value={formData.region}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-white border-comic-thin font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl appearance-none cursor-pointer pr-10 ${
                              formData.region ? 'text-brand-ink' : 'text-brand-ink/40'
                            }`}
                            style={{
                              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23030404' stroke-width='3' stroke-linecap='square' stroke-linejoin='miter'%3e%3cpath d='M6 9l6 6 6-6'/%3e%3c/svg%3e")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 1rem center',
                              backgroundSize: '1.25rem',
                            }}
                          >
                            <option value="" disabled hidden>Select Region / State</option>
                            {INDIAN_STATES.map((state) => (
                              <option key={state} value={state} className="text-brand-ink font-bold">
                                {state}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Coupon Code Section */}
                      <div className="border-2 border-brand-ink/10 p-4 rounded-2xl bg-brand-cloud/20 space-y-3">
                        <label className="text-xs font-bold text-brand-ink/75 block">Have a Coupon / Discount Code?</label>
                        <div className="flex gap-3">
                          <input 
                            type="text"
                            placeholder="ENTER CODE" 
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-white border-comic-thin text-brand-ink placeholder:text-brand-ink/30 font-bold focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-comic-sm transition-all rounded-xl uppercase text-xs"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            className="px-6 py-2.5 bg-brand-orange text-brand-cloud border-comic shadow-comic-sm font-display font-black text-xs uppercase tracking-wider rounded-xl comic-interactive flex items-center justify-center cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
                          >
                            Apply
                          </button>
                        </div>
                        {couponMessage && (
                          <p className={`text-[10px] font-bold ${couponMessage.includes('successfully') ? 'text-green-700' : 'text-brand-orange'}`}>
                            {couponMessage}
                          </p>
                        )}
                      </div>

                      <div className="border-comic bg-brand-orange/5 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden shadow-comic bg-halftone-black opacity-95">
                        <div>
                          <p className="text-xs font-black text-brand-ink/60 uppercase tracking-widest mb-1">Registration Fee</p>
                          <div className="flex items-center gap-3">
                            {formData.coupon !== '' ? (
                              <p className="text-2xl sm:text-3xl font-sans font-bold text-brand-ink">₹ 1</p>
                            ) : (
                              <p className="text-2xl sm:text-3xl font-sans font-bold text-brand-ink">₹ 2,500</p>
                            )}
                          </div>
                        </div>
                        <button 
                          type="submit" 
                          className="px-10 py-5 bg-brand-orange text-brand-cloud border-comic shadow-comic font-display font-black text-lg uppercase tracking-wider rounded-xl comic-interactive flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
                        >
                          <CreditCard size={24} className="stroke-[3]" /> Pay Now
                        </button>
                      </div>

                      <div className="mt-4 border-2 border-brand-ink bg-white p-4 rounded-xl text-center shadow-comic-sm space-y-1.5">
                        <p className="text-xs font-black uppercase tracking-wider text-brand-orange">
                          Important Note: The registration fee is strictly non-refundable under any circumstances.
                        </p>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-brand-ink/60">
                          A 2% gateway transaction fee charged by Cashfree Payments will be added at checkout.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Pop-up Modal */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPopup(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md bg-brand-cloud border-[4px] border-brand-ink p-6 sm:p-8 rounded-2xl shadow-[8px_16px_0px_#030404] z-10 text-center flex flex-col items-center gap-6"
            >
              {/* Close Button 'X' */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-brand-cloud border-2 border-brand-ink shadow-[1px_2px_0px_#030404] hover:bg-brand-orange hover:text-brand-ink active:scale-95 transition-all flex justify-center items-center cursor-pointer text-brand-ink"
                aria-label="Close"
              >
                <X size={16} className="stroke-[3]" />
              </button>

              {/* Icon / Badge */}
              <div className="px-3 py-1 bg-brand-orange text-brand-ink border-comic-thin shadow-comic-sm font-bricks text-xs uppercase tracking-wider rotate-[-2deg] select-none">
                Important
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-bricks text-brand-ink leading-tight uppercase">
                Complete your <br />
                registration <br />
                documentation online
              </h3>

              {/* Description */}
              <p className="font-sans font-semibold text-sm text-brand-ink/70 leading-relaxed">
                Before completing the registration form and paying the fee, make sure you fill out the required documentation online.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                <a
                  href="https://sahayak.jklu.edu.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowPopup(false)}
                  className="flex-1 py-3 px-4 bg-brand-pink hover:bg-brand-pink/90 text-brand-ink border-comic shadow-comic font-display font-black text-xs uppercase tracking-wider rounded-xl comic-interactive cursor-pointer select-none active:scale-95 text-center flex items-center justify-center"
                >
                  Go to Documentation
                </a>
                <button
                  onClick={() => setShowPopup(false)}
                  className="flex-1 py-3 px-4 bg-white hover:bg-brand-cloud text-brand-ink border-comic shadow-comic font-display font-black text-xs uppercase tracking-wider rounded-xl comic-interactive cursor-pointer select-none active:scale-95"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-ink flex items-center justify-center"><Loader2 className="animate-spin text-brand-orange stroke-[3]" size={48} /></div>}>
      <RegisterContent />
    </Suspense>
  );
}
