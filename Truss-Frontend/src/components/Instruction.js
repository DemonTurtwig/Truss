import React, { useState } from "react";
import axios from "axios";

const Instruction = ({ onGeneratedOutput }) => {
  const [appDescription, setAppDescription] = useState("");
  const [blueprint, setBlueprint] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");

  const handleDescriptionChange = (e) => {
    setAppDescription(e.target.value);
  };

  const generateBlueprintAndInstructions = async () => {
    if (!appDescription.trim()) {
      alert("Please provide an app description.");
      return;
    }

    setLoading(true);
    setProgress("Generating blueprint and instructions...");

    try {
      const response = await axios.post("http://localhost:5000/api/generate-blueprint-instructions", {
        appDescription,
      });

      const { blueprint, instructions } = response.data;

      if (!blueprint || !instructions) {
        throw new Error("Blueprint or Instructions missing from response.");
      }

      setBlueprint(blueprint);
      setInstructions(instructions);
      setProgress("✅ Blueprint and instructions generated successfully!");
      onGeneratedOutput("Blueprint and instructions generated successfully.");
    } catch (error) {
      console.error("❌ Error:", error.message);
      setProgress("❌ Failed to generate blueprint and instructions.");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div>
      <h2 className="text-3xl mb-6 text-center font-bebas text-gray-800">
        TRUSS ⚙️ - APPLICATION BLUEPRINT & INSTRUCTIONS
      </h2>

      {/* Description Input */}
      <div className="space-y-6">
        <div>
          <label className="block font-bold font-mono text-gray-800 mb-2">
            Describe the application you want to build:
          </label>
          <textarea
            value={appDescription}
            onChange={handleDescriptionChange}
            placeholder="E.g., I want to build a scientific calculator..."
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white text-gray-700 font-mono h-32"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateBlueprintAndInstructions}
          disabled={loading}
          className="w-full px-6 py-2 rounded-lg font-bold bg-black text-white hover:bg-gray-800 transition duration-200"
        >
          {loading ? "Processing..." : "Generate Blueprint & Instructions"}
        </button>

        {/* Progress Status */}
        {progress && (
          <div className="mt-4 text-center text-yellow-600 font-mono font-semibold">
            {progress}
          </div>
        )}

        {/* Blueprint Display */}
        {blueprint && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2 text-gray-800">🔹 Application Blueprint</h3>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto font-mono whitespace-pre-line">
              {blueprint}
            </pre>
            <button
              onClick={() => downloadFile("application_blueprint.txt", blueprint)}
              className="mt-4 w-full px-6 py-2 rounded-lg font-bold bg-black text-white hover:bg-gray-800 transition duration-200"
            >
              Download Blueprint 📥
            </button>
          </div>
        )}

        {/* Instructions Display */}
        {instructions && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2 text-gray-800">🛠️ Build Instructions</h3>
            <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto font-mono whitespace-pre-line">
              {instructions}
            </pre>
            <button
              onClick={() => downloadFile("build_instructions.txt", instructions)}
              className="mt-4 w-full px-6 py-2 rounded-lg font-bold bg-black text-white hover:bg-gray-800 transition duration-200"
            >
              Download Instructions 📥
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Instruction;

