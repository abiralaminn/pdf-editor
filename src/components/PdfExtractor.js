import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import "./PdfExtractor.css";

const PdfExtractor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [extracting, setExtracting] = useState(false);
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

  const extractPage = async (pageNumber) => {
    if (!selectedFile) return;

    setExtracting(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdf, [pageNumber - 1]);
      newPdf.addPage(copiedPage);

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Mobile-compatible download
      const link = document.createElement("a");
      link.href = url;
      link.download = `page-${pageNumber}.pdf`;
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
    } catch (error) {
      console.error("Error extracting page:", error);
      showNotification("Error extracting page. Please try again.", "error");
    } finally {
      setExtracting(false);
    }
  };

  const extractAllPages = async () => {
    if (!selectedFile) return;

    setExtracting(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const totalPages = pdf.getPageCount();

      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(copiedPage);

        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        // Mobile-compatible download
        const link = document.createElement("a");
        link.href = url;
        link.download = `page-${i + 1}.pdf`;
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
        await new Promise((resolve) => setTimeout(resolve, 300));
        URL.revokeObjectURL(url);

        // Delay between downloads
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      showNotification("All pages extracted successfully! 🎉", "success");
    } catch (error) {
      console.error("Error extracting pages:", error);
      showNotification("Error extracting pages. Please try again.", "error");
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="pdf-extractor">
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
      <h2>Extract PDF Pages</h2>
      <div className="upload-section">
        <label htmlFor="extract-upload" className="upload-label">
          <span className="upload-icon">📄</span>
          Select PDF File
        </label>
        <input
          id="extract-upload"
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

      {pageCount > 0 && (
        <>
          <div className="action-section">
            <button
              className="extract-all-btn"
              onClick={extractAllPages}
              disabled={extracting}
            >
              {extracting ? "Extracting..." : "Download All Pages Separately"}
            </button>
          </div>

          <div className="pages-grid">
            <h3>Or download individual pages:</h3>
            <div className="page-buttons">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    className="page-btn"
                    onClick={() => extractPage(pageNum)}
                    disabled={extracting}
                  >
                    Page {pageNum}
                  </button>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PdfExtractor;
