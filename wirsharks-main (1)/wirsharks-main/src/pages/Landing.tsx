import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Code, Gamepad2, Sparkles, ChevronRight, Zap, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sleek-purple/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-sleek-cyan/20 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-sleek-card border border-sleek-border rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-sleek-cyan" />
            <span className="text-sm font-medium text-sleek-muted">The new way to learn AI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-sleek-text to-sleek-cyan"
          >
            Learn AI by Playing.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-sleek-muted mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Master Artificial Intelligence and Machine Learning through interactive mini-games, hands-on coding, and real-world simulations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link
              to={user ? "/dashboard" : "/modules"}
              className="w-full sm:w-auto bg-sleek-purple hover:bg-sleek-purple/80 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center space-x-2 shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)]"
            >
              <span>Start Learning</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/games"
              className="w-full sm:w-auto bg-sleek-card hover:bg-sleek-card/80 border border-sleek-border text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center space-x-2"
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Explore Games</span>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Brain,
              title: "Structured Modules",
              description: "Bite-sized lessons covering everything from basic ML to advanced Neural Networks.",
              color: "text-sleek-cyan",
              bg: "bg-sleek-cyan/10"
            },
            {
              icon: Gamepad2,
              title: "Gamified Learning",
              description: "Earn XP, level up, and collect badges as you complete interactive challenges.",
              color: "text-sleek-purple",
              bg: "bg-sleek-purple/10"
            },
            {
              icon: Code,
              title: "Live Coding",
              description: "Write and run Python code directly in your browser with AI-powered assistance.",
              color: "text-sleek-green",
              bg: "bg-sleek-green/10"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-sleek-card border border-sleek-border rounded-3xl p-8 hover:border-sleek-purple/50 transition-colors"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-sleek-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
