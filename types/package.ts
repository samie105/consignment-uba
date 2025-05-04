export interface Package {
  tracking_number: string
  status: 'pending' | 'in_transit' | 'delivered'
  sender: {
    fullName: string
    // Add other sender fields as needed
  }
  recipient: {
    fullName: string
    // Add other recipient fields as needed
  }
  // Add other package fields as needed
} 