import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, User } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

interface LeaderboardUser {
  id: string;
  name: string;
  xp: number;
  level: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(50));
        const querySnapshot = await getDocs(q);
        const fetchedUsers: LeaderboardUser[] = [];
        querySnapshot.forEach((doc) => {
          fetchedUsers.push({ id: doc.id, ...doc.data() } as LeaderboardUser);
        });
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-sleek-purple/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-sleek-purple/50"
        >
          <Trophy className="w-10 h-10 text-sleek-purple" />
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-4">Global Leaderboard</h1>
        <p className="text-sleek-muted">Top learners ranked by XP. Complete modules and games to climb the ranks!</p>
      </div>

      <div className="bg-sleek-card border border-sleek-border rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-sleek-muted">Loading leaderboard...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-sleek-muted">No users found yet. Be the first to earn XP!</div>
        ) : (
          <div className="divide-y divide-sleek-border">
            {users.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center p-6 hover:bg-white/5 transition-colors"
              >
                <div className="w-12 text-center font-bold text-xl text-sleek-muted">
                  {index === 0 ? <Medal className="w-8 h-8 text-yellow-400 mx-auto" /> : 
                   index === 1 ? <Medal className="w-8 h-8 text-slate-300 mx-auto" /> : 
                   index === 2 ? <Medal className="w-8 h-8 text-amber-600 mx-auto" /> : 
                   `#${index + 1}`}
                </div>
                
                <div className="w-12 h-12 bg-gradient-to-tr from-sleek-purple to-sleek-cyan rounded-full flex items-center justify-center text-white font-bold text-lg mx-4 shrink-0">
                  {user.name?.charAt(0) || 'U'}
                </div>
                
                <div className="flex-1">
                  <div className="font-bold text-white text-lg">{user.name || 'Anonymous User'}</div>
                  <div className="text-sm text-sleek-purple font-semibold">Level {user.level || 1}</div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sleek-cyan font-mono font-bold text-xl">
                    <span>{user.xp || 0}</span>
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-xs text-sleek-muted uppercase tracking-wider">Total XP</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
