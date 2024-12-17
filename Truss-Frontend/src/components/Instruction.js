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

  const generateBlueprint = async () => {
    if (!appDescription.trim()) {
      alert("Please provide an app description.");
      return;
    }

    setLoading(true);
    setProgress("Generating application blueprint...");

    try {
      const response = await axios.post("http://localhost:5000/api/generate-blueprint", {
        appDescription,
      });

      const blueprintData = response.data.blueprint;
      if (!blueprintData) throw new Error("Blueprint generation failed.");

      setBlueprint(blueprintData);
      setProgress("✅ Blueprint generated successfully! Generating instructions...");

      const instructionResponse = await axios.post("http://localhost:5000/api/generate-instructions", {
        blueprint: blueprintData,
      });

      const instructionsData = instructionResponse.data.instructions;
      if (!instructionsData) throw new Error("Instruction generation failed.");

      setInstructions(instructionsData);
      setProgress("✅ Instructions generated successfully! 🎉");
      onGeneratedOutput("Blueprint and instructions generated successfully.");
    } catch (error) {
      console.error("❌ Error:", error.message);
      setProgress("❌ Failed to generate blueprint or instructions.");
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
      <h2 className="text-2xl mb-6 text-center font-bebas text-gray-800">
        Truss ⚙️ - Application Blueprint
      </h2>

      {/* Description Input */}
      <div className="space-y-6">
        <div>
          <label className="block font-bold font-mono text-gray-800 mb-2">What application do you want to build?</label>
          <textarea
            value={appDescription}
            onChange={handleDescriptionChange}
            placeholder="E.g., I want to build a scientific calculator with basic and advanced functions..."
            className="w-full p-3 border rounded h-24 focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono text-gray-700"
            style={{ fontFamily: "Roboto Mono, monospace" }}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateBlueprint}
          disabled={loading}
          className="w-full px-6 py-2 rounded-lg font-bold font-mono bg-black text-white hover:bg-gray-800 transition duration-200"
        >
          {loading ? "Processing..." : "Generate Blueprint"}
        </button>

        {/* Progress Status */}
        {progress && (
          <div className="mt-4 text-center font-mono text-yellow-600 font-semibold">{progress}</div>
        )}

        {/* Blueprint Display */}
        {blueprint && (
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2 text-gray-800">🔹 Application Blueprint</h3>
            <pre
              className="bg-gray-100 p-4 rounded text-sm overflow-x-auto font-mono"
              style={{ fontFamily: "Roboto Mono, monospace" }}
            >
              {blueprint}
            </pre>
            <button
              onClick={() => downloadFile("application_blueprint.txt", blueprint)}
              className="mt-4 w-full px-6 py-2 rounded-lg font-bold font-mono bg-black text-white hover:bg-gray-800 transition duration-200"
            >
              Download Blueprint 📥
            </button>
          </div>
        )}

        {/* Instructions Display */}
        {instructions && (
          <div className="mt-6">
            <h3 className="text-lg font-bold font-mono mb-2 text-gray-800">🛠️ How to Build This Application</h3>
            <pre
              className="bg-gray-100 p-4 rounded text-sm overflow-x-auto font-mono"
              style={{ fontFamily: "Roboto Mono, monospace" }}
            >
              {instructions}
            </pre>
            <button
              onClick={() => downloadFile("build_instructions.txt", instructions)}
              className="mt-4 w-full px-6 py-2 rounded-lg font-bold font-mono bg-black text-white hover:bg-gray-800 transition duration-200"
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
