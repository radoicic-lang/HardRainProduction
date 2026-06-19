import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
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
    });
  });

  // Email submission route
  app.post("/api/send-email", async (req, res) => {
    const { name, email, message } = req.body;
    console.log(`[EMAIL SEND REQUEST] To: scott.hardrain@gmail.com, Subject: WebSite Form, From: ${name} <${email}>, Message: ${message}`);
    // TODO: Implement actual email provider (e.g., Nodemailer + SendGrid)
    res.json({ success: true, message: "Email simulation logged. Configure SendGrid/SMTP in server.ts to send real emails." });
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
