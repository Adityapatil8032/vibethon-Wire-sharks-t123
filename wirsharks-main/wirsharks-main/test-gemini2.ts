import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

async function test() {
  console.log("Key:", process.env.GEMINI_API_KEY ? "Set" : "Not Set");
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello",
    });
    console.log("Success:", response.text);
  } catch (error: any) {
    console.error("Error:", error?.message || error);
  }
}

test();
