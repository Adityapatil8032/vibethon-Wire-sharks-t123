import { motion } from 'framer-motion';
import { ShieldAlert, Film, MessageSquareCode, Settings2 } from 'lucide-react';

const SIMULATIONS = [
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
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Real-World Simulations</h1>
        <p className="text-sleek-muted max-w-2xl mx-auto">
          Apply your knowledge to practical scenarios. Tweak parameters and observe how AI models behave in the wild.
        </p>
      </div>

      <div className="space-y-6">
        {SIMULATIONS.map((sim, index) => (
          <motion.div
            key={sim.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col md:flex-row bg-sleek-card border border-sleek-border rounded-3xl overflow-hidden hover:border-sleek-purple/50 transition-colors"
          >
            <div className={`md:w-48 p-8 flex items-center justify-center ${sim.bg} border-b md:border-b-0 md:border-r border-sleek-border/50`}>
              <sim.icon className={`w-16 h-16 ${sim.color}`} />
            </div>
            
            <div className="p-8 flex-1 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-3">{sim.title}</h3>
              <p className="text-sleek-muted mb-6">{sim.description}</p>
              
              <div className="mt-auto">
                <button className="flex items-center space-x-2 text-sm font-bold text-white bg-sleek-card border border-sleek-border hover:bg-sleek-purple px-6 py-3 rounded-xl transition-colors w-fit">
                  <Settings2 className="w-4 h-4" />
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
