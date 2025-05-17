"use client"

import { useState } from "react"
import { FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { PackageData } from "@/types"
import { jsPDF } from "jspdf"
import QRCode from "qrcode"
import autoTable from 'jspdf-autotable'

export default function ExportPDFButton({ packageData }: { packageData: PackageData }) {
  const [isGenerating, setIsGenerating] = useState(false)

  // Helper function for status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return [40, 167, 69]; // Green
      case "in_transit": return [0, 123, 255]; // Blue
      case "in_warehouse": return [108, 117, 125]; // Gray
      case "arrived": return [23, 162, 184]; // Teal
      case "customs_check": return [253, 126, 20]; // Orange
      case "customs_hold": return [220, 53, 69]; // Red
      case "pending": return [255, 193, 7]; // Yellow
      case "exception": return [220, 53, 69]; // Red
      default: return [108, 117, 125]; // Gray
    }
  };

  // Helper function to format dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12: true
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Calculate delivery progress percentage
  const calculateProgress = (status: string): number => {
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
    
    return statusWeights[status] || 0;
  };

  const handleGeneratePDF = async () => {
    setIsGenerating(true)

    try {
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Brand colors
      const primaryColor = [0, 199, 109] as [number, number, number]; // Green primary color
      const textColor = [51, 51, 51]; // #333333
      const lightGray = [240, 240, 240]; // #f0f0f0
      const white = [255, 255, 255]; // #ffffff
      
      // Get document width for centering
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      
      // PERSONALIZED HEADER
      // Add a subtle background color to the top
      doc.setFillColor(245, 245, 245);
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      // Add a stylish accent bar at the top
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, pageWidth, 5, 'F');
      
      // Add recipient's name as a personalized greeting
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(`Hello, ${packageData.recipient?.fullName?.split(' ')[0] || 'Valued Customer'}!`, margin, 20);
      
      // Add personalized message
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Here's your tracking information for package #${packageData.tracking_number}`, margin, 30);
      
      // Current date and time on the right
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(currentDate, pageWidth - margin, 20, { align: 'right' });
      
      // Add small company logo text on the right
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Greenroute Delivery', pageWidth - margin, 30, { align: 'right' });
      
      try {
        // Generate QR code and place it on the right side of the header
        const qrCodeData = await QRCode.toDataURL(packageData.tracking_number);
        doc.addImage(qrCodeData, 'PNG', pageWidth - 40, 10, 20, 20);
      } catch (qrError) {
        console.error("QR code generation error:", qrError);
        // Continue without QR code
      }
      
      // Current position tracker - start after the header
      let yPos = 55;
      
      // SECTION: Shipping Information
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Shipping Information', margin, yPos);
      yPos += 2;
      
      // Line separator
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos + 5, pageWidth - margin, yPos + 5);
      yPos += 15;
      
      // From/To address boxes
      const addressBoxWidth = (contentWidth / 2) - 5;
      const addressBoxHeight = 40;
      
      // FROM address box
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.setFillColor(250, 250, 250); // Very light gray background
      doc.roundedRect(margin, yPos, addressBoxWidth, addressBoxHeight, 3, 3, 'FD'); // Filled with border
      
      // Color accent on top
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(margin + 5, yPos - 2, 40, 4, 'F');
      
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('FROM', margin + 5, yPos + 10);
      
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(packageData.sender?.fullName || 'Name not provided', margin + 5, yPos + 20);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(packageData.sender?.address || 'Address not provided', margin + 5, yPos + 28, {
        maxWidth: addressBoxWidth - 10
      });
      
      doc.setTextColor(100, 100, 100);
      doc.text(packageData.sender?.email || 'Email not provided', margin + 5, yPos + 38);
      
      // TO address box
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.setFillColor(250, 250, 250); // Very light gray background
      const toBoxX = margin + addressBoxWidth + 10;
      doc.roundedRect(toBoxX, yPos, addressBoxWidth, addressBoxHeight, 3, 3, 'FD'); // Filled with border
      
      // Color accent on top
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(toBoxX + 5, yPos - 2, 25, 4, 'F');
      
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('TO', toBoxX + 5, yPos + 10);
      
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text(packageData.recipient?.fullName || 'Name not provided', toBoxX + 5, yPos + 20);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(packageData.recipient?.address || 'Address not provided', toBoxX + 5, yPos + 28, {
        maxWidth: addressBoxWidth - 10
      });
      
      doc.setTextColor(100, 100, 100);
      doc.text(packageData.recipient?.email || 'Email not provided', toBoxX + 5, yPos + 38);
      
      yPos += addressBoxHeight + 15;
      
      // SECTION: Package Details
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Package Details', margin, yPos);
      yPos += 2;
      
      // Line separator
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos + 5, pageWidth - margin, yPos + 5);
      yPos += 15;
      
      // Package details table
      const tableData = [
        ['Package Type', packageData.package_type || 'Standard'],
        ['Weight', `${packageData.weight} KG`],
        ['Dimensions', `${packageData.dimensions?.width || 0} × ${packageData.dimensions?.height || 0} × ${packageData.dimensions?.length || 0} cm`],
        ['Status', getStatusText(packageData.status)],
        ['Estimated Delivery', formatDate(packageData.estimated_delivery_date)]
      ];
      
      try {
        // Use the imported autoTable function
        autoTable(doc, {
          startY: yPos,
          margin: { left: margin, right: margin },
          head: [['Property', 'Value']],
          body: tableData,
          headStyles: {
            fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245]
          },
          styles: {
            cellPadding: 5,
            fontSize: 10,
            valign: 'middle',
          },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 60 },
            1: { fontStyle: 'normal' }
          },
        });
        
        // Get the last position after the table
        yPos = (doc as any).lastAutoTable.finalY + 15;
      } catch (tableError) {
        console.error("Table generation error:", tableError);
        // Skip table and continue
        yPos += 50; // Add space where the table would have been
      }
      
      // SECTION: Delivery Progress
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Delivery Progress', margin, yPos);
      yPos += 10;
      
      // Progress bar background
      doc.setFillColor(230, 230, 230);
      doc.roundedRect(margin, yPos, contentWidth, 5, 2, 2, 'F');
      
      // Progress bar fill
      const progress = calculateProgress(packageData.status);
      const progressWidth = (contentWidth * progress) / 100;
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.roundedRect(margin, yPos, progressWidth, 5, 2, 2, 'F');
      
      // Progress labels
      yPos += 10;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      
      doc.text('Pending', margin, yPos);
      doc.text('In Transit', margin + (contentWidth * 0.5), yPos);
      doc.text('Delivered', margin + contentWidth, yPos, { align: 'right' });
      
      yPos += 15;
      
      // SECTION: Tracking History
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Tracking History', margin, yPos);
      yPos += 2;
      
      // Line separator
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos + 5, pageWidth - margin, yPos + 5);
      yPos += 15;
      
      // Prepare tracking history data
      const checkpoints = packageData.checkpoints || [];
      const trackingHistory = checkpoints.map(checkpoint => [
        formatDateTime(checkpoint.timestamp),
        checkpoint.location || checkpoint.address || 'Location not specified',
        getStatusText(checkpoint.status)
      ]);
      
      if (trackingHistory.length > 0) {
        try {
          // Use the imported autoTable function
          autoTable(doc, {
            startY: yPos,
            margin: { left: margin, right: margin },
            head: [['Date & Time', 'Location', 'Status']],
            body: trackingHistory,
            headStyles: {
              fillColor: [primaryColor[0], primaryColor[1], primaryColor[2]],
              textColor: [255, 255, 255],
              fontStyle: 'bold',
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245]
            },
            styles: {
              cellPadding: 5,
              fontSize: 9,
              valign: 'middle',
              lineWidth: 0.1,
            },
            columnStyles: {
              0: { cellWidth: 60 },
              1: { cellWidth: 70 },
              2: { cellWidth: 40 }
            },
          });
        } catch (historyTableError) {
          console.error("History table error:", historyTableError);
          // Continue without history table
        }
      } else {
        // No tracking history
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('No tracking history available', margin, yPos + 10);
      }
      
      // FOOTER SECTION
      // Add a subtle footer
      doc.setFillColor(245, 245, 245);
      doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      
      // Add accent line at the bottom
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, pageHeight - 3, pageWidth, 3, 'F');
      
      const date = new Date();
      const generatedDate = date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
      
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Greenroute Delivery', margin, pageHeight - 6);
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${generatedDate}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
      
      // Save the PDF with filename
      doc.save(`package-${packageData.tracking_number}.pdf`);

      toast({
        title: "PDF Generated Successfully",
        description: "Your tracking information PDF has been downloaded.",
      })
    } catch (error) {
      console.error("PDF generation error:", error)
      toast({
        title: "Failed to generate PDF",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
      onClick={handleGeneratePDF}
      disabled={isGenerating}
    >
      <FileDown className="h-4 w-4" />
      <span>{isGenerating ? "Generating..." : "Export PDF"}</span>
    </Button>
  )
}

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
    default: return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  }
};
