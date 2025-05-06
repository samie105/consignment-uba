"use server"

import { PackageData } from '@/types';
import QRCode from 'qrcode';

// Helper function to format status text
const getStatusText = (status: string) => {
  switch (status) {
    case "in_warehouse": return "In Warehouse";
    case "in_transit": return "In Transit";
    case "delivered": return "Delivered";
    default: return status;
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

export async function generatePDF(packageData: PackageData): Promise<string> {
  try {
    // Generate QR code
    const qrCodeData = await QRCode.toDataURL(packageData.tracking_number);
    
    // Return the data needed for client-side PDF generation
    return JSON.stringify({
      qrCodeData,
      packageData: {
        trackingNumber: packageData.tracking_number,
        status: getStatusText(packageData.status),
        weight: packageData.weight,
        dimensions: packageData.dimensions,
        recipient: packageData.recipient
      }
    });
  } catch (error) {
    throw error;
  }
} 