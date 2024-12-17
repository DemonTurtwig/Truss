import React, { useState } from "react";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const InputForm = ({ onGeneratedOutput }) => {
  const [formData, setFormData] = useState({
    moduleName: "",
    techStack: "",
    functionality: "",
    mobileSupport: "yes",
    moduleFocus: "Logic and Structure",
  });

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [files, setFiles] = useState([]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress("Generating module files...");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-module",
        formData
      );

      if (response.data && Array.isArray(response.data.files)) {
        setFiles(response.data.files);
        setProgress("✅ Module generated successfully!");
        onGeneratedOutput("Files generated successfully.");
      } else {
        setFiles([]);
        setProgress("❌ No files were generated. Please check input.");
      }
    } catch (error) {
      console.error("Error generating files:", error);
      setFiles([]);
      setProgress("❌ An error occurred during generation.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file download
  const handleDownload = () => {
    const zip = new JSZip();
    files.forEach((file) => zip.file(file.fileName, file.content));
    zip.generateAsync({ type: "blob" }).then((content) =>
      saveAs(content, "module_files.zip")
    );
  };

  return (
    <div className="p-6 w-full max-w-lg mx-auto">
      {/* Form Title */}
      <h2 className="text-3xl font-bebas text-gray-800 text-center mb-6">
        Truss ⚙️ - Build Your Module
      </h2>

      {/* Module Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold font-mono mb-1">Module Name:</label>
          <input
            name="moduleName"
            placeholder="E.g., Authentication, Dashboard"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded font-mono focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block font-semibold font-mono mb-1">Tech Stack:</label>
          <input
            name="techStack"
            placeholder="E.g., React, Node.js"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded font-mono focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block font-semibold font-mono mb-1">Functionality:</label>
          <textarea
            name="functionality"
            placeholder="Briefly describe what the module does."
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded h-20 font-mono focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block font-semibold font-mono mb-1">Mobile Support:</label>
          <select
            name="mobileSupport"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded font-mono focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="yes">Yes (Responsive Design)</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label className="block font-mono font-semibold mb-1">Module Focus:</label>
          <select
            name="moduleFocus"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded font-mono focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="Logic and Structure">Logic and Structure</option>
            <option value="UI Design">UI Design</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded font-bold font-mono hover:bg-gray-800 transition duration-300"
        >
          {loading ? "Generating..." : "Generate Module"}
        </button>
      </form>

      {/* Progress Message */}
      {progress && (
        <div className="mt-4 text-center text-yellow-600 font-mono font-semibold">
          {progress}
        </div>
      )}

      {/* File Download Section */}
      {files.length > 0 && (
        <div className="mt-6 text-center">
          <h3 className="text-lg font-bold mb-2">Generated Files</h3>
          <ul className="list-disc list-inside mb-4 text-left">
            {files.map((file, index) => (
              <li key={index} className="text-gray-700 font-mono">
                📄 {file.fileName}
              </li>
            ))}
          </ul>
          <button
            onClick={handleDownload}
            className="px-6 py-2 bg-black text-white font-bold font-mono rounded hover:bg-gray-800 transition duration-300"
          >
            Download Files 📥
          </button>
        </div>
      )}
    </div>
  );
};

export default InputForm;
