import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import axios from "axios";
import pdfParse from "pdf-parse-fixed";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";


function extractJSON(str) {
  const match = str.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

// ---- LLM call ----
async function callLLM(text, rule) {
  try {
    const response = await axios.post(
      GROQ_ENDPOINT,
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Return ONLY JSON strictly formatted as: {\"status\":\"pass or fail\",\"evidence\":\"short text\",\"reasoning\":\"short explanation\",\"confidence\":90} — no extra text outside JSON."
          },
          {
            role: "user",
            content: `PDF TEXT:\n${text}\n\nRULE:\n${rule}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    const raw = response.data?.choices?.[0]?.message?.content ?? "";
    const json = extractJSON(raw);

    if (!json) {
      return {
        rule,
        status: "error",
        evidence: "",
        reasoning: "LLM did not return valid JSON. Raw output: " + raw.slice(0, 200),
        confidence: 0
      };
    }
    return {
      rule,
      status: json.status || "fail",
      evidence: json.evidence || "None",
      reasoning: json.reasoning || "No reasoning",
      confidence: json.confidence || 0
    };
  } catch (err) {
    console.log("LLM Error:", err.response?.data || err.message);
    return {
      rule,
      status: "error",
      evidence: "",
      reasoning: "LLM API request failed",
      confidence: 0
    };
  }
}

// ---- PDF Check Endpoint 
app.post("/check-pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "PDF file missing" });

    const rules = JSON.parse(req.body.rules ?? "[]");
    if (!Array.isArray(rules) || rules.length !== 3) {
      return res.status(400).json({ error: "Exactly 3 rules are required." });
    }
    // PDF Parsing
    let text = "";
    try {
      const pdfData = await pdfParse(req.file.buffer);
      text = pdfData.text || "";
      // If parser fails silently (text empty), throw error
      if (!text.trim()) {
        throw new Error("No text found in PDF (scanned/image PDF or corrupted file)");
      }
    } catch (err) {
   
      console.error("Parse Error:", err);
      return res.status(400).json({
        error: "PDF parsing failed: " + (err.message || err) + ". Please upload a valid, text-based PDF generated from Word, Google Docs or any editor. Scanned/image PDFs are not supported."
      });
    }

    // LLM check
    const results = [];
    for (const rule of rules) {
      const result = await callLLM(text, rule);
      results.push(result);
    }
    res.json(results);

  } catch (err) {
    console.log("Server Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(5000, () => console.log("🚀 Backend running successfully on port 5000"));
