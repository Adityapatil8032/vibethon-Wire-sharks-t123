# 🧠 AIML PlayLab

AIML PlayLab is an interactive, gamified platform designed to help users learn Artificial Intelligence and Machine Learning. It combines structured learning modules, a real-time Python coding playground, mini-games, and real-world simulations into a single, cohesive, "Sleek Interface" dark-mode experience.

## ✨ Features

*   **Interactive Python Playground**: Write, run, and test real Python Machine Learning code directly in your browser. Powered by Pyodide, it comes pre-loaded with `numpy` and `scikit-learn`.
*   **AI Mentor**: Stuck on a bug or don't understand a concept? The integrated Google Gemini AI assistant can explain code or fix errors instantly.
*   **Gamified Learning**: Earn XP, level up, and collect badges as you complete modules and mini-games.
*   **Real-World Simulations**: Tweak parameters in live simulations (like Spam Detection or Movie Recommenders) to see how AI models behave in the wild.
*   **Sleek Interface Theme**: A premium, dark-mode UI featuring glassmorphism, soft gradients, and smooth Framer Motion animations.
*   **Serverless Architecture**: Secure authentication and real-time database syncing powered by Firebase.

## 🛠️ Tech Stack

*   **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Lucide Icons
*   **Backend & Database**: Firebase Authentication, Cloud Firestore
*   **AI Integration**: Google Gemini API (`@google/genai`)
*   **In-Browser Python**: Pyodide (WebAssembly)

## 🚀 Getting Started (Local Development)

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn
*   A Google Gemini API Key
*   A Firebase Project

### 1. Clone & Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Environment Variables
Create a \`.env\` file in the root directory and add your Gemini API key:
\`\`\`env
GEMINI_API_KEY="your_gemini_api_key_here"
\`\`\`

### 3. Firebase Configuration
Ensure your Firebase configuration is properly set up. In the AI Studio environment, this is handled via \`firebase-applet-config.json\`. If running locally outside of AI Studio, ensure your \`src/firebase.ts\` is initialized with your standard Firebase config object.

### 4. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`
The application will be available at \`http://localhost:3000\`.

## 📂 Project Structure

*   \`/src/components\`: Reusable UI components (Layout, AuthModal, etc.)
*   \`/src/contexts\`: React Context providers (AuthContext)
*   \`/src/pages\`: Main application views (Dashboard, Playground, Modules, Games, etc.)
*   \`/src/index.css\`: Global styles and Tailwind/Sleek Theme configuration
*   \`/requirements.txt\`: Documentation of the Python libraries used in the Pyodide environment

## 🐍 Python Execution Note

This project does **not** require a traditional Python backend (like Flask or Django) to execute user code. Instead, it utilizes **Pyodide**, a port of CPython to WebAssembly. This allows the platform to run complex Machine Learning scripts (using `scikit-learn` and `numpy`) entirely client-side, providing instant feedback and zero server compute costs for code execution.
