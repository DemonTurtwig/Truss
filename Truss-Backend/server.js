const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Endpoint 1: Generate Application Blueprint
app.post("/api/generate-blueprint", async (req, res) => {
  const { appDescription } = req.body;

  const blueprintPrompt = `
    Generate a detailed modular blueprint for the following application:
    Description: "${appDescription}"

    The blueprint should include:
    1. A list of components/modules required to build the application.
    2. The role of each component/module.
    3. The suggested tech stack for each component.

    Return the blueprint in a structured, readable format.
  `;

  try {
    console.log("🔹 Generating blueprint...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: blueprintPrompt }],
      max_tokens: 16300,
    });

    const blueprint = response.choices[0]?.message?.content || "No blueprint generated.";
    console.log("✅ Blueprint generated:", blueprint);
    res.json({ blueprint });
  } catch (error) {
    console.error("❌ Error generating blueprint:", error.message);
    res.status(500).json({ error: "Failed to generate the blueprint." });
  }
});

// Endpoint 2: Generate Detailed Build Instructions
app.post("/api/generate-instructions", async (req, res) => {
  const { blueprint } = req.body;

  const instructionsPrompt = `
    Based on the following application blueprint:
    "${blueprint}"

    Provide detailed step-by-step instructions for building this application. Include:
    1. Setting up the project environment.
    2. Installing dependencies.
    3. File structure and folder organization.
    4. How to link and build each component/module.
    5. Final testing and deployment steps.

    Format the response in markdown-friendly format.
  `;

  try {
    console.log("🔹 Generating build instructions...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: instructionsPrompt }],
      max_tokens: 16300,
    });

    const instructions = response.choices[0]?.message?.content || "No instructions generated.";
    console.log("✅ Build instructions generated.");
    res.json({ instructions });
  } catch (error) {
    console.error("❌ Error generating instructions:", error.message);
    res.status(500).json({ error: "Failed to generate the instructions." });
  }
});

// Endpoint 3: Generate Code Module
app.post("/api/generate-module", async (req, res) => {
  const { moduleName, techStack, functionality, mobileSupport } = req.body;

  const modulePrompt = `
    Generate the following component/module for an application:
    - Module Name: "${moduleName}"
    - Tech Stack: "${techStack}"
    - Functionality: "${functionality}"
    - Mobile Support: ${mobileSupport === "yes" ? "Enabled" : "Disabled"}

    Return the module code with:
    -- CODE START --
    [Code Content]
    -- CODE END --
  `;

  try {
    console.log(`🔹 Generating module: ${moduleName}`);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: modulePrompt }],
      max_tokens: 16300,
    });

    const content = response.choices[0]?.message?.content || "No module generated.";
    const codeContent = content.split("-- CODE START --")[1]?.split("-- CODE END --")[0]?.trim() || "";

    console.log(`✅ Code for module "${moduleName}" generated.`);
    res.json({ code: codeContent });
  } catch (error) {
    console.error(`❌ Error generating module "${moduleName}":`, error.message);
    res.status(500).json({ error: "Failed to generate the module." });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
