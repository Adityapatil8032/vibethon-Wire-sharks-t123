import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

interface UserProfile {
  name: string;
  email: string;
  xp: number;
  level: number;
  badges: string[];
  progress: Record<string, number>;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  addXP: (amount: number) => Promise<void>;
  updateProgress: (moduleId: string, percent: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null, 
  loading: true,
  addXP: async () => {},
  updateProgress: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              name: currentUser.displayName || 'New User',
              email: currentUser.email || '',
              xp: 0,
              level: 1,
              badges: [],
              progress: {},
              role: 'user'
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addXP = async (amount: number) => {
    if (!user || !profile) return;
    
    const newXp = profile.xp + amount;
    const newLevel = Math.floor(newXp / 500) + 1; // Level up every 500 XP
    
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        xp: increment(amount),
        level: newLevel
      });
      
      setProfile(prev => prev ? { ...prev, xp: newXp, level: newLevel } : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const updateProgress = async (moduleId: string, percent: number) => {
    if (!user || !profile) return;
    
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        [`progress.${moduleId}`]: percent
      });
      
      setProfile(prev => prev ? { 
        ...prev, 
        progress: { ...prev.progress, [moduleId]: percent } 
      } : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, addXP, updateProgress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
