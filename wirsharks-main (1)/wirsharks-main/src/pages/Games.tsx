import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ArrowRightLeft, GitMerge, Network, Play, Trophy, X, Check, AlertCircle, RefreshCw, Terminal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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

const DATA_POINTS = [
  { text: "Congratulations! You've won a $1000 gift card. Click here to claim.", type: "spam" },
  { text: "Hey, are we still on for the meeting at 3 PM tomorrow?", type: "ham" },
  { text: "URGENT: Your account has been compromised. Verify your details immediately.", type: "spam" },
  { text: "Can you please review the attached project proposal when you have a chance?", type: "ham" },
  { text: "Enlarge your audience by 500% with our new marketing tool! Buy now!", type: "spam" },
  { text: "Thanks for the birthday wishes, everyone! Had a great day.", type: "ham" },
  { text: "You have been selected for a free vacation to the Bahamas. Reply YES to accept.", type: "spam" },
  { text: "Don't forget to pick up milk on your way home.", type: "ham" },
  { text: "Make $5000 a week working from home! No experience needed.", type: "spam" },
  { text: "The latest code changes have been merged into the main branch.", type: "ham" }
];

function CodePanel({ title, explanation, code }: { title: string, explanation: string, code: string }) {
  const highlightedCode = code.split('\n').map((line, i) => {
    if (line.trim().startsWith('#')) {
      return <span key={i} className="text-sleek-muted">{line}{'\n'}</span>;
    }
    return <span key={i}>{line}{'\n'}</span>;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#0d1117] border border-sleek-border rounded-3xl p-8 h-full flex flex-col shadow-2xl"
    >
      <div className="flex items-center space-x-3 mb-6">
        <Terminal className="w-6 h-6 text-sleek-cyan" />
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      <p className="text-sleek-muted mb-6 text-lg leading-relaxed">{explanation}</p>
      <div className="bg-black/60 rounded-2xl p-6 overflow-x-auto border border-white/5 flex-grow shadow-inner">
        <pre className="text-sm font-mono text-sleek-cyan leading-relaxed">
          <code>{highlightedCode}</code>
        </pre>
      </div>
    </motion.div>
  );
}

function DataSortGame({ onBack }: { onBack: () => void }) {
  const { addXP } = useAuth();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [hasWon, setHasWon] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const currentItem = DATA_POINTS[currentIndex];
  const isWin = score === DATA_POINTS.length * 10;

  useEffect(() => {
    if (isWin && !hasWon) {
      setHasWon(true);
      addXP(150);
    }
  }, [isWin, hasWon, addXP]);

  const handleSort = (guess: 'spam' | 'ham') => {
    if (gameOver) return;

    const isCorrect = guess === currentItem.type;

    if (isCorrect) {
      setScore(s => s + 10);
      setFeedback('correct');
    } else {
      setLives(l => l - 1);
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      if (lives <= 1 && !isCorrect) {
        setGameOver(true);
      } else if (currentIndex < DATA_POINTS.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setGameOver(true);
      }
    }, 800);
  };

  const codeSnippet = `from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

# 1. Training data
texts = ["Win a $1000 gift card", "Meeting at 3 PM"]
labels = ["spam", "ham"]

# 2. Convert text to numbers (vectors)
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(texts)

# 3. Train the model
model = MultinomialNB()
model.fit(X, labels)

# 4. Predict new message
new_msg = vectorizer.transform(["Make $5000 a week!"])
prediction = model.predict(new_msg)

print(prediction) 
# Output: ['spam']`;

  return (
    <div className={`container mx-auto px-4 py-12 ${showCode ? 'max-w-7xl' : 'max-w-4xl'} transition-all duration-500`}>
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-sleek-muted hover:text-white flex items-center transition-colors">
          <X className="w-5 h-5 mr-2" /> Back to Games
        </button>
        <button 
          onClick={() => setShowCode(!showCode)} 
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold transition-colors ${showCode ? 'bg-sleek-cyan text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-sleek-card border border-sleek-border text-sleek-cyan hover:bg-sleek-cyan/10'}`}
        >
          <Terminal className="w-4 h-4" />
          <span>{showCode ? 'Hide Code' : 'View Code'}</span>
        </button>
      </div>

      <div className={`grid ${showCode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
        <div className="bg-sleek-card border border-sleek-border rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div className="text-xl font-bold text-white flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-sleek-green" />
              <span>Score: <span className="text-sleek-green">{score}</span></span>
            </div>
            <div className="text-sm font-bold text-sleek-muted uppercase tracking-widest">
              Message {currentIndex + 1} of {DATA_POINTS.length}
            </div>
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`w-4 h-4 rounded-full transition-colors duration-300 ${i < lives ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-slate-800'}`} />
              ))}
            </div>
          </div>

          {!gameOver ? (
            <AnimatePresence mode="wait">
              <motion.div key={currentIndex} initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.05, y: -20 }} className="mb-12">
                <div className="text-2xl text-white font-medium bg-black/40 p-10 rounded-3xl border border-sleek-border min-h-[200px] flex items-center justify-center shadow-inner">
                  "{currentItem.text}"
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-12 py-12">
              <Trophy className={`w-24 h-24 mx-auto mb-6 ${isWin ? 'text-sleek-green drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'text-sleek-muted'}`} />
              <h2 className="text-4xl font-bold text-white mb-4">{isWin ? 'Perfect Sorting!' : 'Game Over'}</h2>
              <p className="text-sleek-muted text-lg mb-8">Final Score: {score} / {DATA_POINTS.length * 10}</p>
              {isWin ? (
                <button onClick={onBack} className="bg-sleek-green hover:bg-sleek-green/90 text-black px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  Claim 150 XP
                </button>
              ) : (
                <button 
                  onClick={() => { setScore(0); setLives(3); setCurrentIndex(0); setGameOver(false); }}
                  className="bg-sleek-purple hover:bg-sleek-purple/80 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 flex items-center justify-center mx-auto space-x-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Try Again</span>
                </button>
              )}
            </motion.div>
          )}

          {!gameOver && (
            <div className="grid grid-cols-2 gap-6">
              <button onClick={() => handleSort('spam')} disabled={feedback !== null} className="group bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 text-red-400 py-8 rounded-3xl font-bold text-2xl transition-all disabled:opacity-50 flex flex-col items-center justify-center hover:-translate-y-1">
                <AlertCircle className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" /> SPAM
              </button>
              <button onClick={() => handleSort('ham')} disabled={feedback !== null} className="group bg-sleek-green/10 border border-sleek-green/30 hover:bg-sleek-green/20 hover:border-sleek-green/50 text-sleek-green py-8 rounded-3xl font-bold text-2xl transition-all disabled:opacity-50 flex flex-col items-center justify-center hover:-translate-y-1">
                <Check className="w-10 h-10 mb-3 group-hover:scale-110 transition-transform" /> NOT SPAM (HAM)
              </button>
            </div>
          )}

          <AnimatePresence>
            {feedback && (
              <motion.div initial={{ opacity: 0, scale: 0.5, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.5, rotate: 10 }} className={`absolute inset-0 flex items-center justify-center bg-sleek-bg/90 backdrop-blur-md z-10`}>
                <div className={`text-7xl font-black tracking-tighter ${feedback === 'correct' ? 'text-sleek-green drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]' : 'text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]'}`}>
                  {feedback === 'correct' ? 'CORRECT!' : 'INCORRECT!'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showCode && (
          <CodePanel 
            title="Behind the Scenes: NLP"
            explanation="In the real world, text classification uses Natural Language Processing (NLP). Algorithms like Naive Bayes convert text into numbers (vectors) and calculate the probability of a message being spam based on the words it contains."
            code={codeSnippet}
          />
        )}
      </div>
    </div>
  );
}

