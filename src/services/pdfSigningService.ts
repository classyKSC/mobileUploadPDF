import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

/**
 * Mock server function that simulates PDF signing
 * This function adds a digital signature watermark to the PDF
 */

export async function signPDF(file: File): Promise<Blob> {
  // Simulate network delay (mock server processing time)
  await new Promise(resolve => setTimeout(resolve, 1500))

  try {
    // Read the PDF file
    const arrayBuffer = await file.arrayBuffer()
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    
    // Get all pages
    const pages = pdfDoc.getPages()
    
    // Get or create fonts for the signature (embed once, use many times)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    
    // Add signature watermark to each page
    pages.forEach((page) => {
      const { width } = page.getSize()
      
      // Add signature text in bottom right corner
      page.drawText('DIGITALLY SIGNED', {
        x: width - 150,
        y: 30,
        size: 10,
        font: boldFont,
        color: rgb(0.2, 0.4, 0.8),
      })
      
      // Add timestamp
      const timestamp = new Date().toLocaleString()
      page.drawText(timestamp, {
        x: width - 150,
        y: 15,
        size: 8,
        font: regularFont,
        color: rgb(0.5, 0.5, 0.5),
      })
      
      // Add signature line
      page.drawLine({
        start: { x: width - 150, y: 40 },
        end: { x: width - 20, y: 40 },
        thickness: 1,
        color: rgb(0.2, 0.4, 0.8),
      })
    })
    
    // Save the PDF as a blob
    const pdfBytes = await pdfDoc.save()
    // Ensure we pass an ArrayBuffer instead of a Uint8Array to Blob constructor
    return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })

  } catch (error) {
    console.error('Error signing PDF:', error)
    throw new Error('Failed to sign PDF. Please ensure the file is a valid PDF.')
  }
}

