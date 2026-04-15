import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import AuthModal from './AuthModal';
import { Brain, LayoutDashboard, BookOpen, Code, Gamepad2, FlaskConical, Settings, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, requiresAuth: true },
    { name: 'Modules', path: '/modules', icon: BookOpen, requiresAuth: false },
    { name: 'Playground', path: '/playground', icon: Code, requiresAuth: false },
    { name: 'Games', path: '/games', icon: Gamepad2, requiresAuth: false },
    { name: 'Simulations', path: '/simulations', icon: FlaskConical, requiresAuth: false },
  ];

  if (profile?.role === 'admin') {
    navItems.push({ name: 'Admin', path: '/admin', icon: Settings, requiresAuth: true });
  }

  return (
    <div className="min-h-screen flex bg-transparent text-sleek-text font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-20 flex-col items-center py-8 border-r border-sleek-border bg-black/20 gap-10 shrink-0">
        <Link to="/" className="text-sleek-cyan hover:text-sleek-purple transition-colors">
          <Brain className="w-8 h-8" />
        </Link>
        <nav className="flex flex-col gap-6">
          {navItems.map((item) => {
            if (item.requiresAuth && !user) return null;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.name}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-sleek-purple text-white border border-sleek-purple shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
                    : 'bg-sleek-card border border-sleek-border text-sleek-muted hover:text-white hover:border-sleek-purple/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto">
          {user ? (
            <button
              onClick={handleLogout}
              className="w-11 h-11 rounded-xl flex items-center justify-center bg-sleek-card border border-sleek-border text-sleek-muted hover:text-red-400 hover:border-red-400/50 transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-11 h-11 rounded-xl flex items-center justify-center bg-sleek-card border border-sleek-border text-sleek-muted hover:text-sleek-cyan hover:border-sleek-cyan/50 transition-all"
              title="Sign In"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Layout Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-50 w-full border-b border-sleek-border bg-sleek-bg/80 backdrop-blur">
          <div className="px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 text-sleek-cyan">
              <Brain className="w-8 h-8" />
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-sleek-cyan bg-clip-text text-transparent">AIML PlayLab</span>
            </Link>
            <button
              className="p-2 text-sleek-muted hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex justify-between items-center p-6 shrink-0">
          <div className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-sleek-cyan bg-clip-text text-transparent">
            🧠 AIML PlayLab
          </div>
          {user ? (
            <div className="flex items-center gap-3 bg-sleek-card px-4 py-1.5 rounded-full border border-sleek-border">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sleek-purple to-sleek-cyan flex items-center justify-center text-xs font-bold text-white">
                {profile?.name?.charAt(0) || 'U'}
              </div>
              <div className="text-sm font-semibold text-white">
                {profile?.name || 'User'} <span className="text-sleek-purple ml-2">LVL {profile?.level || 1}</span>
              </div>
            </div>
          ) : (
             <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-sleek-purple hover:bg-sleek-purple/80 text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors"
              >
                Sign In
              </button>
          )}
        </header>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-sleek-border bg-sleek-bg/95 backdrop-blur absolute top-16 left-0 right-0 z-40"
            >
              <div className="px-4 py-4 flex flex-col space-y-4">
                {navItems.map((item) => {
                  if (item.requiresAuth && !user) return null;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-2 text-sm font-medium p-2 rounded-xl ${
                        isActive ? 'bg-sleek-purple/20 text-sleek-purple' : 'text-sleek-muted hover:bg-sleek-card hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                {user ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-sm font-medium p-2 text-red-400 hover:bg-red-500/10 rounded-xl"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-sleek-purple hover:bg-sleek-purple/80 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
