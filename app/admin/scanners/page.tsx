'use client';

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, setDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { SkeletonTable } from '../../../components/admin/SkeletonLoader';
import { Modal } from '../../../components/admin/Modal';
import { logAdminAction } from '../../../lib/audit';
import { Plus, Trash2, ShieldAlert, Power, PowerOff, AlertCircle } from 'lucide-react';
import { initializeApp, deleteApp, getApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '../../../lib/firebase';
// Note: In a real production app, creating users and deleting users should be done via Cloud Functions Admin SDK.
// For demonstration on the client side, we manipulate the Firestore documents.

export default function ScannerAccounts() {
  const [scanners, setScanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedScanner, setSelectedScanner] = useState<any>(null);

  // Form state
  const [volunteerName, setVolunteerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, 'scannerAccounts')), (snap) => {
      setScanners(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerName) return;
    if (scanners.length >= 5) {
      alert('Maximum of 5 scanner accounts allowed.');
      return;
    }
    setIsSubmitting(true);
    
    let secondaryApp;
    try {
      const generateSecurePassword = (length = 8): string => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => chars[byte % chars.length]).join('');
      };

      const generateSecureScannerId = (): string => {
        const array = new Uint16Array(1);
        window.crypto.getRandomValues(array);
        const num = array[0] % 10000;
        return `SCAN-${String(num).padStart(4, '0')}`;
      };

      const generatedEmail = `scanner_${Date.now()}@aarambh.com`;
      const generatedPassword = generateSecurePassword(8);
      
      // Initialize a secondary app to create a user without signing out the admin
      const secondaryAppName = `secondary_${Date.now()}`;
      secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, generatedEmail, generatedPassword);
      const uid = userCredential.user.uid;
      
      const newScannerId = generateSecureScannerId();
      
      await setDoc(doc(db, 'scannerAccounts', uid), {
        scannerId: newScannerId,
        volunteerName,
        email: generatedEmail,
        createdAt: new Date(),
        lastActiveAt: null,
        status: 'Active'
      });
      
      await setDoc(doc(db, 'roles', uid), {
        role: 'scanner'
      });

      await logAdminAction('CREATE_SCANNER', `scannerAccounts/${uid}`, `Created scanner for ${volunteerName}`);
      
      setIsCreateOpen(false);
      setVolunteerName('');
      alert(`Account created!\nEmail: ${generatedEmail}\nPassword: ${generatedPassword}\nPlease copy these credentials.`);
    } catch (err: any) {
      console.error(err);
      alert(`Error creating scanner: ${err.message}`);
    } finally {
      if (secondaryApp) {
        await deleteApp(secondaryApp);
      }
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (scanner: any) => {
    const newStatus = scanner.status === 'Active' ? 'Inactive' : 'Active';
    await updateDoc(doc(db, 'scannerAccounts', scanner.id), { status: newStatus });
    await logAdminAction('TOGGLE_SCANNER_STATUS', `scannerAccounts/${scanner.id}`, `Changed status to ${newStatus}`);
  };

  const handleDelete = async () => {
    if (!selectedScanner) return;
    try {
      await deleteDoc(doc(db, 'scannerAccounts', selectedScanner.id));
      await deleteDoc(doc(db, 'roles', selectedScanner.id));
      await logAdminAction('DELETE_SCANNER', `scannerAccounts/${selectedScanner.id}`, `Deleted scanner account`);
      setIsDeleteOpen(false);
      setSelectedScanner(null);
    } catch (err) {
      alert('Error deleting scanner');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-adminHeading text-3xl font-bold mb-2">Scanner Accounts</h1>
          <p className="text-admin-muted">Manage volunteer QR scanner access</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          disabled={scanners.length >= 5}
          className={`font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors ${
            scanners.length >= 5 
              ? 'bg-admin-muted/20 text-admin-muted cursor-not-allowed' 
              : 'bg-admin-accent hover:bg-yellow-500 text-black'
          }`}
        >
          <Plus size={20} /> Add Scanner
        </button>
      </div>

      {scanners.length >= 5 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">Scanner limit reached (5/5 accounts). Delete an account to add a new one.</p>
        </div>
      )}

      {loading ? (
        <SkeletonTable rows={5} />
      ) : (
        <div className="bg-admin-surface border border-admin-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-admin-bg/50 border-b border-admin-border text-admin-muted text-sm uppercase tracking-wider">
                  <th className="p-4 w-16 text-center border-r border-admin-border">S.No</th>
                  <th className="p-4 font-medium">Scanner ID</th>
                  <th className="p-4 font-medium">Volunteer Name</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Last Active</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {scanners.map((scanner, idx) => (
                  <tr key={scanner.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 text-center border-r border-admin-border text-admin-muted font-medium">
                      {idx + 1}
                    </td>
                    <td className="p-4 font-medium">{scanner.scannerId}</td>
                    <td className="p-4">{scanner.volunteerName}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        scanner.status === 'Active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {scanner.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-admin-muted text-sm">
                      {scanner.lastActiveAt ? scanner.lastActiveAt.toDate().toLocaleString() : 'Never'}
                    </td>
                    <td className="p-4 flex items-center justify-end gap-3">
                      <button 
                        onClick={() => handleToggleStatus(scanner)}
                        className="text-admin-muted hover:text-admin-text transition-colors"
                        title={scanner.status === 'Active' ? 'Deactivate' : 'Reactivate'}
                      >
                        {scanner.status === 'Active' ? <PowerOff size={18} /> : <Power size={18} />}
                      </button>
                      <button 
                        onClick={() => { setSelectedScanner(scanner); setIsDeleteOpen(true); }}
                        className="text-red-500/70 hover:text-red-500 transition-colors"
                        title="Delete Account"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {scanners.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-admin-muted">
                      No scanner accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Scanner Account">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-admin-muted">Assigned Volunteer Name</label>
            <input 
              type="text" 
              required
              value={volunteerName}
              onChange={(e) => setVolunteerName(e.target.value)}
              className="w-full bg-admin-bg border border-admin-border rounded-lg py-2 px-4 focus:outline-none focus:border-admin-accent transition-colors"
              placeholder="e.g. John Doe"
            />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 rounded-lg text-admin-muted hover:text-white">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-admin-accent text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500">
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Scanner Account">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
            <ShieldAlert size={24} />
            <p className="text-sm">Are you sure you want to delete the account for <strong>{selectedScanner?.volunteerName}</strong>? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 rounded-lg text-admin-muted hover:text-white">Cancel</button>
            <button onClick={handleDelete} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600">
              Delete Account
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
