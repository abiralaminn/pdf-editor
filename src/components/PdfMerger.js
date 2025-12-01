import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { downloadPDF } from "../utils/pdfDownload";
import "./PdfMerger.css";

const PdfMerger = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [merging, setMerging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
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

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    // Append new files to existing ones instead of replacing
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    // Reset the input value to allow selecting the same file again
    event.target.value = "";
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newFiles = [...selectedFiles];
    const draggedFile = newFiles[draggedIndex];

    newFiles.splice(draggedIndex, 1);
    newFiles.splice(index, 0, draggedFile);

    setSelectedFiles(newFiles);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const mergePdfs = async () => {
    if (selectedFiles.length < 2) {
      showNotification("Please select at least 2 PDF files to merge", "error");
      return;
    }

    setMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of selectedFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });

      // Use mobile-compatible download utility
      downloadPDF(blob, "merged-document.pdf");
      showNotification("PDFs merged successfully! 🎉", "success");
    } catch (error) {
      console.error("Error merging PDFs:", error);
      showNotification(
        "Error merging PDFs. Please make sure all files are valid PDF documents.",
        "error"
      );
    } finally {
      setMerging(false);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="pdf-merger">
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
      <h2>Merge Multiple PDFs</h2>
      <div className="upload-section">
        <label htmlFor="merge-upload" className="upload-label">
          <span className="upload-icon">📁</span>
          {selectedFiles.length > 0 ? "Add More PDFs" : "Select PDF Files"}
        </label>
        <input
          id="merge-upload"
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>

      {selectedFiles.length > 0 && (
        <div className="file-list">
          <h3>Selected Files ({selectedFiles.length})</h3>
          <p className="drag-hint">💡 Drag files to reorder them</p>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className={`file-item ${
                draggedIndex === index ? "dragging" : ""
              }`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <span className="drag-handle">☰</span>
              <span className="file-name">{file.name}</span>
              <button className="remove-btn" onClick={() => removeFile(index)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <button className="merge-btn" onClick={mergePdfs} disabled={merging}>
          {merging ? "Merging..." : "Merge PDFs"}
        </button>
      )}
    </div>
  );
};

export default PdfMerger;
