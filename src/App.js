import React, { useState } from "react";
import PdfMerger from "./components/PdfMerger";
import PdfExtractor from "./components/PdfExtractor";
import PdfPageRemover from "./components/PdfPageRemover";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("merge");

  return (
    <div className="App">
      <header className="app-header">
        <h1>📑 PDF Editor</h1>
        <p>Merge, extract, or remove pages from PDFs</p>
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
        <button
          className={`tab-btn ${activeTab === "remove" ? "active" : ""}`}
          onClick={() => setActiveTab("remove")}
        >
          Remove Pages
        </button>
      </div>

      <main className="app-content">
        {activeTab === "merge" && <PdfMerger />}
        {activeTab === "extract" && <PdfExtractor />}
        {activeTab === "remove" && <PdfPageRemover />}
      </main>

      <footer className="app-footer">
        <p>Built with React & pdf-lib</p>
      </footer>
    </div>
  );
}

export default App;
