import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Custom API routes go here
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      message: "AIML PlayLab Backend is running!",
      keyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0,
      keyStart: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 4) : null
    });
  });

  app.post("/api/explain", async (req, res) => {
    try {
      const { history, currentLoss } = req.body;
      
      if (!history || currentLoss === undefined) {
        throw new Error("Missing history or currentLoss in request body.");
      }
      
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.includes("TODO")) {
        return res.status(400).json({ error: "GEMINI_API_KEY is missing or invalid. Please set your Gemini API Key in the Settings -> Secrets panel." });
      }
      
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        You are an AI teacher explaining Gradient Descent to a student who just played a mini-game.
        The student tried to find the minimum of a curve (loss function).
        Their final loss was ${currentLoss}.
        Their position history (from 0 to 100, where 30 is the minimum) was: ${history.join(', ')}.
        
        Explain their performance simply in 2-3 short paragraphs.
        - If they reached near 30, congratulate them on finding the minimum.
        - If they bounced back and forth, explain that their "learning rate" (step size) was too big.
        - If they didn't reach it, explain they needed more steps or a bigger learning rate.
        Keep it encouraging, simple, and relate it to how AI models learn.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.json({ explanation: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: `Failed to generate explanation. Details: ${error?.message || 'Unknown error'}` });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
