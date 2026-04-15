import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Lock, PlayCircle, BrainCircuit, Network, MessageSquareText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MODULES = [
  {
    id: 'intro-ai',
    title: 'Introduction to AI',
    description: 'Learn the basic concepts of Artificial Intelligence and its history.',
    icon: BrainCircuit,
    difficulty: 'Beginner',
    xp: 100,
    lessons: 4
  },
  {
    id: 'ml-basics',
    title: 'Machine Learning Basics',
    description: 'Understand how machines learn from data without explicit programming.',
    icon: BookOpen,
    difficulty: 'Beginner',
    xp: 150,
    lessons: 5
  },
  {
    id: 'neural-networks',
    title: 'Neural Networks',
    description: 'Dive into deep learning and the architecture of artificial brains.',
    icon: Network,
    difficulty: 'Intermediate',
    xp: 250,
    lessons: 6
  },
  {
    id: 'nlp-basics',
    title: 'Natural Language Processing',
    description: 'How computers understand, interpret, and manipulate human language.',
    icon: MessageSquareText,
    difficulty: 'Advanced',
    xp: 300,
    lessons: 5
  }
];

export default function Modules() {
  const { profile } = useAuth();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Learning Modules</h1>
        <p className="text-sleek-muted max-w-2xl mx-auto">
          Master AI concepts step-by-step. Complete modules to earn XP and unlock advanced topics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MODULES.map((mod, index) => {
          const isCompleted = profile?.progress?.[mod.id] === 100;
          const isLocked = index > 0 && !profile?.progress?.[MODULES[index - 1].id]; // Simple locking logic

          return (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-3xl border ${
                isCompleted ? 'border-sleek-green/50 bg-sleek-green/5' : 
                isLocked ? 'border-sleek-border bg-sleek-card/50 opacity-75' : 
                'border-sleek-border bg-sleek-card hover:border-sleek-purple/50'
              } p-8 transition-all`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  isCompleted ? 'bg-sleek-green/20 text-sleek-green' :
                  isLocked ? 'bg-black/20 text-sleek-muted' :
                  'bg-sleek-purple/20 text-sleek-purple'
                }`}>
                  <mod.icon className="w-7 h-7" />
                </div>
                {isCompleted ? (
                  <div className="flex items-center text-sleek-green text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Completed
                  </div>
                ) : isLocked ? (
                  <div className="flex items-center text-sleek-muted text-sm font-medium">
                    <Lock className="w-4 h-4 mr-1" />
                    Locked
                  </div>
                ) : (
                  <div className="text-sleek-cyan text-sm font-bold">
                    +{mod.xp} XP
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{mod.title}</h3>
              <p className="text-sleek-muted text-sm mb-6 line-clamp-2">{mod.description}</p>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex space-x-4 text-xs font-medium text-sleek-muted">
                  <span className="bg-black/20 px-3 py-1.5 rounded-lg border border-sleek-border uppercase tracking-wider">{mod.difficulty}</span>
                  <span className="bg-black/20 px-3 py-1.5 rounded-lg border border-sleek-border uppercase tracking-wider">{mod.lessons} Lessons</span>
                </div>
                
                {!isLocked && !isCompleted && (
                  <button className="flex items-center space-x-2 text-sm font-bold text-white bg-sleek-purple hover:bg-sleek-purple/80 px-5 py-2.5 rounded-xl transition-colors">
                    <PlayCircle className="w-4 h-4" />
                    <span>Start</span>
                  </button>
                )}
                {isCompleted && (
                  <button className="flex items-center space-x-2 text-sm font-bold text-sleek-text hover:text-white bg-sleek-card border border-sleek-border hover:bg-sleek-card/80 px-5 py-2.5 rounded-xl transition-colors">
                    <span>Review</span>
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
