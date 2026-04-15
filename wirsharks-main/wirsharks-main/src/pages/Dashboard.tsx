import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Trophy, Star, Flame, BookOpen, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-sleek-muted">Loading dashboard...</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center text-sleek-muted">Please sign in to view your dashboard.</div>;
  }

  const nextLevelXp = profile.level * 1000;
  const progressPercent = (profile.xp / nextLevelXp) * 100;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 flex-1">
        
        {/* Main Section */}
        <div className="flex flex-col gap-6">
          
          {/* Hero Card */}
          <div className="bg-gradient-to-br from-sleek-purple/10 to-sleek-cyan/5 border border-sleek-border rounded-3xl p-8 relative overflow-hidden">
            <h2 className="text-3xl font-bold mb-2">Welcome back, {profile.name}!</h2>
            <p className="text-sleek-muted max-w-md leading-relaxed mb-6">
              Ready to continue your AI journey? Dive back into your modules or try a new simulation.
            </p>
            <Link to="/modules" className="inline-block bg-sleek-purple text-white px-6 py-3 rounded-xl font-semibold hover:bg-sleek-purple/90 transition-colors">
              Continue Learning
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-sleek-card border border-sleek-border rounded-2xl p-5">
              <div className="text-xs text-sleek-muted uppercase tracking-widest mb-2">Modules Done</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sleek-cyan" />
                {Object.keys(profile.progress).length}
              </div>
            </div>
            <div className="bg-sleek-card border border-sleek-border rounded-2xl p-5">
              <div className="text-xs text-sleek-muted uppercase tracking-widest mb-2">Badges</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-sleek-green" />
                {profile.badges.length}
              </div>
            </div>
            <div className="bg-sleek-card border border-sleek-border rounded-2xl p-5">
              <div className="text-xs text-sleek-muted uppercase tracking-widest mb-2">Current XP</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Star className="w-5 h-5 text-sleek-purple" />
                {profile.xp}
              </div>
            </div>
          </div>

          {/* Recommended Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Train the Model: Linear Regression", type: "Game", xp: 200, path: "/games", color: "sleek-cyan" },
              { title: "Build a Spam Classifier", type: "Simulation", xp: 300, path: "/simulations", color: "sleek-purple" }
            ].map((item, i) => (
              <Link 
                key={i}
                to={item.path}
                className="bg-sleek-card border border-sleek-border rounded-2xl p-5 flex flex-col gap-3 hover:border-sleek-purple/50 transition-colors"
              >
                <div className={`text-[10px] bg-white/5 px-2 py-1 rounded self-start text-${item.color} uppercase tracking-wider font-bold`}>
                  {item.type}
                </div>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-xs text-sleek-muted mt-auto">Earn +{item.xp} XP upon completion.</p>
                <div className="h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full w-0 bg-${item.color}`}></div>
                </div>
              </Link>
            ))}
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">
          
          {/* Progress Card */}
          <div className="bg-sleek-card border border-sleek-border rounded-3xl p-6 flex flex-col items-center text-center">
            <div className="text-xs text-sleek-muted uppercase tracking-widest mb-4">Level Progress</div>
            
            <div className="w-32 h-32 rounded-full border-[10px] border-white/5 border-t-sleek-cyan flex items-center justify-center text-3xl font-extrabold mb-4 relative">
              {profile.level}
              <div className="absolute -bottom-2 bg-sleek-bg px-2 text-xs text-sleek-muted font-normal">LVL</div>
            </div>
            
            <p className="text-sm text-sleek-muted">
              Next Level: {nextLevelXp} XP<br/>
              <strong className="text-sleek-text">{(nextLevelXp - profile.xp)} XP to go</strong>
            </p>
          </div>

          {/* Recent Badges */}
          <div className="bg-sleek-card border border-sleek-border rounded-3xl p-6 flex-1">
            <div className="text-sm font-semibold mb-4">Recent Badges</div>
            {profile.badges.length > 0 ? (
              <div className="flex flex-col gap-3">
                {profile.badges.map((badge, i) => (
                  <div key={i} className="flex justify-between items-center pb-3 border-b border-sleek-border last:border-0">
                    <span className="text-sm text-sleek-muted flex items-center gap-2">
                      <Star className="w-4 h-4 text-sleek-purple" />
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-sleek-muted text-sm">
                Complete modules to earn badges!
              </div>
            )}
          </div>

          {/* Mentor Widget */}
          <div className="bg-sleek-purple rounded-2xl p-4 flex items-center gap-3 text-sm font-medium text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <div className="text-2xl">🤖</div>
            <div>
              <strong>Ask Mentor:</strong> "How do I avoid overfitting?"
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
