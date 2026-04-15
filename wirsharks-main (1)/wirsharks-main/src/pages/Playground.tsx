import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Terminal, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

declare global {
  interface Window {
    loadPyodide: any;
  }
}

export default function Playground() {
  const [code, setCode] = useState(`# Welcome to the Python AI/ML Playground!
import numpy as np
from sklearn.linear_model import LinearRegression

# 1. Create sample training data (e.g., predicting house prices)
# X = square footage (in 1000s), y = price (in $1000s)
X = np.array([[1.0], [1.5], [2.0], [2.5], [3.0]])
y = np.array([200, 290, 380, 500, 610])

print("🤖 Training the Machine Learning model...")
model = LinearRegression()
model.fit(X, y)

# 2. Make a prediction for a new data point
new_house_size = np.array([[2.2]])
predicted_price = model.predict(new_house_size)

print(f"\\n✅ Model trained! Equation: y = {model.coef_[0]:.2f}x + {model.intercept_:.2f}")
print(f"🏠 Predicted price for a 2,200 sq ft house: $\\{predicted_price[0]*1000:,.2f}")
`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    async function initPyodide() {
      try {
        setOutput("Loading Python environment...\n");
        pyodideRef.current = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
        });
        setOutput("Loading AI/ML libraries (numpy, scikit-learn). This may take a moment...\n");
        await pyodideRef.current.loadPackage(['numpy', 'scikit-learn']);
        setIsPyodideReady(true);
        setOutput("✅ Python AI/ML environment ready!\n");
      } catch (err) {
        console.error("Failed to load Pyodide", err);
        setOutput("Error: Failed to load Python environment.");
      }
    }
    if (window.loadPyodide) {
      initPyodide();
    } else {
      // Wait for script to load
      const interval = setInterval(() => {
        if (window.loadPyodide) {
          clearInterval(interval);
          initPyodide();
        }
      }, 100);
    }
  }, []);

  const runCode = async () => {
    if (!isPyodideReady || !pyodideRef.current) {
      setOutput('Python environment is still loading. Please wait...');
      return;
    }

    setIsRunning(true);
    setOutput('Running...\n');
    
    try {
      // Redirect stdout to our output state
      pyodideRef.current.setStdout({ batched: (msg: string) => {
        setOutput(prev => prev + msg + '\n');
      }});
      
      // Clear previous output before running
      setOutput('');
      
      await pyodideRef.current.runPythonAsync(code);
      
      setOutput(prev => prev + '\n[Execution completed successfully]');
    } catch (e: any) {
      setOutput(prev => prev + `\nError:\n${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const askAI = async (action: 'explain' | 'fix') => {
    setIsAiThinking(true);
    setAiResponse('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = action === 'explain' 
        ? `Explain this Python code simply for a beginner:\n\n${code}`
        : `Find any bugs in this Python code and suggest fixes:\n\n${code}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiResponse(response.text || 'No response from AI.');
    } catch (error: any) {
      setAiResponse(`AI Error: ${error.message}`);
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-sleek-bg rounded-3xl border border-sleek-border overflow-hidden">
      {/* Editor Section */}
      <div className="flex-1 flex flex-col border-r border-sleek-border">
        <div className="h-14 border-b border-sleek-border bg-sleek-card flex items-center justify-between px-6">
          <div className="flex items-center space-x-2 text-sm font-medium text-sleek-text">
            <Terminal className="w-4 h-4 text-sleek-cyan" />
            <span>main.py</span>
            {!isPyodideReady && (
              <span className="flex items-center text-xs text-sleek-muted ml-2">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Loading Python...
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => askAI('explain')}
              disabled={isAiThinking}
              className="flex items-center space-x-1 text-xs font-semibold text-sleek-purple hover:bg-sleek-purple/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3 h-3" />
              <span>Explain</span>
            </button>
            <button 
              onClick={() => askAI('fix')}
              disabled={isAiThinking}
              className="flex items-center space-x-1 text-xs font-semibold text-orange-400 hover:bg-orange-500/10 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              <AlertCircle className="w-3 h-3" />
              <span>Fix Error</span>
            </button>
            <button 
              onClick={runCode}
              disabled={isRunning || !isPyodideReady}
              className="flex items-center space-x-1 bg-sleek-green hover:bg-sleek-green/80 text-black text-xs font-bold px-4 py-1.5 rounded-lg transition-colors ml-2 disabled:opacity-50"
            >
              {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
              <span>{isRunning ? 'Running...' : 'Run'}</span>
            </button>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 bg-transparent text-sleek-text p-6 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-sleek-purple/50"
          spellCheck="false"
        />
      </div>

      {/* Output & AI Section */}
      <div className="w-full md:w-1/3 flex flex-col bg-sleek-card">
        <div className="flex-1 flex flex-col border-b border-sleek-border">
          <div className="h-14 border-b border-sleek-border bg-black/20 flex items-center px-6">
            <span className="text-xs font-bold text-sleek-muted uppercase tracking-widest">Output</span>
          </div>
          <div className="flex-1 p-6 font-mono text-sm text-sleek-text whitespace-pre-wrap overflow-auto bg-transparent">
            {output}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="h-14 border-b border-sleek-border bg-black/20 flex items-center px-6">
            <span className="text-xs font-bold text-sleek-purple uppercase tracking-widest flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assistant
            </span>
          </div>
          <div className="flex-1 p-6 text-sm text-sleek-text overflow-auto bg-sleek-purple/5">
            {isAiThinking ? (
              <div className="flex items-center space-x-2 text-sleek-purple">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <span>AI is thinking...</span>
              </div>
            ) : aiResponse ? (
              <div className="prose prose-invert prose-sm max-w-none">
                {aiResponse}
              </div>
            ) : (
              <div className="text-sleek-muted text-center mt-8">
                Click "Explain" or "Fix Error" to get AI help with your code.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
