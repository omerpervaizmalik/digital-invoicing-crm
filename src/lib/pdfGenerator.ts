import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { FbrResponse } from './fbrTypes';

/**
 * Generates an FBR-compliant 1.0x1.0 inch PDF with a Version 2.0 QR Code
 * and the FBR Digital Invoicing System Logo placeholder.
 * 
 * FBR Requirements:
 * - Dimensions: 1.0 x 1.0 Inch
 * - QR Code Version: 2.0 (25x25 matrix)
 */
export async function generateFbrInvoicePdf(invoiceNumber: string, dateStr: string): Promise<string> {
  // 1 inch = 72 points in PDF units
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [1.0, 1.0],
  });

  // Generate QR Code data URL
  // We constrain the version to 2 (25x25) as per FBR rules
  const qrDataUrl = await QRCode.toDataURL(invoiceNumber, {
    version: 2,
    errorCorrectionLevel: 'M',
    margin: 1,
  });

  // Background and Layout
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 1.0, 1.0, 'F');

  // Insert QR Code (Size: 0.6 x 0.6 inch, positioned in top-center)
  doc.addImage(qrDataUrl, 'PNG', 0.2, 0.05, 0.6, 0.6);

  // FBR Logo Placeholder / Text
  doc.setFontSize(5);
  doc.setTextColor(0, 102, 51); // FBR Green-ish
  doc.setFont('helvetica', 'bold');
  doc.text('FBR DIGITAL', 0.5, 0.75, { align: 'center' });
  
  doc.setFontSize(3.5);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('INVOICING SYSTEM', 0.5, 0.82, { align: 'center' });

  // Add the tiny invoice number below it
  doc.setFontSize(3);
  doc.setTextColor(100, 100, 100);
  doc.text(invoiceNumber, 0.5, 0.92, { align: 'center' });

  // Output as a Data URL so it can be previewed or downloaded in the browser
  return doc.output('datauristring');
}
