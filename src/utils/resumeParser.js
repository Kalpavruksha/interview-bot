// Utility functions for parsing resumes
import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import Tesseract from 'tesseract.js'

export const parseResume = async (file) => {
  console.log('Parsing resume file:', file.name, file.type, file.size);
  
  const fileType = file.type;
  
  if (fileType === 'application/pdf') {
    try {
      console.log('Attempting to parse PDF file');
      return await parsePDF(file);
    } catch (error) {
      console.warn('PDF parsing failed, trying OCR:', error);
      // Try OCR as fallback for PDFs
      try {
        return await parseWithOCR(file);
      } catch (ocrError) {
        console.error('OCR also failed:', ocrError);
        throw error; // Throw the original error
      }
    }
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    console.log('Attempting to parse DOCX file');
    return await parseDOCX(file);
  } else {
    console.warn('Unsupported file type:', fileType);
    // Try to parse based on file extension if MIME type is not recognized
    if (file.name.toLowerCase().endsWith('.pdf')) {
      console.log('Attempting to parse as PDF based on file extension');
      try {
        return await parsePDF(file);
      } catch (error) {
        console.warn('PDF parsing failed, trying OCR:', error);
        try {
          return await parseWithOCR(file);
        } catch (ocrError) {
          console.error('OCR also failed:', ocrError);
          throw error;
        }
      }
    } else if (file.name.toLowerCase().endsWith('.docx')) {
      console.log('Attempting to parse as DOCX based on file extension');
      return await parseDOCX(file);
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
  }
};

const parsePDF = async (file) => {
  try {
    console.log('Starting PDF parsing');
    // Use a CDN for the worker to avoid build issues
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.149/build/pdf.worker.min.mjs';
    
    // Load the PDF document
    const arrayBuffer = await file.arrayBuffer();
    console.log('PDF array buffer loaded, size:', arrayBuffer.byteLength);
    
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    console.log('PDF document loaded, pages:', pdf.numPages);
    
    let textContent = '';
    
    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log('Processing page', i);
      const page = await pdf.getPage(i);
      const textContentObj = await page.getTextContent();
      const pageText = textContentObj.items.map(item => item.str).join(' ');
      textContent += pageText + ' ';
      console.log('Page', i, 'text length:', pageText.length);
    }
    
    console.log('Total extracted text length:', textContent.length);
    console.log('Extracted text preview:', textContent.substring(0, 500));
    
    // Extract contact information
    const contactInfo = extractContactInfo(textContent);
    console.log('Extracted contact info:', contactInfo);
    
    return {
      ...contactInfo,
      text: textContent.trim()
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    // Fallback to basic file info extraction
    const fileName = file.name;
    const nameFromFileName = fileName.split('.')[0].replace(/[_-]/g, ' ');
    return {
      name: nameFromFileName,
      email: '',
      phone: '',
      text: `PDF file: ${fileName}`
    };
  }
};

const parseDOCX = async (file) => {
  try {
    console.log('Starting DOCX parsing');
    // Parse DOCX file using mammoth
    const arrayBuffer = await file.arrayBuffer();
    console.log('DOCX array buffer loaded, size:', arrayBuffer.byteLength);
    
    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
    console.log('DOCX parsing result:', result);
    
    const textContent = result.value;
    console.log('DOCX extracted text length:', textContent.length);
    console.log('DOCX extracted text preview:', textContent.substring(0, 500));
    
    // Extract contact information
    const contactInfo = extractContactInfo(textContent);
    console.log('Extracted contact info:', contactInfo);
    
    return {
      ...contactInfo,
      text: textContent.trim()
    };
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    // Fallback to basic file info extraction
    const fileName = file.name;
    const nameFromFileName = fileName.split('.')[0].replace(/[_-]/g, ' ');
    return {
      name: nameFromFileName,
      email: '',
      phone: '',
      text: `DOCX file: ${fileName}`
    };
  }
};

// OCR fallback using Tesseract.js
export const parseWithOCR = async (file) => {
  try {
    console.log('Starting OCR processing');
    // For image-based PDFs or other image files
    const result = await Tesseract.recognize(
      file,
      'eng',
      {
        logger: (m) => console.log('OCR progress:', m)
      }
    );
    
    console.log('OCR result:', result);
    const textContent = result.data.text;
    console.log('OCR extracted text length:', textContent.length);
    console.log('OCR extracted text preview:', textContent.substring(0, 500));
    
    // Extract contact information
    const contactInfo = extractContactInfo(textContent);
    console.log('Extracted contact info from OCR:', contactInfo);
    
    return {
      ...contactInfo,
      text: textContent.trim()
    };
  } catch (error) {
    console.error('Error performing OCR:', error);
    throw new Error('Failed to perform OCR: ' + error.message);
  }
};

// Extract contact information using regex
export const extractContactInfo = (text) => {
  console.log('Extracting contact info from text of length:', text.length);
  
  let name = '';
  
  // First, try to extract name from the very beginning of the text
  // This is often where names appear in resumes
  const lines = text.trim().split('\n');
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Check if the first line looks like a name (contains at least one space and capitalized words)
    // But make sure it's not obviously not a name (like contains "resume", "cv", "professional" etc.)
    if (firstLine && /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/.test(firstLine) && 
        !/resume|cv|curriculum|professional|summary|intern|developer|engineer/i.test(firstLine)) {
      name = firstLine;
      console.log('Found name from first line:', name);
    }
  }
  
  // Email extraction
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : '';
  if (email) console.log('Found email:', email);
  
  // Phone extraction (improved pattern)
  const phoneRegex = /(\+?\d{1,2}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : '';
  if (phone) console.log('Found phone:', phone);
  
  // If we still don't have a name but have other info, try to extract from email
  if (!name && email) {
    // Extract name from email (before @)
    const emailName = email.split('@')[0];
    // Convert dots/underscores to spaces and capitalize
    name = emailName.replace(/[._]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    console.log('Extracted name from email:', name);
  }
  
  // If we still don't have a name, use a fallback
  if (!name) {
    name = 'Candidate';
    console.log('Using default name:', name);
  }
  
  return { name, email, phone };
};