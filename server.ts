import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { AGENT_MANIFEST_DATA } from "./src/data";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable JSON request body parsing
  app.use(express.json());

  // Define API routes first
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      dateTime: new Date().toISOString(),
      seoCompliance: "2027-ready",
      aiIndexing: "enabled",
    });
  });

  // Return the structured AI agent manifest for SEO/SGE crawlers
  app.get("/api/ai-agent-manifest", (req, res) => {
    res.json(AGENT_MANIFEST_DATA);
  });

  // Email submission route
  app.post("/api/send-email", async (req, res) => {
    const { name, email, message } = req.body;
    console.log(`[EMAIL SEND REQUEST] To: scott.hardrain@gmail.com, Subject: WebSite Form, From: ${name} <${email}>, Message: ${message}`);
    // TODO: Implement actual email provider (e.g., Nodemailer + SendGrid)
    res.json({ success: true, message: "Email simulation logged. Configure SendGrid/SMTP in server.ts to send real emails." });
  });

  // Server-side Gemini proxy endpoint for AI Production/Creative brief assistance
  app.post("/api/gemini/generate", async (req, res) => {
    const { prompt, context, projectType, budgetGrade } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Missing prompt in request body." });
      return;
    }

    const systemInstruction = `
      You are an elite, modern (2027 level) AI Video Creative Director and Producer working at 'Hard Rain Production'.
      Your job is to assist clients and production managers in drafting professional video briefs, script treatments, camera package logs, storyboard descriptions, and estimative production timelines.
      Guidelines:
      - Maintain a highly sophisticated, cinematic, professional, and practical filmmaking tone.
      - Use industry keywords (Anamorphic, ACES profile, virtual production, LUTs, chroma tracking, Arri RAW, ProRes).
      - Ensure the output is returned in clean, beautifully structured Markdown. Include headers, bullet points, and clean tables for shoot timelines / gear lists.
      - Focus heavily on producing realistic, practical filmmaking blueprints.
      - Explicitly address how the video can be optimized for digital metadata indexers and SGE search engine summaries.
    `;

    const fullPrompt = `
      [PROJECT TYPE / GENRE]: ${projectType || "General Video Production"}
      [BUDGET GRADING]: ${budgetGrade || "Tier-2"}
      [CLIENT CONTEXT / BRAND VALUES]: ${context || "A premium elegant aesthetic looking for global digital traction"}
      
      [CLIENT INTERACTION PROMPT]:
      ${prompt}
      
      Generate a thorough filmmaker blueprint answering the user's prompt. Format clearly under elegant headers.
    `;

    const apiKey = process.env.GEMINI_API_KEY;

    // Check if API key is present and is not a placeholder
    const isApiKeyConfigured = apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "";

    if (!isApiKeyConfigured) {
      // Lazy fallback structure: respond with highly tailored mock generator responses
      // indicating how the AI would reply, keeping user experience perfect.
      console.warn("GEMINI_API_KEY is not configured or is placeholder. Utilizing simulation engine.");
      
      const simulatedResponses: Record<string, string> = {
        brief: `### 🎥 HARD RAIN PRODUCTION // CREATIVE PRODUCTION BLUEPRINT
*(Simulated Response — Connect your Gemini API Key in Settings to get real-time generation)*

#### 1. Creative Treatment & Visual Concept
* **Visual Style:** Anamorphic 2.39:1 widescreen, moody cyber-punk lighting paired with natural organic textures. Warm golden skin tones contrasting with deep teal/cyan negative space.
* **Core Metaphor:** The fusion of human hands with high-precision digital engineering.
* **Aesthetic Anchors:** Moody shadow falloff, high-contrast backlighting, gentle lens flares.

#### 2. Technical Camera & Post-Production Blueprint
| Department | Specification | Notes |
|:---|:---|:---|
| **Camera Package** | ARRI Alexa Mini LF | Shot in 4.5K Open Gate ARRIRAW |
| **Optics** | Cooke Anamorphic/i SF Primes | For organic oval bokeh and gentle roll-off |
| **Color Pipeline** | ACES CC color space / DaVinci Resolve | Exported to HDR Dolby Vision |
| **Sound Design** | Dolby Atmos spatial audio mix | Low sub-bass drones paired with analog synth pads |

#### 3. Phased Shoot Schedule (Estimated Timeline)
* **Pre-Production (Weeks 1-2):** Visual concept board approval, scouting interactive LED volume, casting.
* **Production Block (Days 1-3):** Stage-01 setups, drone sweeps at dusk, macro tabletop packshots.
* **Post-Production (Weeks 3-5):** Frame-accurate client portal edits approval, grading lock, master export.

#### 4. SGE AI Search Optimization Guidelines
To ensure this visual commercial is cited by AI Search Engines in 2027:
* Embed schema-ready **VideoObject** microdata into the landing frame.
* Inject metadata tags outlining Arri LF usage, director footnotes, and structured FAQs.`,
        concept: `### 🎬 CONCEPT TREATMENT: "THE DRIFT OF GLASS"
*(Simulated Response — Connect your Gemini API Key in Settings to get real-time generation)*

* **Concept Type:** Narrative Short & Moodpiece
* **Theme:** Isolated communication in a hyper-connected network.
* **Cinematographic Palette:** Heavy vaporwave blues and tungsten warmth, dynamic dolly pans, and subtle anamorphic chromatic aberration.
* **Production Footprint:** Tier-3 (Agile and light), utilising localized night-scouting with Sony Venice dual ISO sensors.`,
        budget: `### 📊 PRODUCTION BUDGET ESTIMATE BREAKDOWN
*(Simulated Response — Connect your Gemini API Key in Settings to get real-time generation)*

| Category | Budget Share | Estimated Allocation | Key Deliverables |
|:---|:---:|:---|:---|
| **Pre-Production** | 15% | $18,000 | Script treatments, scheduling, hiring crew, talent casting. |
| **Crew & Extras** | 35% | $42,000 | DP, Gaffer, sound recordist, grip, production design. |
| **Equipment Rentals** | 20% | $24,000 | ARRI kit, Atlas Orion primes, lighting trucks, wireless monitors. |
| **Post-Production** | 20% | $24,000 | Colorist, spatial sound designer, editor, VFX touchups. |
| **Contingency / Admin** | 10% | $12,000 | Permits, insurance, active server storage, meal runs. |`
      };

      // Match key concepts in user prompt to select the best simulation template
      let outputMarkdown = simulatedResponses.brief;
      if (prompt.toLowerCase().includes("concept") || prompt.toLowerCase().includes("script") || prompt.toLowerCase().includes("creative")) {
        outputMarkdown = simulatedResponses.concept;
      } else if (prompt.toLowerCase().includes("budget") || prompt.toLowerCase().includes("pricing") || prompt.toLowerCase().includes("cost")) {
        outputMarkdown = simulatedResponses.budget;
      }

      res.json({ text: outputMarkdown, simulated: true });
      return;
    }

    try {
      // Lazy initialization of Gemini client to prevent startup failure if key issues occur
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: fullPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text || "No response generated.", simulated: false });
    } catch (err: any) {
      console.error("Gemini API error inside proxy route:", err);
      res.status(500).json({ error: "Gemini server-side error: " + err.message });
    }
  });

  // Vite middleware for development vs static assets serving for production
  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring Vite Development Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Configuring Production Static File Server...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CINEMATIC SERVER] Running on host 0.0.0.0 and port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Fatal startup error in cinematic server:", error);
});
