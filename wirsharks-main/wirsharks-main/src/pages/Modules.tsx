import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle2, Lock, PlayCircle, BrainCircuit, Network, MessageSquareText, X, ArrowRight, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MODULES = [
  {
    id: 'intro-ai',
    title: 'Introduction to AI',
    description: 'Learn the basic concepts of Artificial Intelligence and its history.',
    icon: BrainCircuit,
    difficulty: 'Beginner',
    xp: 100,
    lessons: 3,
    content: [
      { title: "What is AI?", text: "Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems." },
      { title: "Brief History", text: "The term 'Artificial Intelligence' was coined in 1956 at Dartmouth College. Since then, it has experienced waves of optimism and 'AI winters'." },
      { title: "Narrow vs General AI", text: "Today's AI is 'Narrow AI' (good at specific tasks). 'General AI' (human-level intelligence across all tasks) does not yet exist." }
    ],
    quiz: {
      question: "Which type of AI currently exists today?",
      options: ["General AI", "Narrow AI", "Super AI", "Biological AI"],
      correctAnswer: 1
    }
  },
  {
    id: 'ml-basics',
    title: 'Machine Learning Basics',
    description: 'Understand how machines learn from data without explicit programming.',
    icon: BookOpen,
    difficulty: 'Beginner',
    xp: 150,
    lessons: 3,
    content: [
      { title: "What is ML?", text: "Machine Learning is a subset of AI that uses statistical techniques to give computers the ability to 'learn' from data." },
      { title: "Supervised Learning", text: "The model is trained on labeled data. For example, showing a computer 1,000 pictures of cats labeled 'cat' so it learns to recognize them." },
      { title: "Unsupervised Learning", text: "The model is given unlabeled data and must find patterns and groupings on its own." }
    ],
    quiz: {
      question: "In Supervised Learning, the training data is:",
      options: ["Unlabeled", "Random", "Labeled", "Deleted"],
      correctAnswer: 2
    }
  },
  {
    id: 'neural-networks',
    title: 'Neural Networks',
    description: 'Dive into deep learning and the architecture of artificial brains.',
    icon: Network,
    difficulty: 'Intermediate',
    xp: 250,
    lessons: 3,
    content: [
      { title: "Biological Inspiration", text: "Artificial Neural Networks are loosely inspired by the biological neural networks that constitute animal brains." },
      { title: "Layers", text: "Networks consist of an input layer, hidden layers, and an output layer. 'Deep' learning refers to having many hidden layers." },
      { title: "Weights & Biases", text: "During training, the network adjusts the 'weights' and 'biases' of its connections to minimize errors in its predictions." }
    ],
    quiz: {
      question: "What does 'Deep' refer to in Deep Learning?",
      options: ["Deep thoughts", "Many hidden layers", "Deep sea data", "Complex math"],
      correctAnswer: 1
    }
  },
  {
    id: 'nlp-basics',
    title: 'Natural Language Processing',
    description: 'How computers understand, interpret, and manipulate human language.',
    icon: MessageSquareText,
    difficulty: 'Advanced',
    xp: 300,
    lessons: 3,
    content: [
      { title: "What is NLP?", text: "NLP is a field of AI that gives machines the ability to read, understand, and derive meaning from human languages." },
      { title: "Tokenization", text: "The process of breaking text down into smaller pieces (tokens), such as words or subwords, so the computer can process them." },
      { title: "Transformers", text: "A modern neural network architecture (like GPT) that excels at understanding context in sequences of text." }
    ],
    quiz: {
      question: "What is the process of breaking text into smaller pieces called?",
      options: ["Shattering", "Tokenization", "Parsing", "Splitting"],
      correctAnswer: 1
    }
  }
];

