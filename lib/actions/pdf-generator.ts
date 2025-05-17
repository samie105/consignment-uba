"use server"

import { PackageData } from '@/types';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

// Helper function to format status text
const getStatusText = (status: string) => {
  switch (status) {
    case "in_warehouse": return "In Warehouse";
    case "in_transit": return "In Transit";
    case "arrived": return "Arrived";
    case "customs_check": return "Customs Check";
    case "customs_hold": return "Customs Clearance (ON HOLD)";
    case "delivered": return "Delivered";
    case "pending": return "Pending";
    case "exception": return "Exception";
    default: return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }
};

// Helper to determine status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "#28a745"; // Green
    case "in_transit": return "#007bff"; // Blue
    case "in_warehouse": return "#6c757d"; // Gray
    case "arrived": return "#17a2b8"; // Teal
    case "customs_check": return "#fd7e14"; // Orange
    case "customs_hold": return "#dc3545"; // Red
    case "pending": return "#ffc107"; // Yellow
    case "exception": return "#dc3545"; // Red
    default: return "#6c757d"; // Gray
  }
};

// Helper function to format dates
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Not specified';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return 'Not specified';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: 'numeric', hour12: true
  });
};

// Function to calculate delivery progress percentage
const calculateProgress = (packageData: PackageData): number => {
  const statusWeights: Record<string, number> = {
    'pending': 10,
    'in_warehouse': 30,
    'in_transit': 50,
    'arrived': 70,
    'customs_check': 80,
    'customs_hold': 85,
    'delivered': 100,
    'exception': 90
  };
  
  return statusWeights[packageData.status] || 0;
};

