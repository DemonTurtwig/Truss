import React, { useState } from "react";
import InputForm from "./components/InputForm";
import Instruction from "./components/Instruction";
import codingpic from "./components/codingpic.png";

function App() {
  const [showInstruction, setShowInstruction] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-center mt-8 text-6xl font-black font-bebas text-gray-800">
        TRUSS ⚙️ - BUILD YOUR APP
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
            onClick={() => setShowInstruction(false)}
            className={`w-full p-4 flex items-center justify-between border rounded-lg shadow-md text-left ${
              !showInstruction
                ? "bg-gray-800 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <span className="font-bold text-lg font-mono">Generate Module</span>
            <input type="radio" checked={!showInstruction} readOnly />
          </button>
          <button
            onClick={() => setShowInstruction(true)}
            className={`w-full p-4 flex items-center justify-between border rounded-lg shadow-md text-left ${
              showInstruction
                ? "bg-gray-800 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            <span className="font-bold text-lg font-mono">Generate Blueprint</span>
            <input type="radio" checked={showInstruction} readOnly />
          </button>
        </div>
      </div>
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
        {!showInstruction ? <InputForm /> : <Instruction />}
      </div>
    </div>
  );
}

export default App;