export default function Modules() {
  const { profile, updateProgress, addXP } = useAuth();
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<'correct' | 'incorrect' | null>(null);

  const activeModule = MODULES.find(m => m.id === activeModuleId);

  const handleComplete = async () => {
    if (activeModule) {
      if (profile?.progress?.[activeModule.id] !== 100) {
        await updateProgress(activeModule.id, 100);
        await addXP(activeModule.xp);
      }
      setActiveModuleId(null);
      setCurrentLesson(0);
      setShowQuiz(false);
      setSelectedAnswer(null);
      setQuizResult(null);
    }
  };

  const handleQuizAnswer = (index: number) => {
    if (quizResult !== null) return;
    setSelectedAnswer(index);
    if (activeModule && index === activeModule.quiz.correctAnswer) {
      setQuizResult('correct');
    } else {
      setQuizResult('incorrect');
    }
  };

  if (activeModule) {
    const lesson = activeModule.content[currentLesson];
    const isLastLesson = currentLesson === activeModule.content.length - 1;

    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <button 
          onClick={() => { setActiveModuleId(null); setCurrentLesson(0); setShowQuiz(false); setSelectedAnswer(null); setQuizResult(null); }}
          className="text-sleek-muted hover:text-white mb-8 flex items-center transition-colors"
        >
          <X className="w-5 h-5 mr-2" /> Back to Modules
        </button>

        <div className="bg-sleek-card border border-sleek-border rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-sleek-border">
            <motion.div 
              className="h-full bg-sleek-purple"
              initial={{ width: 0 }}
              animate={{ width: showQuiz ? '100%' : `${((currentLesson + 1) / activeModule.content.length) * 100}%` }}
            />
          </div>

          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-sleek-purple/20 text-sleek-purple flex items-center justify-center">
              <activeModule.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{activeModule.title}</h2>
              <p className="text-sleek-muted">{showQuiz ? 'Final Quiz' : `Lesson ${currentLesson + 1} of ${activeModule.content.length}`}</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!showQuiz ? (
              <motion.div
                key={`lesson-${currentLesson}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="min-h-[200px]"
              >
                <h3 className="text-3xl font-bold text-white mb-6">{lesson.title}</h3>
                <p className="text-lg text-sleek-muted leading-relaxed">{lesson.text}</p>
              </motion.div>
            ) : (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="min-h-[200px]"
              >
                <h3 className="text-2xl font-bold text-white mb-6">{activeModule.quiz.question}</h3>
                <div className="space-y-3">
                  {activeModule.quiz.options.map((option, index) => {
                    let buttonClass = "w-full text-left p-4 rounded-xl border transition-all ";
                    if (selectedAnswer === null) {
                      buttonClass += "bg-black/40 border-sleek-border hover:border-sleek-purple hover:bg-sleek-purple/10 text-white";
                    } else if (index === activeModule.quiz.correctAnswer) {
                      buttonClass += "bg-sleek-green/20 border-sleek-green text-sleek-green font-bold";
                    } else if (index === selectedAnswer) {
                      buttonClass += "bg-red-500/20 border-red-500 text-red-400 font-bold";
                    } else {
                      buttonClass += "bg-black/40 border-sleek-border text-sleek-muted opacity-50";
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        disabled={selectedAnswer !== null}
                        className={buttonClass}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                
                {quizResult === 'correct' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-sleek-green/10 border border-sleek-green/30 rounded-xl text-sleek-green flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Correct! You've mastered this module.
                  </motion.div>
                )}
                {quizResult === 'incorrect' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                    Incorrect. The correct answer was: {activeModule.quiz.options[activeModule.quiz.correctAnswer]}.
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-end">
            {!showQuiz ? (
              !isLastLesson ? (
                <button 
                  onClick={() => setCurrentLesson(c => c + 1)}
                  className="flex items-center space-x-2 bg-sleek-purple hover:bg-sleek-purple/80 text-white px-8 py-3 rounded-xl font-bold transition-colors"
                >
                  <span>Next Lesson</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={() => setShowQuiz(true)}
                  className="flex items-center space-x-2 bg-sleek-cyan hover:bg-sleek-cyan/80 text-black px-8 py-3 rounded-xl font-bold transition-colors"
                >
                  <span>Take Quiz</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )
            ) : (
              quizResult !== null && (
                <button 
                  onClick={handleComplete}
                  className="flex items-center space-x-2 bg-sleek-green hover:bg-sleek-green/80 text-black px-8 py-3 rounded-xl font-bold transition-colors"
                >
                  <Trophy className="w-5 h-5" />
                  <span>Complete & Earn {activeModule.xp} XP</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

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
          const isLocked = index > 0 && !profile?.progress?.[MODULES[index - 1].id];

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
                  <button 
                    onClick={() => setActiveModuleId(mod.id)}
                    className="flex items-center space-x-2 text-sm font-bold text-white bg-sleek-purple hover:bg-sleek-purple/80 px-5 py-2.5 rounded-xl transition-colors"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Start</span>
                  </button>
                )}
                {isCompleted && (
                  <button 
                    onClick={() => setActiveModuleId(mod.id)}
                    className="flex items-center space-x-2 text-sm font-bold text-sleek-text hover:text-white bg-sleek-card border border-sleek-border hover:bg-sleek-card/80 px-5 py-2.5 rounded-xl transition-colors"
                  >
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
