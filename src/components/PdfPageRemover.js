import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import "./PdfPageRemover.css";

const PdfPageRemover = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagesToRemove, setPagesToRemove] = useState(new Set());
  const [processing, setProcessing] = useState(false);
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
      setPagesToRemove(new Set());
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        setPageCount(pdf.getPageCount());
      } catch (error) {
        console.error("Error loading PDF:", error);
        showNotification(
          "Error loading PDF. Please make sure the file is a valid PDF document.",
          "error"
        );
      }
    }
  };

  const togglePageSelection = (pageNumber) => {
    const newPagesToRemove = new Set(pagesToRemove);
    if (newPagesToRemove.has(pageNumber)) {
      newPagesToRemove.delete(pageNumber);
    } else {
      newPagesToRemove.add(pageNumber);
    }
    setPagesToRemove(newPagesToRemove);
  };

  const selectAllPages = () => {
    const allPages = new Set();
    for (let i = 1; i <= pageCount; i++) {
      allPages.add(i);
    }
    setPagesToRemove(allPages);
  };

  const deselectAllPages = () => {
    setPagesToRemove(new Set());
  };

  const removeSelectedPages = async () => {
    if (!selectedFile) return;

    if (pagesToRemove.size === 0) {
      showNotification("Please select at least one page to remove", "error");
      return;
    }

    if (pagesToRemove.size === pageCount) {
      showNotification(
        "Cannot remove all pages. PDF must have at least one page.",
        "error"
      );
      return;
    }

    setProcessing(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      // Copy pages that are NOT in the remove list
      const pagesToKeep = [];
      for (let i = 0; i < pageCount; i++) {
        if (!pagesToRemove.has(i + 1)) {
          pagesToKeep.push(i);
        }
      }

      const copiedPages = await newPdf.copyPages(pdf, pagesToKeep);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Mobile-compatible download
      const link = document.createElement("a");
      link.href = url;
      link.download = `modified-${selectedFile.name}`;
      link.style.display = "none";
      document.body.appendChild(link);

      // Trigger download with proper event for mobile
      if (navigator.userAgent.match(/iPad|iPhone|Android/i)) {
        link.click();
        // For iOS, also try opening in new window as fallback
        setTimeout(() => {
          window.open(url, "_blank");
        }, 100);
      } else {
        link.click();
      }

      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);

      showNotification(
        `PDF created successfully! Removed ${pagesToRemove.size} page${
          pagesToRemove.size > 1 ? "s" : ""
        } 🎉`,
        "success"
      );

      // Reset selections
      setPagesToRemove(new Set());
    } catch (error) {
      console.error("Error removing pages:", error);
      showNotification("Error removing pages. Please try again.", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="pdf-page-remover">
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
      <h2>Remove PDF Pages</h2>
      <div className="upload-section">
        <label htmlFor="remove-upload" className="upload-label">
          <span className="upload-icon">🗑️</span>
          Select PDF File
        </label>
        <input
          id="remove-upload"
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
          {pagesToRemove.size > 0 && (
            <p className="pages-selected">
              <strong>Pages to remove:</strong> {pagesToRemove.size} selected
            </p>
          )}
        </div>
      )}

      {pageCount > 0 && (
        <>
          <div className="selection-controls">
            <button
              className="control-btn"
              onClick={selectAllPages}
              disabled={processing}
            >
              Select All
            </button>
            <button
              className="control-btn"
              onClick={deselectAllPages}
              disabled={processing}
            >
              Deselect All
            </button>
          </div>

          <div className="pages-grid">
            <h3>Click pages to mark for removal:</h3>
            <div className="page-buttons">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    className={`page-btn ${
                      pagesToRemove.has(pageNum) ? "selected" : ""
                    }`}
                    onClick={() => togglePageSelection(pageNum)}
                    disabled={processing}
                  >
                    <span className="page-number">Page {pageNum}</span>
                    {pagesToRemove.has(pageNum) && (
                      <span className="remove-icon">✕</span>
                    )}
                  </button>
                )
              )}
            </div>
          </div>

          {pagesToRemove.size > 0 && (
            <div className="action-section">
              <button
                className="remove-pages-btn"
                onClick={removeSelectedPages}
                disabled={processing}
              >
                {processing
                  ? "Processing..."
                  : `Remove ${pagesToRemove.size} Page${
                      pagesToRemove.size > 1 ? "s" : ""
                    } & Download`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PdfPageRemover;