export async function generatePDF(packageData: PackageData): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      // Generate QR code for the tracking number
      const qrCodeDataUrl = await QRCode.toDataURL(`https://Greenroute Delivery.vercel.app/tracking/${packageData.tracking_number}`, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 150
      });
      
      // Create a PDF document with built-in font
      const doc = new PDFDocument({
        size: 'A4', 
        margin: 40,
        font: 'Courier',
        info: {
          Title: `Package Tracking - ${packageData.tracking_number}`,
          Author: "Greenroute Delivery"
        }
      });
      
      // Collect chunks to return as buffer
      const chunks: Uint8Array[] = [];
      doc.on('data', chunk => chunks.push(chunk));
      
      // Return the completed PDF
      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });
      
      // Handle errors
      doc.on('error', err => {
        reject(err);
      });
      
      // Format checkpoints for display
      const checkpoints = packageData.checkpoints.map(checkpoint => ({
        ...checkpoint,
        formattedDate: formatDateTime(checkpoint.timestamp),
        statusText: getStatusText(checkpoint.status),
        statusColor: getStatusColor(checkpoint.status),
        location: checkpoint.address || checkpoint.location || 'Location not specified'
      }));
      
      // Calculate delivery progress
      const progress = calculateProgress(packageData);
      
      // --- PDF CONTENT GENERATION ---
      
      // Header section with brand color
      doc.rect(0, 0, doc.page.width, 100)
         .fill('#c70039');
      
      // Company logo (text-based for font compatibility)
      doc.circle(50, 50, 20)
         .fill('white');
      
      doc.font('Courier-Bold')
         .fontSize(16)
         .fillColor('#c70039')
         .text('D1', 45, 44);
      
      // Title
      doc.font('Courier-Bold')
         .fontSize(20)
         .fillColor('white')
         .text('PACKAGE RECEIPT', 90, 30);
      
      doc.fontSize(12)
         .text('Official Tracking Information', 90, 55);
      
      // Add QR code
      doc.image(qrCodeDataUrl, doc.page.width - 90, 20, { width: 60 });
      
      // Tracking info
      doc.fontSize(10)
         .text(`Tracking: ${packageData.tracking_number}`, doc.page.width - 190, 30);
      
      doc.text(`Shipped: ${formatDate(packageData.date_shipped)}`, doc.page.width - 190, 45);
      
      // --- SHIPPING ADDRESSES ---
      
      doc.font('Courier-Bold')
         .fontSize(14)
         .fillColor('black')
         .text('Shipping Information', 40, 120);
      
      // Line separator
      doc.moveTo(40, 140)
         .lineTo(doc.page.width - 40, 140)
         .stroke('#999');
      
      // From address
      doc.rect(40, 160, 240, 100)
         .lineWidth(1)
         .stroke('#999');
      
      // Add color bar
      doc.rect(40, 160, 4, 100)
         .fill('#c70039');
      
      doc.font('Courier-Bold')
         .fontSize(10)
         .fillColor('#c70039')
         .text('FROM', 50, 170);
      
      doc.fillColor('black')
         .text(packageData.sender.fullName || 'Name not provided', 50, 190);
      
      doc.font('Courier')
         .fontSize(10)
         .text(packageData.sender.address || 'Address not provided', 50, 210, {
           width: 220,
           lineGap: 2
         });
      
      doc.fillColor('#444')
         .text(packageData.sender.email || 'Email not provided', 50, 240);
      
      // To address
      doc.rect(310, 160, 240, 100)
         .lineWidth(1)
         .stroke('#999');
      
      // Add color bar
      doc.rect(310, 160, 4, 100)
         .fill('#c70039');
      
      doc.font('Courier-Bold')
         .fontSize(10)
         .fillColor('#c70039')
         .text('TO', 320, 170);
      
      doc.fillColor('black')
         .text(packageData.recipient.fullName || 'Name not provided', 320, 190);
      
      doc.font('Courier')
         .fontSize(10)
         .text(packageData.recipient.address || 'Address not provided', 320, 210, {
           width: 220,
           lineGap: 2
         });
      
      doc.fillColor('#444')
         .text(packageData.recipient.email || 'Email not provided', 320, 240);
      
      // --- PACKAGE DETAILS ---
      
      doc.font('Courier-Bold')
         .fontSize(14)
         .fillColor('black')
         .text('Package Details', 40, 280);
      
      // Line separator
      doc.moveTo(40, 300)
         .lineTo(doc.page.width - 40, 300)
         .stroke('#999');
      
      // Package table
      const tableData = [
        { label: 'Package Type', value: packageData.package_type || 'Standard' },
        { label: 'Weight', value: `${packageData.weight} KG` },
        { label: 'Dimensions', value: `${packageData.dimensions.width} × ${packageData.dimensions.height} × ${packageData.dimensions.length} cm` },
        { label: 'Status', value: getStatusText(packageData.status), isStatus: true },
        { label: 'Estimated Delivery', value: formatDate(packageData.estimated_delivery_date) }
      ];
      
      let yPos = 320;
      tableData.forEach((row, i) => {
        // Alternate row background
        if (i % 2 === 1) {
          doc.rect(40, yPos, doc.page.width - 80, 30)
             .fill('#f5f5f5');
        }
        
        doc.font('Courier-Bold')
           .fontSize(10)
           .fillColor('#444')
           .text(row.label, 60, yPos + 10);
        
        if (row.isStatus) {
          // Draw status badge with rounded corners
          const statusColor = getStatusColor(packageData.status);
          doc.roundedRect(doc.page.width / 2, yPos + 5, 100, 20, 5)
             .fill(statusColor);
          
          doc.font('Courier-Bold')
             .fontSize(10)
             .fillColor('white')
             .text(row.value, doc.page.width / 2 + 10, yPos + 10, {
               align: 'center',
               width: 80
             });
        } else {
          doc.font('Courier')
             .fontSize(10)
             .fillColor('black')
             .text(row.value, doc.page.width / 2, yPos + 10);
        }
        
        yPos += 30;
      });
      
      // --- PROGRESS BAR ---
      
      yPos += 20;
      doc.font('Courier-Bold')
         .fontSize(14)
         .fillColor('black')
         .text('Delivery Progress', 40, yPos);
      
      // Background bar
      yPos += 25;
      doc.roundedRect(40, yPos, doc.page.width - 80, 10, 5)
         .fill('#eee');
      
      // Progress fill
      const progressWidth = (doc.page.width - 80) * (progress / 100);
      doc.roundedRect(40, yPos, progressWidth, 10, 5)
         .fill('#c70039');
      
      // Progress labels
      yPos += 20;
      doc.font('Courier')
         .fontSize(8)
         .fillColor('#666');
      
      doc.text('Pending', 40, yPos);
      doc.text('Processing', 40 + (doc.page.width - 80) * 0.25, yPos);
      doc.text('In Transit', 40 + (doc.page.width - 80) * 0.5, yPos);
      doc.text('Arrived', 40 + (doc.page.width - 80) * 0.75, yPos);
      doc.text('Delivered', doc.page.width - 80, yPos, { align: 'right' });
      
      // --- TRACKING HISTORY ---
      
      yPos += 40;
      doc.font('Courier-Bold')
         .fontSize(14)
         .fillColor('black')
         .text('Tracking History', 40, yPos);
      
      // Line separator
      yPos += 20;
      doc.moveTo(40, yPos)
         .lineTo(doc.page.width - 40, yPos)
         .stroke('#999');
      
      // Header row
      yPos += 15;
      const colWidth1 = 150;
      const colWidth2 = 200;
      const colWidth3 = 120;
      
      doc.font('Courier-Bold')
         .fontSize(10)
         .fillColor('black')
         .text('Date & Time', 60, yPos);
      
      doc.text('Location', 60 + colWidth1, yPos);
      doc.text('Status', 60 + colWidth1 + colWidth2, yPos);
      
      yPos += 25;
      
      // Check for new page if needed
      if (yPos > 700) {
        doc.addPage();
        yPos = 60;
      }
      
      // Add checkpoint rows
      checkpoints.forEach((checkpoint, i) => {
        // Check if we need a new page
        if (yPos > 700) {
          doc.addPage();
          yPos = 60;
          
          // Repeat header on new page
          doc.font('Courier-Bold')
             .fontSize(10)
             .fillColor('black')
             .text('Date & Time', 60, yPos);
          
          doc.text('Location', 60 + colWidth1, yPos);
          doc.text('Status', 60 + colWidth1 + colWidth2, yPos);
          
          yPos += 25;
        }
        
        // Alternate row color
        if (i % 2 === 0) {
          doc.rect(40, yPos - 10, doc.page.width - 80, 40)
             .fill('#f5f5f5');
        }
        
        doc.font('Courier')
           .fontSize(9)
           .fillColor('black')
           .text(checkpoint.formattedDate, 60, yPos, {
             width: colWidth1 - 20
           });
        
        doc.text(checkpoint.location, 60 + colWidth1, yPos, {
          width: colWidth2 - 20
        });
        
        // Status badge
        const statusColor = checkpoint.statusColor;
        doc.roundedRect(60 + colWidth1 + colWidth2, yPos - 2, 90, 18, 5)
           .fill(statusColor);
        
        doc.font('Courier-Bold')
           .fontSize(8)
           .fillColor('white')
           .text(checkpoint.statusText, 60 + colWidth1 + colWidth2 + 5, yPos + 2, {
             align: 'center',
             width: 80
           });
        
        yPos += 40;
      });
      
      // --- PAYMENT SECTION ---
      
      if (packageData.payment) {
        // Check if we need a new page
        if (yPos > 700) {
          doc.addPage();
          yPos = 60;
        }
        
        yPos += 20;
        doc.font('Courier-Bold')
           .fontSize(14)
           .fillColor('black')
           .text('Payment Details', 40, yPos);
        
        // Line separator
        yPos += 20;
        doc.moveTo(40, yPos)
           .lineTo(doc.page.width - 40, yPos)
           .stroke('#999');
        
        yPos += 20;
        // Payment box
        doc.rect(40, yPos, doc.page.width - 80, 70)
           .lineWidth(1)
           .stroke('#999');
        
        // Amount
        doc.font('Courier')
           .fontSize(10)
           .fillColor('#666')
           .text('AMOUNT', 60, yPos + 15);
        
        doc.font('Courier-Bold')
           .fontSize(14)
           .fillColor('black')
           .text(`$${packageData.payment.amount ?? '-'}`, 60, yPos + 35);
        
        // Status
        doc.font('Courier')
           .fontSize(10)
           .fillColor('#666')
           .text('STATUS', 225, yPos + 15);
        
        doc.font('Courier-Bold')
           .fontSize(14)
           .fillColor('black')
           .text(packageData.payment.isPaid ? 'Paid' : 'Unpaid', 225, yPos + 35);
        
        // Method
        doc.font('Courier')
           .fontSize(10)
           .fillColor('#666')
           .text('METHOD', 390, yPos + 15);
        
        doc.font('Courier-Bold')
           .fontSize(14)
           .fillColor('black')
           .text(packageData.payment.method ?? '-', 390, yPos + 35);
        
        yPos += 90;
      }
      
      // --- NOTES SECTION ---
      
      if (packageData.description) {
        // Check if we need a new page
        if (yPos > 700) {
          doc.addPage();
          yPos = 60;
        }
        
        doc.font('Courier-Bold')
           .fontSize(14)
           .fillColor('black')
           .text('Notes', 40, yPos);
        
        // Line separator
        yPos += 20;
        doc.moveTo(40, yPos)
           .lineTo(doc.page.width - 40, yPos)
           .stroke('#999');
        
        yPos += 20;
        // Notes box
        doc.rect(40, yPos, doc.page.width - 80, 100)
           .lineWidth(1)
           .stroke('#999');
        
        doc.font('Courier')
           .fontSize(10)
           .fillColor('black')
           .text(packageData.description, 60, yPos + 15, {
             width: doc.page.width - 120,
             lineGap: 3
           });
      }
      
      // --- FOOTER ---
      
      const footerTop = doc.page.height - 40;
      
      doc.rect(0, footerTop, doc.page.width, 40)
         .fill('#c70039');
      
      const date = new Date();
      const generatedDate = date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
      
      doc.font('Courier-Bold')
         .fontSize(11)
         .fillColor('white')
         .text('Greenroute Delivery', 40, footerTop + 15);
      
      doc.font('Courier')
         .fontSize(10)
         .text(`Generated on: ${generatedDate}`, doc.page.width - 40, footerTop + 15, {
           align: 'right'
         });
      
      // Finalize the PDF
      doc.end();
      
    } catch (error) {
      console.error('PDF generation error:', error);
      reject(error);
    }
  });
} 