import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { downloadPDF } from "../utils/pdfDownload";
import "./PdfPageReorder.css";

const PdfPageReorder = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState([]);
  const [processing, setProcessing] = useState(false);
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

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const count = pdf.getPageCount();
        setPageCount(count);

        // Create array of page numbers
        const pageArray = Array.from({ length: count }, (_, i) => i + 1);
        setPages(pageArray);

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

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newPages = [...pages];
    const draggedPage = newPages[draggedIndex];

    newPages.splice(draggedIndex, 1);
    newPages.splice(index, 0, draggedPage);

    setPages(newPages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const movePageUp = (index) => {
    if (index === 0) return;
    const newPages = [...pages];
    [newPages[index - 1], newPages[index]] = [
      newPages[index],
      newPages[index - 1],
    ];
    setPages(newPages);
  };

  const movePageDown = (index) => {
    if (index === pages.length - 1) return;
    const newPages = [...pages];
    [newPages[index], newPages[index + 1]] = [
      newPages[index + 1],
      newPages[index],
    ];
    setPages(newPages);
  };

  const resetOrder = () => {
    const pageArray = Array.from({ length: pageCount }, (_, i) => i + 1);
    setPages(pageArray);
    showNotification("Page order reset to original", "success");
  };

  const savePdfWithNewOrder = async () => {
    if (!selectedFile || pages.length === 0) return;

    setProcessing(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      // Copy pages in the new order
      for (const pageNum of pages) {
        const [copiedPage] = await newPdf.copyPages(pdf, [pageNum - 1]);
        newPdf.addPage(copiedPage);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      downloadPDF(blob, "reordered-document.pdf");
      showNotification("PDF pages reordered successfully! 🎉", "success");
    } catch (error) {
      console.error("Error reordering PDF pages:", error);
      showNotification("Error reordering PDF. Please try again.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="pdf-page-reorder">
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

      <h2>Reorder PDF Pages</h2>

      <div className="upload-section">
        <label htmlFor="reorder-upload" className="upload-label">
          <span className="upload-icon">🔄</span>
          Select PDF File
        </label>
        <input
          id="reorder-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>

      {selectedFile && (
        <div className="file-info">
          <p className="file-name-display">
            <strong>File:</strong> {selectedFile.name}
          </p>
          <p className="page-count">
            <strong>Total Pages:</strong> {pageCount}
          </p>
        </div>
      )}

      {pages.length > 0 && (
        <>
          <div className="controls-section">
            <button
              className="control-btn"
              onClick={resetOrder}
              disabled={processing}
            >
              Reset Order
            </button>
          </div>

          <div className="pages-list">
            <h3>Drag pages to reorder:</h3>
            <p className="drag-hint">
              💡 Drag pages or use arrow buttons to reorder
            </p>

            {pages.map((pageNum, index) => (
              <div
                key={`${pageNum}-${index}`}
                className={`page-item ${
                  draggedIndex === index ? "dragging" : ""
                }`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <span className="drag-handle">☰</span>
                <span className="page-info">
                  <span className="current-position">
                    Position {index + 1}:
                  </span>
                  <span className="original-page">Page {pageNum}</span>
                </span>
                <div className="page-controls">
                  <button
                    className="arrow-btn"
                    onClick={() => movePageUp(index)}
                    disabled={index === 0 || processing}
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    className="arrow-btn"
                    onClick={() => movePageDown(index)}
                    disabled={index === pages.length - 1 || processing}
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            className="save-btn"
            onClick={savePdfWithNewOrder}
            disabled={processing}
          >
            {processing ? "Processing..." : "Save & Download Reordered PDF"}
          </button>
        </>
      )}
    </div>
  );
};

export default PdfPageReorder;
