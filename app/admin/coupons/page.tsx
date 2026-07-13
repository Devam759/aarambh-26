'use client';

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { SkeletonTable } from '../../../components/admin/SkeletonLoader';
import { Modal } from '../../../components/admin/Modal';
import { logAdminAction } from '../../../lib/audit';

// Custom SVG Icons
const CustomTagIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" className={className}>
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const CustomPlusIcon = ({ className = '', size = 18 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

interface Coupon {
  id: string; // The coupon code
  code: string;
  amount: number;
  active: boolean;
  createdAt: any;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newAmount, setNewAmount] = useState<number | ''>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'coupons'), (snap) => {
      const fetched: Coupon[] = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Coupon[];
      
      // Sort by creation date (newest first)
      fetched.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });

      setCoupons(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching coupons:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newCode.trim().toUpperCase();
    
    if (!cleanCode) return alert('Please enter a coupon code');
    if (newAmount === '') return alert('Please enter an amount');
    
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, 'coupons', cleanCode), {
        code: cleanCode,
        amount: Number(newAmount),
        active: true,
        createdAt: serverTimestamp()
      });
      
      await logAdminAction('CREATE_COUPON', 'coupons', `Created new coupon: ${cleanCode} with fixed price Rs. ${newAmount}`);
      
      setNewCode('');
      setNewAmount(1);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding coupon:", error);
      alert('Failed to add coupon.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'disable' : 'enable'} this coupon?`)) return;
    
    try {
      await updateDoc(doc(db, 'coupons', id), {
        active: !currentStatus
      });
      await logAdminAction('UPDATE_COUPON', 'coupons', `${!currentStatus ? 'Enabled' : 'Disabled'} coupon: ${id}`);
    } catch (error) {
      console.error("Error toggling coupon:", error);
      alert('Failed to update coupon status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this coupon?')) return;
    
    try {
      await deleteDoc(doc(db, 'coupons', id));
      await logAdminAction('DELETE_COUPON', 'coupons', `Deleted coupon: ${id}`);
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert('Failed to delete coupon.');
    }
  };

  return (
    <div className="space-y-8 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-adminHeading text-3xl font-black uppercase tracking-tight text-brand-ink mb-1.5">Coupons</h1>
          <p className="text-admin-muted font-bold text-xs uppercase tracking-wider">Manage dynamic discount codes</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-ink text-white border-4 border-brand-ink px-6 py-3 rounded-md shadow-[4px_4px_0px_0px_#f97316] font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:translate-y-[-2px] transition-all cursor-pointer"
        >
          <CustomPlusIcon size={16} /> Add Coupon
        </button>
      </div>

      {/* Main Table Grid */}
      {loading ? (
        <SkeletonTable rows={5} />
      ) : (
        <div className="bg-white border-4 border-brand-ink rounded-md shadow-[6px_6px_0px_0px_#030404] overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-cloud border-b-2 border-brand-ink text-brand-ink text-[10px] font-black uppercase tracking-widest">
                  <th className="p-4 w-16 text-center border-r-2 border-brand-ink/15">S.No</th>
                  <th className="p-4">Coupon Code</th>
                  <th className="p-4">Fixed Amount (Rs.)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-ink/10">
                {coupons.map((coupon, idx) => (
                  <tr key={coupon.id} className="hover:bg-brand-cloud/45 transition-colors text-xs font-bold text-brand-ink">
                    <td className="p-4 text-center border-r-2 border-brand-ink/15 text-admin-muted font-black">
                      {idx + 1}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CustomTagIcon size={14} className="text-brand-orange" />
                        <span className="font-black text-sm uppercase">{coupon.code}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-admin-muted">
                      Rs. {Number(coupon.amount).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 border-2 border-brand-ink rounded-md text-[9px] font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_#030404] ${
                        coupon.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {coupon.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => handleToggleActive(coupon.id, coupon.active)}
                        className="px-3 py-1.5 border-2 border-brand-ink rounded-md text-[10px] font-black uppercase hover:bg-brand-cloud transition-colors shadow-[1px_1px_0px_0px_#030404] cursor-pointer"
                      >
                        Toggle
                      </button>
                      <button 
                        onClick={() => handleDelete(coupon.id)}
                        className="px-3 py-1.5 border-2 border-brand-ink rounded-md text-[10px] font-black uppercase bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-[1px_1px_0px_0px_#030404] cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-admin-muted font-black text-xs uppercase tracking-wider">
                      No dynamic coupons found. (Environment variable coupons may still be active).
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Coupon">
        <form onSubmit={handleAddCoupon} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-brand-ink/65 tracking-wider mb-2">Coupon Code</label>
            <input 
              type="text" 
              required
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="e.g. VIP2026"
              className="w-full bg-brand-cloud border-2 border-brand-ink rounded-md py-3 px-4 text-sm text-brand-ink font-bold focus:outline-none focus:bg-white transition-colors shadow-inner uppercase tracking-wider placeholder:text-brand-ink/30"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-brand-ink/65 tracking-wider mb-2">Fixed Payment Amount (Rs.)</label>
            <input 
              type="number" 
              required
              min="0"
              step="any"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 1 (For testing) or 2000 (For discount)"
              className="w-full bg-brand-cloud border-2 border-brand-ink rounded-md py-3 px-4 text-sm text-brand-ink font-bold focus:outline-none focus:bg-white transition-colors shadow-inner"
            />
            <p className="text-[10px] text-admin-muted font-bold mt-2">
              Note: This is the exact amount the user will pay. The standard price is Rs. 2500. Set to 1 for test coupons.
            </p>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-brand-orange text-brand-ink border-2 border-brand-ink py-3 rounded-md font-black uppercase tracking-widest text-xs hover:bg-[#e86308] transition-colors shadow-[2px_2px_0px_0px_#030404] disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Creating...' : 'Create Coupon'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
