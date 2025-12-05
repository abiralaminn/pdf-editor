import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { downloadPDF } from "../utils/pdfDownload";
import * as pdfjsLib from "pdfjs-dist";
import "./PdfTextEditor.css";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PdfTextEditor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [textEntries, setTextEntries] = useState([]);
  const [newText, setNewText] = useState("");
  const [fontSize, setFontSize] = useState(12);
  const [xPosition, setXPosition] = useState(50);
  const [yPosition, setYPosition] = useState(700);
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState([]);
  const [loadingText, setLoadingText] = useState(false);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const count = pdf.getPageCount();
        setPageCount(count);
        setCurrentPage(1);
        setTextEntries([]);
        setExtractedText([]);
        setShowExtractedText(false);
        showNotification(`PDF loaded with ${count} pages`, "success");
      } catch (error) {
        console.error("Error loading PDF:", error);
        showNotification(
          "Error loading PDF. Please make sure it's a valid PDF file.",
          "error"
        );
      }
    }
  };

  const extractTextFromPDF = async () => {
    if (!selectedFile) return;

    setLoadingText(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const textByPage = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        textByPage.push({
          pageNum: i,
          text: pageText || "(No text found on this page)",
        });
      }

      setExtractedText(textByPage);
      setShowExtractedText(true);
      showNotification("Text extracted successfully! 📄", "success");
    } catch (error) {
      console.error("Error extracting text:", error);
      showNotification("Error extracting text from PDF.", "error");
    } finally {
      setLoadingText(false);
    }
  };

  const addTextEntry = () => {
    if (!newText.trim()) {
      showNotification("Please enter some text", "error");
      return;
    }

    const entry = {
      id: Date.now(),
      page: currentPage,
      text: newText,
      x: xPosition,
      y: yPosition,
      fontSize: fontSize,
    };

    setTextEntries([...textEntries, entry]);
    setNewText("");
    showNotification(`Text added to page ${currentPage}`, "success");
  };

  const removeTextEntry = (id) => {
    setTextEntries(textEntries.filter((entry) => entry.id !== id));
  };

  const clearAllTextEntries = () => {
    setTextEntries([]);
    showNotification("All text entries cleared", "success");
  };

  const savePdfWithText = async () => {
    if (!selectedFile) return;

    if (textEntries.length === 0) {
      showNotification("Please add some text entries first", "error");
      return;
    }

    setProcessing(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Group entries by page
      const entriesByPage = {};
      textEntries.forEach((entry) => {
        if (!entriesByPage[entry.page]) {
          entriesByPage[entry.page] = [];
        }
        entriesByPage[entry.page].push(entry);
      });

      // Add text to each page
      Object.keys(entriesByPage).forEach((pageNum) => {
        const page = pdfDoc.getPage(parseInt(pageNum) - 1);
        const entries = entriesByPage[pageNum];

        entries.forEach((entry) => {
          page.drawText(entry.text, {
            x: entry.x,
            y: entry.y,
            size: entry.fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      downloadPDF(blob, "edited-document.pdf");
      showNotification("PDF edited successfully! 🎉", "success");
    } catch (error) {
      console.error("Error editing PDF:", error);
      showNotification("Error editing PDF. Please try again.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const currentPageEntries = textEntries.filter(
    (entry) => entry.page === currentPage
  );

  return (
    <div className="pdf-text-editor">
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <span>{notification.message}</span>
          <button
            className="notification-close"
            onClick={() =>
              setNotification({ show: false, message: "", type: "" })
            }
          >
            ✕
          </button>
        </div>
      )}

      <h2>Edit PDF Text</h2>

      <div className="upload-section">
        <label htmlFor="editor-upload" className="upload-label">
          <span className="upload-icon">✏️</span>
          Select PDF File
        </label>
        <input
          id="editor-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>

      {selectedFile && (
        <>
          <div className="file-info">
            <p className="file-name-display">
              <strong>File:</strong> {selectedFile.name}
            </p>
            <p className="page-count">
              <strong>Total Pages:</strong> {pageCount}
            </p>
          </div>

          <div className="extract-text-section">
            <button
              className="extract-text-btn"
              onClick={extractTextFromPDF}
              disabled={loadingText}
            >
              {loadingText ? "Extracting Text..." : "📖 View PDF Text Content"}
            </button>
            {showExtractedText && (
              <button
                className="toggle-text-btn"
                onClick={() => setShowExtractedText(!showExtractedText)}
              >
                {showExtractedText ? "Hide Text" : "Show Text"}
              </button>
            )}
          </div>

          {showExtractedText && extractedText.length > 0 && (
            <div className="extracted-text-container">
              <h3>📄 Extracted Text from PDF</h3>
              <p className="extract-hint">
                💡 Review the text below to find what you want to cover/replace
              </p>
              {extractedText.map((page) => (
                <div key={page.pageNum} className="text-page-section">
                  <div className="text-page-header">
                    <strong>Page {page.pageNum}</strong>
                    <button
                      className="jump-to-page-btn"
                      onClick={() => setCurrentPage(page.pageNum)}
                    >
                      Edit This Page
                    </button>
                  </div>
                  <div className="text-content">{page.text}</div>
                </div>
              ))}
            </div>
          )}

          <div className="page-selector">
            <label>
              <strong>Select Page:</strong>
            </label>
            <div className="page-controls">
              <button
                className="page-nav-btn"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                ◀ Previous
              </button>
              <span className="page-display">
                Page {currentPage} of {pageCount}
              </span>
              <button
                className="page-nav-btn"
                onClick={() =>
                  setCurrentPage(Math.min(pageCount, currentPage + 1))
                }
                disabled={currentPage === pageCount}
              >
                Next ▶
              </button>
            </div>
          </div>

          <div className="text-input-section">
            <h3>Add Text to Page {currentPage}</h3>

            <div className="input-group">
              <label>Text Content:</label>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Enter text to add to PDF..."
                rows="3"
              />
            </div>

            <div className="position-controls">
              <div className="input-group">
                <label>X Position:</label>
                <input
                  type="number"
                  value={xPosition}
                  onChange={(e) => setXPosition(Number(e.target.value))}
                  min="0"
                  max="600"
                />
              </div>

              <div className="input-group">
                <label>Y Position:</label>
                <input
                  type="number"
                  value={yPosition}
                  onChange={(e) => setYPosition(Number(e.target.value))}
                  min="0"
                  max="800"
                />
              </div>

              <div className="input-group">
                <label>Font Size:</label>
                <input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  min="8"
                  max="72"
                />
              </div>
            </div>

            <button className="add-text-btn" onClick={addTextEntry}>
              Add Text to Page {currentPage}
            </button>
          </div>

          {currentPageEntries.length > 0 && (
            <div className="entries-section">
              <h3>
                Text on Page {currentPage} ({currentPageEntries.length})
              </h3>
              {currentPageEntries.map((entry) => (
                <div key={entry.id} className="text-entry">
                  <div className="entry-content">
                    <div className="entry-text">{entry.text}</div>
                    <div className="entry-details">
                      Position: ({entry.x}, {entry.y}) | Size: {entry.fontSize}
                      px
                    </div>
                  </div>
                  <button
                    className="remove-entry-btn"
                    onClick={() => removeTextEntry(entry.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {textEntries.length > 0 && (
            <div className="action-section">
              <div className="summary">
                <strong>Total text entries:</strong> {textEntries.length} across{" "}
                {new Set(textEntries.map((e) => e.page)).size} page(s)
              </div>
              <div className="action-buttons">
                <button
                  className="clear-btn"
                  onClick={clearAllTextEntries}
                  disabled={processing}
                >
                  Clear All
                </button>
                <button
                  className="save-btn"
                  onClick={savePdfWithText}
                  disabled={processing}
                >
                  {processing ? "Processing..." : "Save & Download PDF"}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="help-section">
        <h4>💡 How to Edit PDF Text:</h4>
        <ul>
          <li>
            <strong>Step 1:</strong> Click "View PDF Text Content" to see all
            text in the PDF
          </li>
          <li>
            <strong>Step 2:</strong> Find the text you want to change and note
            which page it's on
          </li>
          <li>
            <strong>Step 3:</strong> Click "Edit This Page" to jump to that page
          </li>
          <li>
            <strong>Step 4:</strong> Add new text to cover/replace the old text
          </li>
          <li>
            X position: 0 (left) to 600 (right) | Y position: 0 (bottom) to 800
            (top)
          </li>
          <li>
            Tip: Use white text or add a white rectangle first to cover old text
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PdfTextEditor;
