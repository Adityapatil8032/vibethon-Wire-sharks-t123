import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowRightLeft, GitMerge, Network, Play, Trophy } from 'lucide-react';

const GAMES = [
  {
    id: 'train-model',
    title: 'Train the Model',
    description: 'Adjust weights and biases to fit a line to data points.',
    icon: Target,
    color: 'text-sleek-cyan',
    bg: 'bg-sleek-cyan/10',
    xp: 200
  },
  {
    id: 'data-sort',
    title: 'Data Sort Challenge',
    description: 'Quickly categorize data points into the correct classes.',
    icon: ArrowRightLeft,
    color: 'text-sleek-green',
    bg: 'bg-sleek-green/10',
    xp: 150
  },
  {
    id: 'decision-tree',
    title: 'Decision Tree Builder',
    description: 'Build a logical tree to classify animals based on features.',
    icon: GitMerge,
    color: 'text-sleek-purple',
    bg: 'bg-sleek-purple/10',
    xp: 250
  },
  {
    id: 'nn-sim',
    title: 'Neural Net Simulator',
    description: 'Connect nodes and activate layers to solve complex problems.',
    icon: Network,
    color: 'text-sleek-cyan',
    bg: 'bg-sleek-cyan/10',
    xp: 300
  }
];

export default function Games() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Mini-Games</h1>
        <p className="text-sleek-muted max-w-2xl mx-auto">
          Learn AI concepts through interactive, gamified challenges. Earn high scores to climb the leaderboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {GAMES.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-3xl bg-sleek-card border border-sleek-border hover:border-sleek-purple/50 transition-all"
          >
            {/* Decorative background gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full ${game.bg} opacity-50 group-hover:scale-110 transition-transform duration-500`} />
            
            <div className="p-8 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-16 h-16 rounded-2xl ${game.bg} flex items-center justify-center border border-white/5`}>
                  <game.icon className={`w-8 h-8 ${game.color}`} />
                </div>
                <div className="flex items-center space-x-1 bg-black/20 px-3 py-1.5 rounded-full border border-sleek-border">
                  <Trophy className="w-4 h-4 text-sleek-green" />
                  <span className="text-sm font-bold text-white">{game.xp} XP</span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">{game.title}</h3>
              <p className="text-sleek-muted mb-8 line-clamp-2">{game.description}</p>

              <button className="w-full flex items-center justify-center space-x-2 bg-sleek-card border border-sleek-border hover:bg-sleek-purple text-white py-3 rounded-xl font-bold transition-colors group-hover:shadow-lg group-hover:shadow-sleek-purple/25">
                <Play className="w-5 h-5 fill-current" />
                <span>Play Now</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
