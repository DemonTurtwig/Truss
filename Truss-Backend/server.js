const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Endpoint 1: Unified Blueprint and Instruction Generation
async function generateBlueprintAndInstructions(appDescription) {
  const prompt = `
    Generate a detailed blueprint and instructions for the following application:
    "${appDescription}"

    Include:
    1. A complete file and folder structure, based on the app's requirements.
    2. Step-by-step instructions to build and organize the application.

    Format:
    -- BLUEPRINT START --
    [Blueprint: File structure]
    -- BLUEPRINT END --
    -- INSTRUCTIONS START --
    [Instructions: How to set up and build the app]
    -- INSTRUCTIONS END --
  `;

  console.log("🔹 Generating blueprint and instructions...");
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 16300,
  });

  const content = response.choices[0]?.message?.content || "";
  console.log("🔹 Raw Response:", content);

  // Extract blueprint and instructions
  const blueprint =
    content.split("-- BLUEPRINT START --")[1]?.split("-- BLUEPRINT END --")[0]?.trim() || "";
  const instructions =
    content.split("-- INSTRUCTIONS START --")[1]?.split("-- INSTRUCTIONS END --")[0]?.trim() || "";

  return { blueprint, instructions };
}

// Unified API Endpoint
app.post("/api/generate-blueprint-instructions", async (req, res) => {
  const { appDescription } = req.body;

  try {
    const { blueprint, instructions } = await generateBlueprintAndInstructions(appDescription);

    if (!blueprint || !instructions) {
      throw new Error("Blueprint or Instructions missing from response.");
    }

    res.json({ blueprint, instructions });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Failed to generate blueprint and instructions." });
  }
});

// Endpoint 2: Live Chat Endpoint

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for files

app.post("/api/live-chat", upload.array("files", 10), async (req, res) => {
  const { message } = req.body;
  const uploadedFiles = req.files;

  if (!message?.trim() && (!uploadedFiles || uploadedFiles.length === 0)) {
    return res
      .status(400)
      .json({ reply: "Please provide a valid query or upload files." });
  }

  let fileContents = "";
  if (uploadedFiles && uploadedFiles.length > 0) {
    fileContents = uploadedFiles
      .map(
        (file, index) =>
          `### File ${index + 1}: ${file.originalname}\n\n${file.buffer.toString(
            "utf-8"
          )}`
      )
      .join("\n\n");
  }

  // Build the dynamic prompt
  const prompt = `
    You are Truss, an AI coding assistant and world-class software developer. Provide detailed and precise answers to help the user with their coding queries.

    ### User Query:
    ${message || "No text query provided."}

    ${fileContents ? `### Uploaded Files:\n${fileContents}` : ""}

    Guidelines:
    - Be clear, concise, and actionable.
    - Provide code snippets where applicable, formatted cleanly.
    - Adapt to the user's tech stack or programming language if mentioned.
    - Summarize file contents and integrate them into your response where relevant.
    - Avoid unnecessary explanations.

    Your Response:
  `;

  try {
    console.log("🔹 Processing user query and files...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 16300, // Adjust based on your requirements
    });

    const reply =
      response.choices[0]?.message?.content.trim() ||
      "I don't know how to answer that.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error in live chat:", error.message);
    res.status(500).json({ reply: "An error occurred. Please try again." });
  }
});

//Endpoint 3: Marketing Strategy

app.post("/api/marketing-strategy", async (req, res) => {
  const { appName, description, targetAudience, features, monetization, developmentStage, platforms } = req.body;

  if (!appName || !description) {
    return res.status(400).json({ reply: "Please provide all required details." });
  }

  const prompt = `
    You are a marketing expert. Based on the provided details, evaluate the app's value and recommend marketing strategies.

    App Name: ${appName}
    Description: ${description}
    Target Audience: ${targetAudience}
    Features: ${features.join(", ")}
    Monetization Strategy: ${monetization}
    Development Stage: ${developmentStage}
    Platforms: ${platforms.join(", ")}

    Guidelines:
    1. Provide a brief appraisal of the app's potential value.
    2. Suggest marketing strategies tailored to the app's target audience and platforms.
    3. Recommend pricing or monetization improvements.

    Your response:
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 16300,
    });

    const reply = response.choices[0]?.message?.content || "Unable to generate a response.";
    res.json({ reply });
  } catch (error) {
    console.error("Error in generating marketing strategy:", error.message);
    res.status(500).json({ reply: "An error occurred. Please try again later." });
  }
});



const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
