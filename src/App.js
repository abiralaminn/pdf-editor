import React, { useState } from "react";
import PdfMerger from "./components/PdfMerger";
import PdfExtractor from "./components/PdfExtractor";
import PdfPageRemover from "./components/PdfPageRemover";
import PdfPageReorder from "./components/PdfPageReorder";
import PdfTextEditor from "./components/PdfTextEditor";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("merge");

  return (
    <div className="App">
      <header className="app-header">
        <h1>📑 PDF Editor</h1>
        <p>Merge, extract, remove, reorder, and edit PDFs</p>
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
        <button
          className={`tab-btn ${activeTab === "reorder" ? "active" : ""}`}
          onClick={() => setActiveTab("reorder")}
        >
          Reorder Pages
        </button>
        <button
          className={`tab-btn ${activeTab === "edit" ? "active" : ""}`}
          onClick={() => setActiveTab("edit")}
        >
          Edit Text
        </button>
      </div>

      <main className="app-content">
        {activeTab === "merge" && <PdfMerger />}
        {activeTab === "extract" && <PdfExtractor />}
        {activeTab === "remove" && <PdfPageRemover />}
        {activeTab === "reorder" && <PdfPageReorder />}
        {activeTab === "edit" && <PdfTextEditor />}
      </main>
    </div>
  );
}

export default App;
