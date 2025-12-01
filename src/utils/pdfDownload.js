// Utility function for mobile-compatible PDF downloads
export const downloadPDF = (blob, filename) => {
  const url = URL.createObjectURL(blob);

  // Detect mobile devices
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isAndroid) {
    // Android Chrome has better support for downloads
    // Try using the download attribute
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);

    // Create and dispatch a proper click event
    const clickEvent = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    link.dispatchEvent(clickEvent);

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } else if (isIOS) {
    // iOS Safari doesn't support download attribute well
    // Open in new window for iOS devices
    window.open(url, "_blank");

    // Cleanup after delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  } else {
    // Desktop browsers
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }
};

// Alternative method using FileSaver-like approach for better mobile support
export const downloadPDFAlternative = (blob, filename) => {
  // Check if the browser supports the download attribute
  const supportsDownload = "download" in document.createElement("a");

  if (!supportsDownload || /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    // For iOS or browsers without download support, open in new window
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, "_blank");

    if (!newWindow) {
      // Popup blocked, try creating a link
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } else {
    // For Android and desktop browsers
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";

    document.body.appendChild(link);

    // Trigger with proper event
    const event = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    link.dispatchEvent(event);

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }
};
