import React, { useState } from "react";
import LiveChat from "./components/LiveChat";
import Instruction from "./components/Instruction";
import MarketingForm from "./components/MarketingForm";
import codingpic from "./components/codingpic.png";

function App() {
  const [showInstruction, setShowInstruction] = useState(false);
  const [showMarketing, setShowMarketing] = useState(false);
  const [output, setOutput] = useState("");

  const handleGeneratedOutput = (message) => {
    console.log("Generated Output:", message);
    setOutput(message);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center font-roboto">
      <h1 className="text-center mt-8 text-6xl font-black text-gray-800 font-bebas">
        TRUSS ⚙️ - YOUR HELPFUL AI ASSISTANT
      </h1>
      <div className="w-full max-w-4xl mt-6 mb-8">
        <img
          src={codingpic}
          alt="Coding Workspace"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
      <div className="w-full max-w-md mb-8">
        <div className="space-y-4">
          <button
            onClick={() => {
              setShowInstruction(false);
              setShowMarketing(false);
            }}
            className={`w-full p-4 flex items-center justify-between border rounded-lg shadow-md text-left ${
              !showInstruction && !showMarketing ? "bg-black text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            <span className="font-bold text-lg font-roboto-mono">Chat with Truss</span>
            <input type="radio" checked={!showInstruction && !showMarketing} readOnly />
          </button>
          <button
            onClick={() => {
              setShowInstruction(true);
              setShowMarketing(false);
            }}
            className={`w-full p-4 flex items-center justify-between border rounded-lg shadow-md text-left ${
              showInstruction ? "bg-black text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            <span className="font-bold text-lg font-roboto-mono">Generate Blueprint</span>
            <input type="radio" checked={showInstruction} readOnly />
          </button>
          <button
            onClick={() => {
              setShowInstruction(false);
              setShowMarketing(true);
            }}
            className={`w-full p-4 flex items-center justify-between border rounded-lg shadow-md text-left ${
              showMarketing ? "bg-black text-white" : "bg-white hover:bg-gray-100"
            }`}
          >
            <span className="font-bold text-lg font-roboto-mono">Marketing Your Application</span>
            <input type="radio" checked={showMarketing} readOnly />
          </button>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        {showMarketing ? (
          <MarketingForm /> // Render the MarketingForm component here
        ) : showInstruction ? (
          <Instruction />
        ) : (
          <LiveChat onGeneratedOutput={handleGeneratedOutput} />
        )}
      </div>

      {output && (
        <div className="w-full max-w-2xl mt-6 p-4 bg-yellow-100 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Output:</h3>
          <p className="text-gray-700">{output}</p>
        </div>
      )}
    </div>
  );
}

export default App;