function TrainModelGame({ onBack }: { onBack: () => void }) {
  const { addXP } = useAuth();
  const [weight, setWeight] = useState(0);
  const [bias, setBias] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const targetW = 2;
  const targetB = 2;
  const points = [2, 4, 6, 8].map(x => ({ x, y: x * targetW + targetB }));

  const currentError = points.reduce((sum, pt) => sum + Math.abs(pt.y - (pt.x * weight + bias)), 0);
  const isWin = currentError === 0;

  useEffect(() => {
    if (isWin && !hasWon) {
      setHasWon(true);
      addXP(200);
    }
  }, [isWin, hasWon, addXP]);

  const codeSnippet = `import numpy as np
from sklearn.linear_model import LinearRegression

# X = input feature, y = target value
X = np.array([[2], [4], [6], [8]])
y = np.array([6, 10, 14, 18]) 

# The model automatically finds the best weight & bias
# using calculus (Gradient Descent) to minimize error
model = LinearRegression()
model.fit(X, y)

print(f"Weight (Slope): {model.coef_[0]:.1f}")
print(f"Bias (Intercept): {model.intercept_:.1f}")

# Output: 
# Weight (Slope): 2.0
# Bias (Intercept): 2.0`;

  return (
    <div className={`container mx-auto px-4 py-12 ${showCode ? 'max-w-7xl' : 'max-w-4xl'} transition-all duration-500`}>
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-sleek-muted hover:text-white flex items-center transition-colors">
          <X className="w-5 h-5 mr-2" /> Back to Games
        </button>
        <button 
          onClick={() => setShowCode(!showCode)} 
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold transition-colors ${showCode ? 'bg-sleek-cyan text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-sleek-card border border-sleek-border text-sleek-cyan hover:bg-sleek-cyan/10'}`}
        >
          <Terminal className="w-4 h-4" />
          <span>{showCode ? 'Hide Code' : 'View Code'}</span>
        </button>
      </div>

      <div className={`grid ${showCode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
        <div className="bg-sleek-card border border-sleek-border rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-3">Train the Model</h2>
          <p className="text-sleek-muted mb-10 text-lg">Adjust the Weight (slope) and Bias (intercept) to perfectly fit the line to the data points.</p>

          <div className="relative w-full max-w-2xl mx-auto aspect-video bg-black/60 rounded-2xl border border-sleek-border mb-10 overflow-hidden shadow-inner">
            {/* Grid Background */}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '10% 10%', opacity: 0.2 }}></div>
            
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible p-6 relative z-10">
              {/* Axes */}
              <line x1="0" y1="100" x2="100" y2="100" stroke="#475569" strokeWidth="1" />
              <line x1="0" y1="0" x2="0" y2="100" stroke="#475569" strokeWidth="1" />
              
              {/* Target Points */}
              {points.map((p, i) => (
                <motion.circle 
                  key={i} 
                  cx={p.x * 10} 
                  cy={100 - p.y * 4} 
                  r="3" 
                  fill="#06b6d4" 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"
                />
              ))}
              
              {/* Current Prediction Line */}
              <motion.line
                x1="0"
                y1={100 - bias * 4}
                x2="100"
                y2={100 - (weight * 10 + bias) * 4}
                stroke={isWin ? "#22c55e" : "#a855f7"}
                strokeWidth="2"
                className="transition-all duration-300 ease-out drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
              />
            </svg>
          </div>

          <div className="space-y-8 max-w-xl mx-auto bg-black/20 p-8 rounded-3xl border border-sleek-border">
            <div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-sleek-muted font-bold tracking-wider uppercase">Weight (Slope)</span>
                <span className="text-sleek-purple font-mono font-bold text-lg bg-sleek-purple/10 px-3 py-1 rounded-lg border border-sleek-purple/30">{weight.toFixed(1)}</span>
              </div>
              <input type="range" min="-5" max="5" step="0.5" value={weight} onChange={e => setWeight(parseFloat(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sleek-purple" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-sleek-muted font-bold tracking-wider uppercase">Bias (Intercept)</span>
                <span className="text-sleek-purple font-mono font-bold text-lg bg-sleek-purple/10 px-3 py-1 rounded-lg border border-sleek-purple/30">{bias.toFixed(1)}</span>
              </div>
              <input type="range" min="-10" max="10" step="1" value={bias} onChange={e => setBias(parseFloat(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sleek-purple" />
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center space-x-4">
            <span className="text-sleek-muted text-xl uppercase tracking-widest font-bold">Current Error:</span>
            <span className={`text-4xl font-black font-mono ${currentError === 0 ? 'text-sleek-green drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'text-red-400'}`}>
              {currentError.toFixed(1)}
            </span>
          </div>

          <AnimatePresence>
            {hasWon && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-sleek-bg/90 backdrop-blur-md flex flex-col items-center justify-center z-20 rounded-3xl">
                <motion.div initial={{ scale: 0.5, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-center">
                  <Trophy className="w-24 h-24 text-sleek-green mb-6 mx-auto drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
                  <h3 className="text-4xl font-black text-white mb-4">Model Trained!</h3>
                  <p className="text-sleek-muted text-xl mb-8">You successfully minimized the error to 0.0.</p>
                  <button onClick={onBack} className="bg-sleek-green hover:bg-sleek-green/90 text-black px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    Claim 200 XP
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showCode && (
          <CodePanel 
            title="Behind the Scenes: Linear Regression"
            explanation="You just manually performed what Machine Learning models do automatically! Linear Regression algorithms use calculus (Gradient Descent) to find the perfect weight and bias that minimizes the error."
            code={codeSnippet}
          />
        )}
      </div>
    </div>
  );
}

function NeuralNetGame({ onBack }: { onBack: () => void }) {
  const { addXP } = useAuth();
  const [w1, setW1] = useState(0);
  const [w2, setW2] = useState(0);
  const [w3, setW3] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const inputs = [3, 2, -1];
  const targetOutput = 10;
  const currentOutput = (inputs[0] * w1) + (inputs[1] * w2) + (inputs[2] * w3);
  const isWin = currentOutput === targetOutput;

  useEffect(() => {
    if (isWin && !hasWon) {
      setHasWon(true);
      addXP(300);
    }
  }, [isWin, hasWon, addXP]);

  const codeSnippet = `import numpy as np

# The inputs to our neuron
inputs = np.array([3, 2, -1])

# The weights you discovered!
weights = np.array([2, 1, -2])

# A simple artificial neuron calculates the dot product
# (3*2) + (2*1) + (-1*-2) = 6 + 2 + 2 = 10
output = np.dot(inputs, weights)

print(f"Neuron Output: {output}")
# Output: 10`;

  return (
    <div className={`container mx-auto px-4 py-12 ${showCode ? 'max-w-7xl' : 'max-w-4xl'} transition-all duration-500`}>
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-sleek-muted hover:text-white flex items-center transition-colors">
          <X className="w-5 h-5 mr-2" /> Back to Games
        </button>
        <button 
          onClick={() => setShowCode(!showCode)} 
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold transition-colors ${showCode ? 'bg-sleek-cyan text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-sleek-card border border-sleek-border text-sleek-cyan hover:bg-sleek-cyan/10'}`}
        >
          <Terminal className="w-4 h-4" />
          <span>{showCode ? 'Hide Code' : 'View Code'}</span>
        </button>
      </div>

      <div className={`grid ${showCode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
        <div className="bg-sleek-card border border-sleek-border rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-3">Neural Net Simulator</h2>
          <p className="text-sleek-muted mb-12 text-lg">Adjust the weights so the final output equals exactly <span className="text-white font-bold">{targetOutput}</span>.</p>

          <div className="flex items-center justify-center space-x-4 md:space-x-12 mb-16">
            {/* Input Nodes */}
            <div className="flex flex-col space-y-8">
              {inputs.map((val, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 text-sleek-muted text-sm font-bold uppercase tracking-widest">In {i+1}</div>
                  <div className="w-16 h-16 rounded-full bg-sleek-bg border-2 border-sleek-cyan flex items-center justify-center text-2xl font-black text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] z-10 relative">
                    {val}
                  </div>
                </div>
              ))}
            </div>

            {/* Connections & Weights */}
            <div className="flex flex-col justify-around h-64 relative">
              {/* SVG Lines connecting nodes */}
              <svg className="absolute inset-0 w-full h-full -z-10 overflow-visible" style={{ left: '-50%', width: '200%' }}>
                <line x1="0" y1="16%" x2="100%" y2="50%" stroke={w1 !== 0 ? "#a855f7" : "#334155"} strokeWidth={Math.max(1, Math.abs(w1))} className="transition-all duration-300" />
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke={w2 !== 0 ? "#a855f7" : "#334155"} strokeWidth={Math.max(1, Math.abs(w2))} className="transition-all duration-300" />
                <line x1="0" y1="84%" x2="100%" y2="50%" stroke={w3 !== 0 ? "#a855f7" : "#334155"} strokeWidth={Math.max(1, Math.abs(w3))} className="transition-all duration-300" />
              </svg>

              <div className="text-sleek-purple font-mono font-bold text-lg bg-black/80 px-4 py-2 rounded-xl border border-sleek-purple/50 backdrop-blur-sm z-10 shadow-lg">× {w1}</div>
              <div className="text-sleek-purple font-mono font-bold text-lg bg-black/80 px-4 py-2 rounded-xl border border-sleek-purple/50 backdrop-blur-sm z-10 shadow-lg">× {w2}</div>
              <div className="text-sleek-purple font-mono font-bold text-lg bg-black/80 px-4 py-2 rounded-xl border border-sleek-purple/50 backdrop-blur-sm z-10 shadow-lg">× {w3}</div>
            </div>

            {/* Output Node */}
            <div className="relative">
              <div className="absolute -right-16 top-1/2 -translate-y-1/2 text-sleek-muted text-sm font-bold uppercase tracking-widest">Out</div>
              <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center text-4xl font-black text-white transition-all duration-500 z-10 relative ${isWin ? 'bg-sleek-green/20 border-sleek-green shadow-[0_0_40px_rgba(34,197,94,0.6)] scale-110' : 'bg-sleek-bg border-sleek-border'}`}>
                {currentOutput}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto bg-black/20 p-8 rounded-3xl border border-sleek-border">
            {[
              { label: 'Weight 1', val: w1, set: setW1 },
              { label: 'Weight 2', val: w2, set: setW2 },
              { label: 'Weight 3', val: w3, set: setW3 },
            ].map((w, i) => (
              <div key={i} className="bg-sleek-card/50 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-sleek-muted font-bold">{w.label}</span>
                  <span className="text-sleek-purple font-mono font-bold">{w.val}</span>
                </div>
                <input type="range" min="-5" max="5" step="1" value={w.val} onChange={e => w.set(parseInt(e.target.value))} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sleek-purple" />
              </div>
            ))}
          </div>

          <AnimatePresence>
            {hasWon && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-sleek-bg/90 backdrop-blur-md flex flex-col items-center justify-center z-30 rounded-3xl">
                <motion.div initial={{ scale: 0.5, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-center">
                  <Trophy className="w-24 h-24 text-sleek-green mb-6 mx-auto drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
                  <h3 className="text-4xl font-black text-white mb-4">Network Activated!</h3>
                  <p className="text-sleek-muted text-xl mb-8">You found the perfect combination of weights.</p>
                  <button onClick={onBack} className="bg-sleek-green hover:bg-sleek-green/90 text-black px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    Claim 300 XP
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showCode && (
          <CodePanel 
            title="Behind the Scenes: Artificial Neurons"
            explanation="A single artificial neuron takes inputs, multiplies them by weights, and sums them up (a dot product). If we add an activation function, this becomes the building block of Deep Learning!"
            code={codeSnippet}
          />
        )}
      </div>
    </div>
  );
}

function DecisionTreeGame({ onBack }: { onBack: () => void }) {
  const { addXP } = useAuth();
  const [nodes, setNodes] = useState({ root: '', left: '', right: '' });
  const [hasWon, setHasWon] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const options = [
    { id: 'water', text: 'Lives in water?' },
    { id: 'mammal', text: 'Is a mammal?' },
    { id: 'fly', text: 'Can it fly?' }
  ];

  const isWin = nodes.root === 'water' && nodes.left === 'mammal' && nodes.right === 'fly';

  useEffect(() => {
    if (isWin && !hasWon) {
      setHasWon(true);
      addXP(250);
    }
  }, [isWin, hasWon, addXP]);

  const cycleOption = (current: string) => {
    if (!current) return options[0].id;
    const idx = options.findIndex(o => o.id === current);
    return options[(idx + 1) % options.length].id;
  };

  const handleNodeClick = (node: 'root' | 'left' | 'right') => {
    if (hasWon) return;
    setNodes(prev => ({ ...prev, [node]: cycleOption(prev[node]) }));
  };

  const getNodeText = (id: string) => options.find(o => o.id === id)?.text || 'Click to set condition';

  const codeSnippet = `from sklearn.tree import DecisionTreeClassifier

# Features: [Lives in water, Is mammal, Can fly]
# 1 = Yes, 0 = No
X = [
    [1, 1, 0], # Dolphin
    [1, 0, 0], # Shark
    [0, 0, 1], # Eagle
    [0, 1, 0]  # Dog
]
y = ["Dolphin", "Shark", "Eagle", "Dog"]

# The algorithm automatically builds the tree
tree = DecisionTreeClassifier()
tree.fit(X, y)

# Predict an animal: Water=Yes, Mammal=Yes, Fly=No
prediction = tree.predict([[1, 1, 0]])

print(prediction) 
# Output: ['Dolphin']`;

  return (
    <div className={`container mx-auto px-4 py-12 ${showCode ? 'max-w-7xl' : 'max-w-4xl'} transition-all duration-500`}>
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-sleek-muted hover:text-white flex items-center transition-colors">
          <X className="w-5 h-5 mr-2" /> Back to Games
        </button>
        <button 
          onClick={() => setShowCode(!showCode)} 
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold transition-colors ${showCode ? 'bg-sleek-cyan text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-sleek-card border border-sleek-border text-sleek-cyan hover:bg-sleek-cyan/10'}`}
        >
          <Terminal className="w-4 h-4" />
          <span>{showCode ? 'Hide Code' : 'View Code'}</span>
        </button>
      </div>

      <div className={`grid ${showCode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
        <div className="bg-sleek-card border border-sleek-border rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-3">Decision Tree Builder</h2>
          <p className="text-sleek-muted mb-12 text-lg">Click the nodes to assign the correct conditions and classify the animals.</p>

          <div className="flex flex-col items-center space-y-8 mb-12 relative z-10">
            {/* Root Node */}
            <div className="flex flex-col items-center">
              <button 
                onClick={() => handleNodeClick('root')} 
                className={`px-6 py-4 rounded-2xl border-2 font-bold text-lg transition-all shadow-lg ${nodes.root ? 'bg-sleek-purple/20 border-sleek-purple text-white' : 'bg-black/40 border-sleek-border text-sleek-muted hover:border-sleek-purple/50'}`}
              >
                {getNodeText(nodes.root)}
              </button>
              <div className="flex w-64 justify-between mt-4">
                 <div className="border-t-2 border-l-2 border-sleek-border w-1/2 h-8 rounded-tl-2xl" />
                 <div className="border-t-2 border-r-2 border-sleek-border w-1/2 h-8 rounded-tr-2xl" />
              </div>
            </div>

            {/* Level 2 */}
            <div className="flex w-full justify-around max-w-2xl">
               {/* Left Branch (Yes to Root) */}
               <div className="flex flex-col items-center w-1/2">
                  <div className="text-xs text-sleek-green mb-3 font-black tracking-widest bg-sleek-green/10 px-3 py-1 rounded-full">YES</div>
                  <button 
                    onClick={() => handleNodeClick('left')} 
                    className={`px-6 py-4 rounded-2xl border-2 font-bold text-sm transition-all shadow-lg ${nodes.left ? 'bg-sleek-purple/20 border-sleek-purple text-white' : 'bg-black/40 border-sleek-border text-sleek-muted hover:border-sleek-purple/50'}`}
                  >
                    {getNodeText(nodes.left)}
                  </button>
                  <div className="flex w-40 justify-between mt-4">
                     <div className="border-t-2 border-l-2 border-sleek-border w-1/2 h-8 rounded-tl-2xl" />
                     <div className="border-t-2 border-r-2 border-sleek-border w-1/2 h-8 rounded-tr-2xl" />
                  </div>
                  <div className="flex w-48 justify-between mt-4 text-base font-bold bg-black/20 p-4 rounded-2xl border border-sleek-border">
                     <div className="text-center flex flex-col items-center"><span className="text-sleek-green text-xs block mb-1">YES</span><span className="text-2xl mb-1">🐬</span>Dolphin</div>
                     <div className="text-center flex flex-col items-center"><span className="text-red-400 text-xs block mb-1">NO</span><span className="text-2xl mb-1">🦈</span>Shark</div>
                  </div>
               </div>

               {/* Right Branch (No to Root) */}
               <div className="flex flex-col items-center w-1/2">
                  <div className="text-xs text-red-400 mb-3 font-black tracking-widest bg-red-500/10 px-3 py-1 rounded-full">NO</div>
                  <button 
                    onClick={() => handleNodeClick('right')} 
                    className={`px-6 py-4 rounded-2xl border-2 font-bold text-sm transition-all shadow-lg ${nodes.right ? 'bg-sleek-purple/20 border-sleek-purple text-white' : 'bg-black/40 border-sleek-border text-sleek-muted hover:border-sleek-purple/50'}`}
                  >
                    {getNodeText(nodes.right)}
                  </button>
                  <div className="flex w-40 justify-between mt-4">
                     <div className="border-t-2 border-l-2 border-sleek-border w-1/2 h-8 rounded-tl-2xl" />
                     <div className="border-t-2 border-r-2 border-sleek-border w-1/2 h-8 rounded-tr-2xl" />
                  </div>
                  <div className="flex w-48 justify-between mt-4 text-base font-bold bg-black/20 p-4 rounded-2xl border border-sleek-border">
                     <div className="text-center flex flex-col items-center"><span className="text-sleek-green text-xs block mb-1">YES</span><span className="text-2xl mb-1">🦅</span>Eagle</div>
                     <div className="text-center flex flex-col items-center"><span className="text-red-400 text-xs block mb-1">NO</span><span className="text-2xl mb-1">🐕</span>Dog</div>
                  </div>
               </div>
            </div>
          </div>

          <AnimatePresence>
            {hasWon && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-sleek-bg/90 backdrop-blur-md flex flex-col items-center justify-center z-30 rounded-3xl">
                <motion.div initial={{ scale: 0.5, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-center">
                  <Trophy className="w-24 h-24 text-sleek-green mb-6 mx-auto drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
                  <h3 className="text-4xl font-black text-white mb-4">Tree Completed!</h3>
                  <p className="text-sleek-muted text-xl mb-8">You successfully classified all the animals.</p>
                  <button onClick={onBack} className="bg-sleek-green hover:bg-sleek-green/90 text-black px-10 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    Claim 250 XP
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {showCode && (
          <CodePanel 
            title="Behind the Scenes: Decision Trees"
            explanation="Decision Tree algorithms automatically figure out the best questions to ask by calculating 'Information Gain'. They split the data at each node to perfectly classify the inputs."
            code={codeSnippet}
          />
        )}
      </div>
    </div>
  );
}

export default function Games() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  if (activeGame === 'data-sort') return <DataSortGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'train-model') return <TrainModelGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'nn-sim') return <NeuralNetGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'decision-tree') return <DecisionTreeGame onBack={() => setActiveGame(null)} />;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-black text-white mb-6 tracking-tight">Mini-Games</h1>
        <p className="text-sleek-muted max-w-2xl mx-auto text-lg">
          Learn AI concepts through interactive, gamified challenges. Complete puzzles to earn XP and climb the leaderboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {GAMES.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-3xl bg-sleek-card border border-sleek-border hover:border-sleek-purple/50 transition-all shadow-lg hover:shadow-sleek-purple/10"
          >
            <div className={`absolute top-0 right-0 w-48 h-48 rounded-bl-full ${game.bg} opacity-30 group-hover:scale-110 transition-transform duration-700 ease-out`} />
            
            <div className="p-10 relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-8">
                <div className={`w-20 h-20 rounded-3xl ${game.bg} flex items-center justify-center border border-white/5 shadow-inner`}>
                  <game.icon className={`w-10 h-10 ${game.color}`} />
                </div>
                <div className="flex items-center space-x-2 bg-black/40 px-4 py-2 rounded-full border border-sleek-border backdrop-blur-sm">
                  <Trophy className="w-5 h-5 text-sleek-green" />
                  <span className="text-sm font-black text-white">{game.xp} XP</span>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{game.title}</h3>
              <p className="text-sleek-muted mb-10 text-lg leading-relaxed flex-grow">{game.description}</p>

              <button 
                onClick={() => setActiveGame(game.id)}
                className="w-full flex items-center justify-center space-x-3 bg-sleek-bg border border-sleek-border hover:bg-sleek-purple hover:border-sleek-purple text-white py-4 rounded-2xl font-bold text-lg transition-all group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:-translate-y-1"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>Play Now</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
