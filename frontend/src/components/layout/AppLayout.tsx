import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, UserCircle, Compass, Target, Cpu, 
  MessageSquareCode, Map, History, Settings, LogOut, 
  Menu, X, Sparkles, ChevronRight, Shield, Bell
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Digital Twin', path: '/twin', icon: UserCircle },
    { name: 'Career Explorer', path: '/careers', icon: Compass },
    { name: 'Skill Gap Analysis', path: '/gaps', icon: Target },
    { name: 'Simulation Lab', path: '/simulation', icon: Cpu },
    { name: 'AI Career Mentor', path: '/mentor', icon: MessageSquareCode },
    { name: 'Learning Roadmap', path: '/roadmap', icon: Map },
    { name: 'Twin Evolution', path: '/evolution', icon: History },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-surface border-r border-surface-border fixed inset-y-0 z-30">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-surface-border">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-subtle group-hover:bg-primary-700 transition-colors">
              CT
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-slate-900 tracking-tight flex items-center gap-1">
                CareerTwin <span className="text-primary-600 font-bold">AI</span>
              </span>
              <span className="text-[10px] text-slate-600 font-medium tracking-wide uppercase">
                Career Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            Platform
          </div>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-surface-subtle'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-slate-600'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />}
              </Link>
            );
          })}
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-surface-border bg-surface space-y-2">
          <Link
            to="/settings"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              location.pathname === '/settings'
                ? 'bg-primary-50 text-primary-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-surface-subtle'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span>Settings & Security</span>
          </Link>

          <div className="pt-2 border-t border-surface-border flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
                <p className="text-[11px] text-slate-600 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-600 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-surface flex flex-col z-10 border-r border-surface-border shadow-elevation">
            <div className="h-16 flex items-center justify-between px-6 border-b border-surface-border">
              <span className="font-semibold text-sm text-slate-900">CareerTwin AI</span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 text-slate-600 hover:text-slate-900 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium ${
                      isActive ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-600 hover:bg-surface-subtle'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <Link
                to="/settings"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-surface-subtle"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </div>

            <div className="p-4 border-t border-surface-border">
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header Bar */}
        <header className="lg:hidden h-14 bg-surface border-b border-surface-border flex items-center justify-between px-4 sticky top-0 z-20">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-xs text-slate-900">CareerTwin AI</span>
          <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
            {getInitials(user?.name)}
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

