import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

/**
 * Convert PDF pages to base64 images
 * @param {File} file - PDF file
 * @param {number} maxPages - Maximum pages to convert (default 10 to save bandwidth)
 * @returns {Promise<string[]>} Array of base64 strings (data:image/jpeg;base64,...)
 */
export async function convertPdfToImages(file, maxPages = 10) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const pageCount = Math.min(pdf.numPages, maxPages);
    const images = [];

    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 }); // 1.5 scale for good readability
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;

      // Convert to JPEG to save space
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      images.push(base64);
    }

    return images;
  } catch (error) {
    console.error("Error converting PDF to images:", error);
    throw new Error("Failed to process PDF images.");
  }
}
