import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { CareerPath } from '../types';
import { 
  Settings, User, Lock, Trash2, CheckCircle2, 
  AlertTriangle, Shield, RefreshCw, Key, Save
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Profile Form
  const [name, setName] = useState<string>(user?.name || '');
  const [academicYear, setAcademicYear] = useState<string>('3rd Year Engineering');
  const [educationBackground, setEducationBackground] = useState<string>('B.Tech in Computer Science');
  const [primaryGoal, setPrimaryGoal] = useState<string>('ai-ml-engineer');
  const [profileSaving, setProfileSaving] = useState<boolean>(false);
  const [profileSuccess, setProfileSuccess] = useState<boolean>(false);

  // Password Form
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordSaving, setPasswordSaving] = useState<boolean>(false);
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Delete Account Form
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    const init = async () => {
      try {
        const [careersData, twinData] = await Promise.all([
          api.getCareers(),
          api.getTwin()
        ]);
        setCareers(careersData);
        if (twinData) {
          setName(twinData.name || user?.name || '');
          setAcademicYear(twinData.academic_year || '3rd Year Engineering');
          setEducationBackground(twinData.education_background || 'B.Tech Computer Science');
          if (twinData.career_goals && twinData.career_goals.length > 0) {
            setPrimaryGoal(twinData.career_goals[0]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess(false);

    try {
      await api.updateProfile({
        name,
        academic_year: academicYear,
        education_background: educationBackground,
        career_goals: [primaryGoal]
      });
      await refreshUser();
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3500);
    } catch (err: any) {
      console.error(err);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      await api.changePassword(oldPassword, newPassword);
      setPasswordSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3500);
    } catch (err: any) {
      setPasswordError(err.response?.data?.detail || 'Failed to update password. Please check your current password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleting(true);
    try {
      await api.deleteAccount();
      logout();
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 text-primary-600 animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-surface-border">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 mb-1">
          <Settings className="w-4 h-4" />
          <span>Account & Security Settings</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings & Preferences</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your account credentials, digital twin profile alignment, and security settings.
        </p>
      </div>

      {/* Profile & Career Targets Section */}
      <div className="p-6 rounded-xl bg-white border border-surface-border shadow-subtle space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Profile & Educational Background</h2>
              <p className="text-xs text-slate-500">Your persona attributes and target career direction</p>
            </div>
          </div>

          {profileSuccess && (
            <span className="text-xs font-medium text-emerald-700 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Changes Saved
            </span>
          )}
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Academic Standing / Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="1st Year Undergraduate">1st Year Undergraduate</option>
                <option value="2nd Year Undergraduate">2nd Year Undergraduate</option>
                <option value="3rd Year Undergraduate">3rd Year Undergraduate</option>
                <option value="Final Year / Graduating">Final Year / Graduating</option>
                <option value="Recent Graduate">Recent Graduate</option>
                <option value="Early Career Professional">Early Career Professional</option>
                <option value="Career Transitioner">Career Transitioner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Degree / Education Field</label>
              <input
                type="text"
                value={educationBackground}
                onChange={(e) => setEducationBackground(e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Primary Target Career Track</label>
            <select
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {careers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} — {c.category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-subtle transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {profileSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Profile Updates</span>
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="p-6 rounded-xl bg-white border border-surface-border shadow-subtle space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Change Password</h2>
              <p className="text-xs text-slate-500">Ensure your account uses a strong, unique password</p>
            </div>
          </div>

          {passwordSuccess && (
            <span className="text-xs font-medium text-emerald-700 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Password Changed
            </span>
          )}
        </div>

        {passwordError && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {passwordError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="At least 8 characters"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordSaving}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white shadow-subtle transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {passwordSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Key className="w-3.5 h-3.5" />}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-xl bg-white border border-rose-200 shadow-subtle space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-rose-100">
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
            <Trash2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-rose-900">Danger Zone</h2>
            <p className="text-xs text-slate-500">Permanently delete your account and digital twin data</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
            Deleting your account will erase your profile, recorded competencies, learning roadmap, and evolution timeline. This action cannot be reversed.
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors shrink-0"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-xl bg-white border border-rose-200 shadow-elevation space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Account Deletion</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This action is immediate and irrevocable. All your digital career twin data, simulations, and progress will be erased.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Type <strong className="text-rose-600">DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || deleting}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-subtle disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

