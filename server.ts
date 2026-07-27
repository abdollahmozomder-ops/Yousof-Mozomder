import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for morning scene poetry / story generation
  app.post("/api/poem", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const { mood, language } = req.body;

      if (!apiKey) {
        return res.json({
          poem: language === 'en' 
            ? "Soft morning mist wraps the emerald fields in gentle silence.\nRed roofs peek through the palm trees as the orange-pink sunrise whispers hope to the rural breeze."
            : "কুয়াশার চাদরে ঢাকা সবুজ শ্যামল প্রান্তর,\nলাল ছাদের ঘরে ভোরের আলোয় জাগে গ্রামবাংলা।\nকমলা আর গোলাপী কিরণে ছড়িয়ে পড়ে শান্ত সকালের অপার সৌন্দর্য।",
          fallback: true
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const promptText = language === 'en'
        ? `Write a poetic 4-line verse about a serene Bangladeshi rural morning with misty green fields, red-roofed village houses, and a vivid orange-pink sunrise sky. Mood: ${mood || 'peaceful'}. Keep it concise and evocative.`
        : `একটি শান্ত ও সুন্দর গ্রামীণ ভোরের ৪ চরণের কবিতা বা কাব্যিক লাইন লেখো। বিষয়: কুয়াশায় ঢাকা সবুজ মাঠ, লাল ছাদওয়ালা গ্রামীন বাড়ি, কমলা-গোলাপী সূর্যোদয়। ভাব: ${mood || 'শান্তনদী'}। খুব সুন্দর মার্জিত ভাষায় লেখো।`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
      });

      const poemText = response.text || "";
      return res.json({ poem: poemText, fallback: false });
    } catch (err: any) {
      console.error("Gemini poem error:", err);
      return res.json({
        poem: req.body.language === 'en'
          ? "Dewdrops glisten on paddy leaves under the blush of dawn.\nA tranquil village wakes up wrapped in silver mist."
          : "ধানের পাতায় শিশিরবিন্দু, রাঙা সূর্যোদয় গগনে,\nকুয়াশার মিষ্টি ঘ্রাণে জেগে ওঠে মেঠো পথ ও সবুজ গ্রাম।",
        fallback: true
      });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
