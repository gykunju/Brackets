import mammoth from 'mammoth';
import PizZip from 'pizzip';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use unpkg CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

/**
 * Extract text from a Word document (.docx)
 * @param {File|ArrayBuffer} file - Word file or ArrayBuffer
 * @returns {Promise<string>} Extracted text
 */
export async function extractTextFromWord(file) {
  try {
    const arrayBuffer = file instanceof File ? await file.arrayBuffer() : file;
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from Word document:', error);
    throw new Error('Failed to extract text from Word document');
  }
}

/**
 * Extract text from a PowerPoint presentation (.pptx)
 * @param {File|ArrayBuffer} file - PowerPoint file or ArrayBuffer
 * @returns {Promise<string>} Extracted text
 */
export async function extractTextFromPowerPoint(file) {
  try {
    const arrayBuffer = file instanceof File ? await file.arrayBuffer() : file;
    const zip = new PizZip(arrayBuffer);

    let text = '';
    const slideFiles = Object.keys(zip.files).filter(name =>
      name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
    );

    slideFiles.sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0');
      const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0');
      return numA - numB;
    });

    for (const fileName of slideFiles) {
      const slideXml = zip.files[fileName].asText();
      // Extract text between <a:t> tags
      const textMatches = slideXml.match(/<a:t>([^<]+)<\/a:t>/g);
      if (textMatches) {
        const slideText = textMatches
          .map(match => match.replace(/<\/?a:t>/g, ''))
          .join(' ');
        text += slideText + '\n\n';
      }
    }

    return text.trim() || 'No text content found in PowerPoint file';
  } catch (error) {
    console.error('Error extracting text from PowerPoint:', error);
    throw new Error('Failed to extract text from PowerPoint presentation');
  }
}

/**
 * Extract text from PDF using PDF.js
 * @param {File|ArrayBuffer} file - PDF file or ArrayBuffer
 * @returns {Promise<string>} Extracted text
 */
export async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = file instanceof File ? await file.arrayBuffer() : file;

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine all text items from the page
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');

      fullText += `\n--- Page ${pageNum} ---\n${pageText}\n`;
    }

    return fullText.trim() || 'No text content found in PDF file';
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF document');
  }
}

/**
 * Parse any supported document type
 * @param {File} file - Document file
 * @param {string} fileType - Type of file (word, powerpoint, pdf, image)
 * @returns {Promise<string>} Extracted text
 */
export async function parseDocument(file, fileType) {
  switch (fileType) {
    case 'word':
      return await extractTextFromWord(file);
    case 'powerpoint':
      return await extractTextFromPowerPoint(file);
    case 'pdf':
      return await extractTextFromPDF(file);
    case 'image':
      return 'Image content - use AI image analysis feature';
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

export default {
  extractTextFromWord,
  extractTextFromPowerPoint,
  extractTextFromPDF,
  parseDocument
};
