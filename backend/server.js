import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Satan OpenAI backend is running."
  });
});

app.post("/chat", async (req, res) => {
  try {
    const userInput =
      req.body?.message ||
      req.body?.prompt ||
      req.body?.input ||
      req.body?.text ||
      "";

    if (!userInput.trim()) {
      return res.status(400).json({
        reply: "No input was provided."
      });
    }

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: `You are Satan, a focused reflective music-experience translator inside the Panathema "Depths of Listening" tool.

Your job:
- Interpret what the user says music did to them.
- Suggest likely listening levels from the tool, especially one or two strongest matches.
- Offer concise vocabulary they can reuse in their table.
- Suggest body cues and after-effects if relevant.
- Rewrite their input into one cleaner sentence.

Important style:
- Be clear, serious, compact, and psychologically attentive.
- Do not be goofy, demonic, roleplay-heavy, or theatrical.
- Do not overclaim certainty.
- Do not diagnose mental health conditions.
- Focus on phenomenology: imagery, bodily sensation, exposure, tension, absorption, dissolution, clarity, after-effects.

Preferred response format:
Possible levels: ...
Words you could use: ...
Body cues: ...
After-effect: ...
A cleaner sentence: "..."

Keep the answer concise and usable.`
        },
        {
          role: "user",
          content: userInput
        }
      ]
    });

    const reply =
      completion.choices?.[0]?.message?.content?.trim() ||
      "No reply generated.";

    res.json({ reply });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      reply: "The OpenAI endpoint failed.",
      error: error?.message || "Unknown server error"
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
