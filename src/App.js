import React, { useState } from "react";
import PdfMerger from "./components/PdfMerger";
import PdfExtractor from "./components/PdfExtractor";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("merge");

  return (
    <div className="App">
      <header className="app-header">
        <h1>📑 PDF Editor</h1>
        <p>Merge multiple PDFs or extract individual pages</p>
      </header>

      <div className="tab-container">
        <button
          className={`tab-btn ${activeTab === "merge" ? "active" : ""}`}
          onClick={() => setActiveTab("merge")}
        >
          Merge PDFs
        </button>
        <button
          className={`tab-btn ${activeTab === "extract" ? "active" : ""}`}
          onClick={() => setActiveTab("extract")}
        >
          Extract Pages
        </button>
      </div>

      <main className="app-content">
        {activeTab === "merge" ? <PdfMerger /> : <PdfExtractor />}
      </main>

      <footer className="app-footer">
        <p>Built with React & pdf-lib</p>
      </footer>
    </div>
  );
}

export default App;
