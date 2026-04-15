import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Film, MessageSquareCode, Settings2, X, Send, User, Bot, Star, AlertTriangle, CheckCircle, Activity, BarChart3, Brain, Eye, Play, Pause, RefreshCw, Terminal, Navigation, TrendingDown, Clock, CheckCircle2, Sparkles } from 'lucide-react';

// --- SPAM FILTER SIMULATION ---
function SpamFilterSim({ onBack }: { onBack: () => void }) {
  const [text, setText] = useState("URGENT: Your account has been compromised. Click the link to verify your free money prize.");
  
  const [spamKeywords, setSpamKeywords] = useState<Record<string, number>>({ 'urgent': 0.9, 'compromised': 0.8, 'click': 0.6, 'link': 0.5, 'free': 0.9, 'money': 0.8, 'prize': 0.9, 'winner': 0.9, 'guarantee': 0.8, 'act': 0.7, 'now': 0.6 });
  const [hamKeywords, setHamKeywords] = useState<Record<string, number>>({ 'meeting': 0.9, 'project': 0.8, 'team': 0.7, 'review': 0.6, 'attached': 0.8, 'proposal': 0.9, 'lunch': 0.7, 'tomorrow': 0.6, 'hello': 0.5, 'thanks': 0.6 });

  const [newWord, setNewWord] = useState('');
  const [newWeight, setNewWeight] = useState(0.8);
  const [newType, setNewType] = useState<'spam'|'ham'>('spam');

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    const word = newWord.toLowerCase().trim().replace(/[^\w]/g, '');
    if (!word) return;
    
    if (newType === 'spam') {
      setSpamKeywords(prev => ({ ...prev, [word]: newWeight }));
      setHamKeywords(prev => { const next = {...prev}; delete next[word]; return next; });
    } else {
      setHamKeywords(prev => ({ ...prev, [word]: newWeight }));
      setSpamKeywords(prev => { const next = {...prev}; delete next[word]; return next; });
    }
    setNewWord('');
  };

  const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  
  let spamScore = 0.5; 
  let hamScore = 0.5;

  const matchedSpam: {word: string, weight: number}[] = [];
  const matchedHam: {word: string, weight: number}[] = [];

  words.forEach(w => {
    if (spamKeywords[w as keyof typeof spamKeywords]) {
      const weight = spamKeywords[w as keyof typeof spamKeywords];
      spamScore *= weight;
      hamScore *= (1 - weight);
      if (!matchedSpam.find(m => m.word === w)) matchedSpam.push({word: w, weight});
    } else if (hamKeywords[w as keyof typeof hamKeywords]) {
      const weight = hamKeywords[w as keyof typeof hamKeywords];
      hamScore *= weight;
      spamScore *= (1 - weight);
      if (!matchedHam.find(m => m.word === w)) matchedHam.push({word: w, weight});
    }
  });

  const total = spamScore + hamScore;
  const spamProbability = total === 0 ? 50 : (spamScore / total) * 100;
  const isSpam = spamProbability > 50;

  const renderText = () => {
    return text.split(/(\s+)/).map((word, i) => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (spamKeywords[cleanWord as keyof typeof spamKeywords]) {
        return <span key={i} className="bg-red-500/20 text-red-400 px-1 rounded border border-red-500/30 font-bold">{word}</span>;
      }
      if (hamKeywords[cleanWord as keyof typeof hamKeywords]) {
        return <span key={i} className="bg-sleek-green/20 text-sleek-green px-1 rounded border border-sleek-green/30 font-bold">{word}</span>;
      }
      return <span key={i}>{word}</span>;
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto px-4 py-12 max-w-6xl">
      <button onClick={onBack} className="text-sleek-muted hover:text-white mb-8 flex items-center transition-colors">
        <X className="w-5 h-5 mr-2" /> Back to Simulations
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-sleek-card border border-sleek-border rounded-3xl p-8 shadow-2xl flex flex-col">
          <div className="flex items-center space-x-3 mb-6">
            <ShieldAlert className="w-8 h-8 text-sleek-purple" />
            <h2 className="text-2xl font-bold text-white">Spam Filter (Naive Bayes)</h2>
          </div>
          <p className="text-sleek-muted mb-6">Type an email below. The model will analyze the words in real-time to determine if it's spam or ham (safe).</p>
          
          <div className="flex-grow flex flex-col space-y-4">
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-48 bg-black/40 border border-sleek-border rounded-2xl p-4 text-white focus:outline-none focus:border-sleek-purple/50 resize-none"
              placeholder="Type your email here..."
            />
            <div className="bg-black/60 border border-sleek-border rounded-2xl p-6 min-h-[150px] text-lg leading-relaxed shadow-inner">
              {renderText()}
            </div>
          </div>
        </div>

        <div className="bg-sleek-card border border-sleek-border rounded-3xl p-8 shadow-2xl flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center"><Activity className="w-5 h-5 mr-2 text-sleek-cyan" /> Live Analysis</h3>
          
          <div className="mb-10">
            <div className="flex justify-between mb-2">
              <span className="text-sleek-muted font-bold uppercase tracking-widest text-sm">Spam Probability</span>
              <span className={`font-mono font-bold ${isSpam ? 'text-red-400' : 'text-sleek-green'}`}>{spamProbability.toFixed(1)}%</span>
            </div>
            <div className="w-full h-6 bg-black/50 rounded-full overflow-hidden border border-sleek-border relative">
              <motion.div 
                className={`absolute top-0 left-0 h-full ${isSpam ? 'bg-red-500' : 'bg-sleek-green'}`}
                initial={{ width: 0 }}
                animate={{ width: `${spamProbability}%` }}
                transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
              />
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20 z-10" />
            </div>
            <div className="flex justify-between mt-2 text-xs text-sleek-muted font-bold">
              <span>0% (Safe)</span>
              <span>Threshold (50%)</span>
              <span>100% (Spam)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 flex-grow mb-6">
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
              <h4 className="text-red-400 font-bold mb-4 flex items-center"><AlertTriangle className="w-4 h-4 mr-2" /> Spam Indicators</h4>
              <ul className="space-y-2">
                {matchedSpam.length === 0 && <li className="text-sleek-muted text-sm italic">No spam words detected.</li>}
                {matchedSpam.map((m, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span className="text-white">{m.word}</span>
                    <span className="text-red-400 font-mono bg-red-500/10 px-2 py-0.5 rounded">{(m.weight * 100).toFixed(0)}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-sleek-green/5 border border-sleek-green/20 rounded-2xl p-4">
              <h4 className="text-sleek-green font-bold mb-4 flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Safe Indicators</h4>
              <ul className="space-y-2">
                {matchedHam.length === 0 && <li className="text-sleek-muted text-sm italic">No safe words detected.</li>}
                {matchedHam.map((m, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <span className="text-white">{m.word}</span>
                    <span className="text-sleek-green font-mono bg-sleek-green/10 px-2 py-0.5 rounded">{(m.weight * 100).toFixed(0)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-black/40 border border-sleek-border rounded-2xl p-6 mt-auto">
            <h4 className="text-white font-bold mb-4 flex items-center"><Settings2 className="w-4 h-4 mr-2" /> Adjust Token Weights</h4>
            <form onSubmit={handleAddWord} className="flex flex-col space-y-4">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={newWord}
                  onChange={e => setNewWord(e.target.value)}
                  placeholder="New word..."
                  className="flex-1 bg-black/60 border border-sleek-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sleek-purple/50"
                />
                <select 
                  value={newType}
                  onChange={e => setNewType(e.target.value as 'spam'|'ham')}
                  className="bg-black/60 border border-sleek-border rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sleek-purple/50"
                >
                  <option value="spam">Spam</option>
                  <option value="ham">Safe</option>
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-sleek-muted font-bold w-12">Weight:</span>
                <input 
                  type="range" 
                  min="0.1" 
                  max="0.9" 
                  step="0.1" 
                  value={newWeight}
                  onChange={e => setNewWeight(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sleek-purple"
                />
                <span className="text-xs font-mono text-sleek-purple w-8 text-right">{(newWeight * 100).toFixed(0)}%</span>
                <button type="submit" className="bg-sleek-purple hover:bg-sleek-purple/80 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- MOVIE RECOMMENDER SIMULATION ---
const MOVIES = ['The Matrix', 'Inception', 'Interstellar', 'The Notebook', 'Titanic', 'Avengers'];
const USERS = [
  { name: 'Alice', ratings: { 'The Matrix': 5, 'Inception': 5, 'Interstellar': 4, 'The Notebook': 1, 'Titanic': 2, 'Avengers': 4 } },
  { name: 'Bob', ratings: { 'The Matrix': 2, 'Inception': 1, 'Interstellar': 2, 'The Notebook': 5, 'Titanic': 5, 'Avengers': 2 } },
  { name: 'Charlie', ratings: { 'The Matrix': 4, 'Inception': 5, 'Interstellar': 5, 'The Notebook': 2, 'Titanic': 1, 'Avengers': 5 } },
  { name: 'Diana', ratings: { 'The Matrix': 1, 'Inception': 2, 'Interstellar': 1, 'The Notebook': 4, 'Titanic': 5, 'Avengers': 1 } },
];

function MovieRecommenderSim({ onBack }: { onBack: () => void }) {
  const [myRatings, setMyRatings] = useState<Record<string, number>>({});

  const handleRate = (movie: string, rating: number) => {
    setMyRatings(prev => {
      if (prev[movie] === rating) {
        const newRatings = { ...prev };
        delete newRatings[movie];
        return newRatings;
      }
      return { ...prev, [movie]: rating };
    });
  };

  // Calculate similarity (simplified Pearson/Cosine hybrid for demo)
  const similarities = USERS.map(user => {
    let diffSum = 0;
    let commonCount = 0;
    for (const movie of MOVIES) {
      if (myRatings[movie] && user.ratings[movie]) {
        diffSum += Math.abs(myRatings[movie] - user.ratings[movie]);
        commonCount++;
      }
    }
    // Max diff for a movie is 4 (5-1). 
    // Similarity = 100% if diff is 0. 
    const similarity = commonCount === 0 ? 0 : Math.max(0, 1 - (diffSum / (commonCount * 4)));
    return { name: user.name, similarity, ratings: user.ratings };
  }).sort((a, b) => b.similarity - a.similarity);

  const recommendations = MOVIES.filter(m => !myRatings[m]).map(movie => {
    let weightedSum = 0;
    let simSum = 0;
    similarities.forEach(u => {
      if (u.ratings[movie] && u.similarity > 0) {
        weightedSum += u.ratings[movie] * u.similarity;
        simSum += u.similarity;
      }
    });
    const predictedRating = simSum === 0 ? 0 : weightedSum / simSum;
    return { movie, predictedRating };
  }).sort((a, b) => b.predictedRating - a.predictedRating);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto px-4 py-12 max-w-6xl">
      <button onClick={onBack} className="text-sleek-muted hover:text-white mb-8 flex items-center transition-colors">
        <X className="w-5 h-5 mr-2" /> Back to Simulations
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-sleek-card border border-sleek-border rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <Film className="w-8 h-8 text-sleek-cyan" />
            <h2 className="text-2xl font-bold text-white">Collaborative Filtering</h2>
          </div>
          <p className="text-sleek-muted mb-8">Rate a few movies. The system will find users with similar tastes and recommend movies they liked.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {MOVIES.map(movie => (
              <div key={movie} className={`p-4 rounded-2xl border transition-all ${myRatings[movie] ? 'bg-sleek-cyan/10 border-sleek-cyan/50' : 'bg-black/40 border-sleek-border hover:border-sleek-cyan/30'}`}>
                <div className="font-bold text-white mb-3">{movie}</div>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      onClick={() => handleRate(movie, star)}
                      className={`p-1 transition-transform hover:scale-110 ${myRatings[movie] >= star ? 'text-yellow-400' : 'text-slate-600'}`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-white mb-4 flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-sleek-purple" /> User Similarity Matrix</h3>
          <div className="bg-black/40 border border-sleek-border rounded-2xl p-6 overflow-x-auto">
            <div className="flex space-x-4">
              {similarities.map(user => (
                <div key={user.name} className="flex-1 bg-sleek-card border border-sleek-border rounded-xl p-4 text-center min-w-[120px]">
                  <div className="w-12 h-12 bg-sleek-purple/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-sleek-purple/50">
                    <User className="w-6 h-6 text-sleek-purple" />
                  </div>
                  <div className="font-bold text-white mb-1">{user.name}</div>
                  <div className="text-xs text-sleek-muted mb-2">Match</div>
                  <div className="text-xl font-mono font-bold text-sleek-cyan">{(user.similarity * 100).toFixed(0)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-sleek-card border border-sleek-border rounded-3xl p-8 shadow-2xl flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6">Recommended for You</h3>
          
          <div className="flex-grow flex flex-col space-y-4">
            {Object.keys(myRatings).length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center text-sleek-muted border-2 border-dashed border-sleek-border rounded-2xl p-8">
                <Star className="w-12 h-12 mb-4 opacity-20" />
                <p>Rate some movies to get personalized recommendations.</p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center text-sleek-muted border-2 border-dashed border-sleek-border rounded-2xl p-8">
                <CheckCircle className="w-12 h-12 mb-4 text-sleek-green opacity-50" />
                <p>You've rated all available movies!</p>
              </div>
            ) : (
              <AnimatePresence>
                {recommendations.map((rec, i) => (
                  <motion.div 
                    key={rec.movie}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-black/40 border border-sleek-border rounded-2xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white mb-1">{rec.movie}</div>
                      <div className="text-xs text-sleek-muted">Predicted Rating</div>
                    </div>
                    <div className="flex items-center space-x-2 bg-sleek-cyan/10 px-3 py-1.5 rounded-lg border border-sleek-cyan/30">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-mono font-bold text-sleek-cyan">{rec.predictedRating.toFixed(1)}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- CHATBOT LOGIC SIMULATION ---
function ChatbotSim({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<{sender: 'user'|'bot', text: string, intent?: string}[]>([
    { sender: 'bot', text: 'Hello! I am a customer support bot. How can I help you today?', intent: 'Greeting' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const intents = [
    { name: 'Greeting', keywords: ['hello', 'hi', 'hey', 'morning'], response: 'Hi there! How can I assist you?' },
    { name: 'Refund', keywords: ['refund', 'money back', 'return', 'cancel'], response: 'I can help you with a refund. Please provide your order number.' },
    { name: 'Status', keywords: ['status', 'where is my order', 'track', 'shipping'], response: 'To check your order status, please enter your tracking ID.' },
    { name: 'Pricing', keywords: ['cost', 'price', 'how much', 'expensive'], response: 'Our pricing plans start at $9.99/month. Would you like a link to our pricing page?' },
    { name: 'Goodbye', keywords: ['bye', 'goodbye', 'see ya', 'thanks'], response: 'Goodbye! Have a great day.' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    
    // Simple intent matching
    const lowerInput = userMsg.toLowerCase();
    let matchedIntent = null;
    for (const intent of intents) {
      if (intent.keywords.some(kw => lowerInput.includes(kw))) {
        matchedIntent = intent;
        break;
      }
    }

    setTimeout(() => {
      if (matchedIntent) {
        setMessages(prev => [...prev, { sender: 'bot', text: matchedIntent.response, intent: matchedIntent.name }]);
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: "I'm not sure I understand. Could you rephrase that?", intent: 'Unknown' }]);
      }
    }, 600);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto px-4 py-12 max-w-6xl">
      <button onClick={onBack} className="text-sleek-muted hover:text-white mb-8 flex items-center transition-colors">
        <X className="w-5 h-5 mr-2" /> Back to Simulations
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-sleek-card border border-sleek-border rounded-3xl p-8 shadow-2xl flex flex-col h-[600px]">
          <div className="flex items-center space-x-3 mb-6">
            <MessageSquareCode className="w-8 h-8 text-sleek-green" />
            <h2 className="text-2xl font-bold text-white">Intent Recognition</h2>
          </div>
          
          <div className="flex-grow overflow-y-auto pr-4 space-y-4 mb-4 custom-scrollbar">
            {messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-sleek-green text-black rounded-tr-sm' : 'bg-black/60 border border-sleek-border text-white rounded-tl-sm'}`}>
                  {msg.text}
                </div>
                {msg.sender === 'bot' && msg.intent && (
                  <div className="text-xs font-mono text-sleek-muted mt-1 ml-2 flex items-center">
                    <Activity className="w-3 h-3 mr-1" /> Intent: <span className={msg.intent === 'Unknown' ? 'text-red-400 ml-1' : 'text-sleek-green ml-1'}>{msg.intent}</span>
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="relative mt-auto">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              className="w-full bg-black/40 border border-sleek-border rounded-xl py-4 pl-4 pr-12 text-white focus:outline-none focus:border-sleek-green/50"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-sleek-green text-black rounded-lg hover:bg-sleek-green/90 transition-colors">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="bg-sleek-card border border-sleek-border rounded-3xl p-8 shadow-2xl overflow-y-auto h-[600px] custom-scrollbar">
          <h3 className="text-xl font-bold text-white mb-6">State Machine Rules</h3>
          <p className="text-sleek-muted mb-8">The chatbot uses keyword matching to determine the user's intent, then transitions to the corresponding state to reply.</p>
          
          <div className="space-y-4">
            {intents.map(intent => (
              <div key={intent.name} className="bg-black/40 border border-sleek-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-white text-lg">{intent.name}</span>
                  <span className="text-xs font-mono bg-sleek-green/10 text-sleek-green px-2 py-1 rounded border border-sleek-green/30">STATE</span>
                </div>
                <div className="mb-3">
                  <span className="text-xs text-sleek-muted uppercase tracking-wider font-bold block mb-1">Keywords (Triggers)</span>
                  <div className="flex flex-wrap gap-2">
                    {intent.keywords.map(kw => (
                      <span key={kw} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">{kw}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-sleek-muted uppercase tracking-wider font-bold block mb-1">Response Action</span>
                  <div className="text-sm text-sleek-cyan bg-sleek-cyan/5 p-3 rounded-xl border border-sleek-cyan/20">
                    "{intent.response}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- GLASS BRAIN (MODEL INTERPRETABILITY) ---
function GlassBrainSim({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState<'Cat' | 'Dog' | 'Car'>('Cat');
  const [disabledNodes, setDisabledNodes] = useState<Set<string>>(new Set());
  const [isInferring, setIsInferring] = useState(false);
  const [activeLayer, setActiveLayer] = useState(-1);
  const [prediction, setPrediction] = useState<string | null>(null);

  const layers = [
    { id: 'input', nodes: 3, label: 'Input Features' },
    { id: 'hidden1', nodes: 4, label: 'Hidden Layer 1 (Edges/Shapes)' },
    { id: 'hidden2', nodes: 4, label: 'Hidden Layer 2 (Complex Features)' },
    { id: 'output', nodes: 3, label: 'Output (Classes)' }
  ];

  const classes = ['Cat', 'Dog', 'Car'];

  const toggleNode = (layerIdx: number, nodeIdx: number) => {
    if (layerIdx === 0 || layerIdx === layers.length - 1) return; // Don't disable input/output
    const nodeId = `${layerIdx}-${nodeIdx}`;
    setDisabledNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  const runInference = () => {
    setIsInferring(true);
    setActiveLayer(0);
    setPrediction(null);

    let currentLayer = 0;
    const interval = setInterval(() => {
      currentLayer++;
      setActiveLayer(currentLayer);
      
      if (currentLayer >= layers.length) {
        clearInterval(interval);
        setIsInferring(false);
        
        // Simple logic to change prediction based on disabled nodes
        if (input === 'Cat') {
          if (disabledNodes.has('1-1') || disabledNodes.has('2-2')) setPrediction('Dog');
          else setPrediction('Cat');
        } else if (input === 'Dog') {
          if (disabledNodes.has('1-2')) setPrediction('Cat');
          else setPrediction('Dog');
        } else {
          if (disabledNodes.has('2-1')) setPrediction('Dog');
          else setPrediction('Car');
        }
      }
    }, 800);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto px-4 py-12 max-w-6xl">
      <button onClick={onBack} className="text-sleek-muted hover:text-white mb-8 flex items-center transition-colors">
        <X className="w-5 h-5 mr-2" /> Back to Simulations
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-sleek-card border border-sleek-border rounded-3xl p-8 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-sleek-purple" />
              <h2 className="text-2xl font-bold text-white">Glass Brain</h2>
            </div>
            <button 
              onClick={runInference}
              disabled={isInferring}
              className="flex items-center space-x-2 bg-sleek-purple hover:bg-sleek-purple/80 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50"
            >
              {isInferring ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{isInferring ? 'Inferring...' : 'Run Inference'}</span>
            </button>
          </div>
          <p className="text-sleek-muted mb-8">Explore a pre-trained neural network. Click on hidden nodes to disable them and see how it affects the final prediction.</p>
          
          <div className="flex-grow flex flex-col justify-center bg-black/40 border border-sleek-border rounded-2xl p-8 relative overflow-hidden">
            <div className="flex justify-between items-stretch h-64 relative z-10">
              {layers.map((layer, lIdx) => (
                <div key={layer.id} className="flex flex-col justify-between items-center relative z-10 w-16">
                  <div className="text-xs text-sleek-muted font-bold text-center mb-4 h-8">{layer.label}</div>
                  <div className="flex flex-col justify-around flex-grow w-full">
                    {Array.from({ length: layer.nodes }).map((_, nIdx) => {
                      const nodeId = `${lIdx}-${nIdx}`;
                      const isDisabled = disabledNodes.has(nodeId);
                      const isActive = activeLayer >= lIdx && !isDisabled;
                      const isClickable = lIdx > 0 && lIdx < layers.length - 1;
                      
                      return (
                        <button
                          key={nIdx}
                          onClick={() => isClickable && toggleNode(lIdx, nIdx)}
                          disabled={!isClickable || isInferring}
                          className={`w-8 h-8 rounded-full border-2 transition-all duration-300 relative z-20 ${
                            isDisabled ? 'bg-slate-800 border-slate-600 opacity-50' :
                            isActive ? 'bg-sleek-purple border-sleek-purple shadow-[0_0_15px_rgba(168,85,247,0.8)] scale-110' :
                            'bg-black border-sleek-purple/50'
                          } ${isClickable && !isInferring ? 'hover:scale-125 cursor-pointer' : 'cursor-default'}`}
                        >
                          {lIdx === layers.length - 1 && (
                            <div className={`absolute left-10 top-1/2 -translate-y-1/2 text-sm font-bold whitespace-nowrap ${isActive && activeLayer >= layers.length ? 'text-sleek-green' : 'text-sleek-muted'}`}>
                              {classes[nIdx]}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              {/* Draw Connections (Simplified) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {layers.map((layer, lIdx) => {
                  if (lIdx === layers.length - 1) return null;
                  const nextLayer = layers[lIdx + 1];
                  return Array.from({ length: layer.nodes }).map((_, nIdx) => {
                    return Array.from({ length: nextLayer.nodes }).map((_, nextNIdx) => {
                      const isNodeDisabled = disabledNodes.has(`${lIdx}-${nIdx}`) || disabledNodes.has(`${lIdx + 1}-${nextNIdx}`);
                      const isConnectionActive = activeLayer > lIdx && !isNodeDisabled;
                      
                      // Calculate positions (approximate based on flex layout)
                      const x1 = (lIdx / (layers.length - 1)) * 100 + '%';
                      const y1 = ((nIdx + 1) / (layer.nodes + 1)) * 100 + '%';
                      const x2 = ((lIdx + 1) / (layers.length - 1)) * 100 + '%';
                      const y2 = ((nextNIdx + 1) / (nextLayer.nodes + 1)) * 100 + '%';

                      return (
                        <line
                          key={`${lIdx}-${nIdx}-${nextNIdx}`}
                          x1={`calc(${x1} + 2rem)`}
                          y1={`calc(${y1} + 1rem)`}
                          x2={`calc(${x2} - 2rem)`}
                          y2={`calc(${y2} + 1rem)`}
                          stroke={isConnectionActive ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.05)'}
                          strokeWidth={isConnectionActive ? 2 : 1}
                          className="transition-all duration-500"
                        />
                      );
                    });
                  });
                })}
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-sleek-card border border-sleek-border rounded-3xl p-8 shadow-2xl flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center"><Eye className="w-5 h-5 mr-2 text-sleek-cyan" /> Observation Panel</h3>
          
          <div className="mb-8">
            <span className="text-xs text-sleek-muted uppercase tracking-wider font-bold block mb-2">Input Data</span>
            <div className="flex space-x-2">
              {['Cat', 'Dog', 'Car'].map(item => (
                <button
                  key={item}
                  onClick={() => { setInput(item as any); setPrediction(null); setActiveLayer(-1); }}
                  disabled={isInferring}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-colors ${input === item ? 'bg-sleek-cyan/20 border-sleek-cyan text-sleek-cyan' : 'bg-black/40 border-sleek-border text-sleek-muted hover:border-sleek-cyan/50'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-grow flex flex-col justify-center">
            <span className="text-xs text-sleek-muted uppercase tracking-wider font-bold block mb-2 text-center">Model Prediction</span>
            <div className={`text-center p-6 rounded-2xl border ${prediction ? (prediction === input ? 'bg-sleek-green/10 border-sleek-green/30 text-sleek-green' : 'bg-red-500/10 border-red-500/30 text-red-400') : 'bg-black/40 border-sleek-border text-sleek-muted'}`}>
              {isInferring ? (
                <Activity className="w-8 h-8 animate-spin mx-auto" />
              ) : prediction ? (
                <>
                  <div className="text-4xl font-black tracking-tight mb-2">{prediction}</div>
                  <div className="text-sm font-medium">
                    {prediction === input ? 'Correctly classified!' : 'Misclassified due to disabled nodes.'}
                  </div>
                </>
              ) : (
                <div className="text-lg font-medium">Ready to infer</div>
              )}
            </div>
          </div>

          {disabledNodes.size > 0 && (
            <div className="mt-8 p-4 bg-sleek-purple/10 border border-sleek-purple/30 rounded-xl">
              <div className="text-sm text-sleek-purple font-bold mb-1">Insight:</div>
              <div className="text-xs text-sleek-muted">
                You disabled {disabledNodes.size} node(s). This removes specific learned features (like detecting pointy ears or wheels) from the network's decision process, altering its final output.
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// --- ALGORITHMIC EMPATHY ENGINE ---
function EmpathyEngineSim({ onBack }: { onBack: () => void }) {
  const [position, setPosition] = useState(80); // 0 to 100
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [history, setHistory] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Function to minimize: f(x) = (x - 30)^2
  const getLoss = (x: number) => Math.pow((x - 30) / 20, 2);
  const getSlope = (x: number) => 2 * ((x - 30) / 20) * (1/20);

  const currentLoss = getLoss(position);
  const currentSlope = getSlope(position);

  useEffect(() => {
    let timer: any;
    if (isPlaying && timeLeft > 0 && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setGameOver(true);
      setIsPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, gameOver]);

  const handleMove = (direction: 'left' | 'right', stepSize: number) => {
    if (!isPlaying || gameOver) return;
    const newPos = direction === 'left' ? Math.max(0, position - stepSize) : Math.min(100, position + stepSize);
    setPosition(newPos);
    setHistory(prev => [...prev, newPos]);
    
    if (Math.abs(newPos - 30) < 2) {
      setGameOver(true);
      setIsPlaying(false);
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setTimeLeft(30);
    setPosition(80);
    setHistory([80]);
    setShowAnalysis(false);
    setAiExplanation(null);
  };

  const handleExplain = async () => {
    setIsExplaining(true);
    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, currentLoss })
      });
      const data = await response.json();
      if (data.explanation) {
        setAiExplanation(data.explanation);
      } else {
        setAiExplanation(`Sorry, I couldn't generate an explanation right now. Server said: ${data.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      setAiExplanation(`Error connecting to the AI explainer: ${error?.message || 'Unknown error'}`);
    }
    setIsExplaining(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto px-4 py-12 max-w-6xl">
      <button onClick={onBack} className="text-sleek-muted hover:text-white mb-8 flex items-center transition-colors">
        <X className="w-5 h-5 mr-2" /> Back to Simulations
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-sleek-card border border-sleek-border rounded-3xl p-8 shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <TrendingDown className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-bold text-white">Gradient Descent Game</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sleek-muted font-mono font-bold bg-black/40 px-4 py-2 rounded-xl border border-sleek-border">
                <Clock className="w-4 h-4" />
                <span className={timeLeft <= 10 ? 'text-red-400' : ''}>00:{timeLeft.toString().padStart(2, '0')}</span>
              </div>
              {!isPlaying && !gameOver && (
                <button onClick={startGame} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-bold transition-colors">
                  Start Game
                </button>
              )}
            </div>
          </div>
          <p className="text-sleek-muted mb-8">You are the algorithm. Find the lowest point (minimum loss) before time runs out. Observe the slope to guide your steps.</p>
          
          <div className="flex-grow relative bg-black/60 border border-sleek-border rounded-2xl p-8 overflow-hidden flex flex-col justify-end min-h-[300px]">
            {/* Draw Curve */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <path 
                d={`M 0 ${100 - getLoss(0)*10} Q 30 100 100 ${100 - getLoss(100)*10}`} 
                fill="none" 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="2" 
                vectorEffect="non-scaling-stroke"
              />
              {/* Actual curve using many points for accuracy */}
              <polyline
                points={Array.from({length: 101}).map((_, i) => `${i} ${100 - getLoss(i)*10}`).join(' ')}
                fill="none"
                stroke="rgba(249,115,22,0.3)"
                strokeWidth="4"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Player Point */}
            <motion.div 
              className="absolute bottom-0 w-6 h-6 bg-orange-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(249,115,22,0.8)] z-10 -ml-3 -mb-3"
              animate={{ left: `${position}%`, bottom: `${getLoss(position)*10}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />

            {/* Controls */}
            <div className="relative z-20 flex justify-between items-center mt-auto pt-10">
              <div className="flex space-x-2">
                <button onClick={() => handleMove('left', 10)} disabled={!isPlaying} className="bg-black/80 border border-sleek-border hover:border-orange-500 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50 transition-colors">
                  &lt;&lt; Big Step
                </button>
                <button onClick={() => handleMove('left', 2)} disabled={!isPlaying} className="bg-black/80 border border-sleek-border hover:border-orange-500 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50 transition-colors">
                  &lt; Small Step
                </button>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleMove('right', 2)} disabled={!isPlaying} className="bg-black/80 border border-sleek-border hover:border-orange-500 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50 transition-colors">
                  Small Step &gt;
                </button>
                <button onClick={() => handleMove('right', 10)} disabled={!isPlaying} className="bg-black/80 border border-sleek-border hover:border-orange-500 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50 transition-colors">
                  Big Step &gt;&gt;
                </button>
              </div>
            </div>
          </div>

          {gameOver && !showAnalysis && (
            <div className="mt-6 flex justify-center">
              <button onClick={() => setShowAnalysis(true)} className="bg-sleek-purple hover:bg-sleek-purple/80 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                Analyze Performance
              </button>
            </div>
          )}
        </div>

        <div className="bg-sleek-card border border-sleek-border rounded-3xl p-8 shadow-2xl flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center"><Activity className="w-5 h-5 mr-2 text-orange-500" /> Telemetry</h3>
          
          <div className="space-y-6 flex-grow">
            <div className="bg-black/40 border border-sleek-border rounded-2xl p-5">
              <div className="text-xs text-sleek-muted uppercase tracking-wider font-bold mb-1">Current Loss (Error)</div>
              <div className="text-3xl font-black font-mono text-white">{currentLoss.toFixed(4)}</div>
            </div>
            
            <div className="bg-black/40 border border-sleek-border rounded-2xl p-5">
              <div className="text-xs text-sleek-muted uppercase tracking-wider font-bold mb-1">Slope (Derivative)</div>
              <div className={`text-3xl font-black font-mono ${currentSlope > 0 ? 'text-red-400' : currentSlope < 0 ? 'text-sleek-green' : 'text-white'}`}>
                {currentSlope > 0 ? '+' : ''}{currentSlope.toFixed(4)}
              </div>
              <div className="text-xs text-sleek-muted mt-2">
                {currentSlope > 0 ? 'Slope is positive. Move left to decrease loss.' : currentSlope < 0 ? 'Slope is negative. Move right to decrease loss.' : 'At minimum!'}
              </div>
            </div>
          </div>

          {showAnalysis && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t border-sleek-border">
              <h4 className="font-bold text-white mb-4 flex items-center"><Terminal className="w-4 h-4 mr-2 text-sleek-cyan" /> Algorithm Reveal</h4>
              <div className="bg-[#0d1117] rounded-xl p-4 border border-white/5 overflow-x-auto">
                <pre className="text-xs font-mono text-sleek-cyan leading-relaxed">
{`# What you just did:
learning_rate = 10 # Big step
# learning_rate = 2 # Small step

for step in range(max_steps):
    slope = get_slope(position)
    
    # Move opposite to slope
    position = position - (learning_rate * slope)
    
    if loss < threshold:
        break # You won!`}
                </pre>
              </div>
              <p className="text-sm text-sleek-muted mt-4 mb-4">
                You acted as the <strong>Optimizer</strong>. By checking the slope and taking steps, you performed <strong>Gradient Descent</strong> manually!
              </p>

              {!aiExplanation ? (
                <button 
                  onClick={handleExplain} 
                  disabled={isExplaining}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-sleek-purple to-sleek-cyan hover:from-sleek-purple/80 hover:to-sleek-cyan/80 text-white px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  {isExplaining ? <Activity className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                  <span>Explain my gameplay simply</span>
                </button>
              ) : (
                <div className="mt-4 p-5 bg-sleek-cyan/10 border border-sleek-cyan/30 rounded-xl">
                  <h5 className="font-bold text-sleek-cyan mb-2 flex items-center"><Sparkles className="w-4 h-4 mr-2" /> AI Teacher says:</h5>
                  <div className="text-sm text-white leading-relaxed whitespace-pre-wrap">{aiExplanation}</div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// --- MAIN SIMULATIONS PAGE ---
const SIMULATIONS = [
  {
    id: 'glass-brain',
    title: 'Explore AI (Glass Brain)',
    description: 'Peer inside a neural network. Disable neurons and watch how it changes the AI\'s perception in real-time.',
    icon: Brain,
    color: 'text-sleek-purple',
    bg: 'bg-sleek-purple/10'
  },
  {
    id: 'empathy-engine',
    title: 'Be the Algorithm (Empathy Engine)',
    description: 'Experience Gradient Descent firsthand. Navigate the loss landscape before you learn the math behind it.',
    icon: TrendingDown,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10'
  },
  {
    id: 'spam-filter',
    title: 'Spam Email Detection',
    description: 'Build and test a Naive Bayes classifier to detect spam emails. Adjust token weights and see real-time classification.',
    icon: ShieldAlert,
    color: 'text-sleek-purple',
    bg: 'bg-sleek-purple/10'
  },
  {
    id: 'recommender',
    title: 'Movie Recommender',
    description: 'Explore collaborative filtering. See how user ratings influence recommendations for others in real-time.',
    icon: Film,
    color: 'text-sleek-cyan',
    bg: 'bg-sleek-cyan/10'
  },
  {
    id: 'chatbot-logic',
    title: 'Chatbot Logic Builder',
    description: 'Design the state machine and intent recognition for a customer service chatbot.',
    icon: MessageSquareCode,
    color: 'text-sleek-green',
    bg: 'bg-sleek-green/10'
  }
];

export default function Simulations() {
  const [activeSim, setActiveSim] = useState<string | null>(null);

  if (activeSim === 'glass-brain') return <GlassBrainSim onBack={() => setActiveSim(null)} />;
  if (activeSim === 'empathy-engine') return <EmpathyEngineSim onBack={() => setActiveSim(null)} />;
  if (activeSim === 'spam-filter') return <SpamFilterSim onBack={() => setActiveSim(null)} />;
  if (activeSim === 'recommender') return <MovieRecommenderSim onBack={() => setActiveSim(null)} />;
  if (activeSim === 'chatbot-logic') return <ChatbotSim onBack={() => setActiveSim(null)} />;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-black text-white mb-6 tracking-tight">Real-World Simulations</h1>
        <p className="text-sleek-muted max-w-2xl mx-auto text-lg">
          Apply your knowledge to practical scenarios. Tweak parameters and observe how AI models behave in the wild.
        </p>
      </div>

      <div className="space-y-6">
        {SIMULATIONS.map((sim, index) => (
          <motion.div
            key={sim.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col md:flex-row bg-sleek-card border border-sleek-border rounded-3xl overflow-hidden hover:border-sleek-purple/50 transition-all shadow-lg hover:shadow-sleek-purple/10 cursor-pointer"
            onClick={() => setActiveSim(sim.id)}
          >
            <div className={`md:w-64 p-8 flex items-center justify-center ${sim.bg} border-b md:border-b-0 md:border-r border-sleek-border/50 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <sim.icon className={`w-20 h-20 ${sim.color} group-hover:scale-110 transition-transform duration-500`} />
            </div>
            
            <div className="p-8 flex-1 flex flex-col justify-center relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{sim.title}</h3>
              <p className="text-sleek-muted mb-8 text-lg leading-relaxed">{sim.description}</p>
              
              <div className="mt-auto">
                <button className={`flex items-center space-x-3 text-lg font-bold text-white bg-black/40 border border-sleek-border px-8 py-4 rounded-2xl transition-all group-hover:bg-sleek-purple group-hover:border-sleek-purple group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] w-fit`}>
                  <Settings2 className="w-5 h-5" />
                  <span>Launch Simulation</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
