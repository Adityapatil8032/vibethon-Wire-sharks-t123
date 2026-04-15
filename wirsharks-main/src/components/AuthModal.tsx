import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-sleek-bg/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-sleek-card border border-sleek-border rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-sleek-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Welcome to PlayLab</h2>
            <p className="text-sleek-muted text-center mb-8">Sign in to save your progress and earn XP.</p>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center space-x-2 bg-white text-black hover:bg-slate-200 px-4 py-3 rounded-xl font-medium transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
            
            <div className="mt-8 text-center text-xs text-sleek-muted">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
