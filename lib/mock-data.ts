export const mockPackageData = {
  id: "DU9876543210",
  tracking_number: "DU9876543210",
  status: "In Transit",
  estimatedDelivery: "2023-12-15",
  origin: "New York, NY",
  destination: "Los Angeles, CA",
  senderName: "John Doe",
  senderAddress: "123 Main St, New York, NY 10001",
  recipientName: "Jane Smith",
  recipientAddress: "456 Oak Ave, Los Angeles, CA 90001",
  weight: "5.2 kg",
  dimensions: "30 x 20 x 15 cm",
  service: "Express",
  current_location: {
    lat: 39.7392,
    lng: -104.9903,
    address: "Denver, CO",
    timestamp: "2023-12-10T14:30:00Z",
  },
  checkpoints: [
    {
      id: "cp1",
      location: "New York, NY",
      timestamp: "2023-12-05T09:00:00Z",
      status: "Picked Up",
      description: "Package picked up from sender",
      coordinates: {
        lat: 40.7128,
        lng: -74.006,
      },
    },
    {
      id: "cp2",
      location: "Columbus, OH",
      timestamp: "2023-12-07T15:20:00Z",
      status: "In Transit",
      description: "Package arrived at sorting facility",
      coordinates: {
        lat: 39.9612,
        lng: -82.9988,
      },
    },
    {
      id: "cp3",
      location: "Denver, CO",
      timestamp: "2023-12-10T14:30:00Z",
      status: "In Transit",
      description: "Package in transit to destination",
      coordinates: {
        lat: 39.7392,
        lng: -104.9903,
      },
    },
  ],
  images: [
    {
      id: "img1",
      url: "/placeholder.svg?height=300&width=400",
      caption: "Package at pickup",
    },
    {
      id: "img2",
      url: "/placeholder.svg?height=300&width=400",
      caption: "Package at sorting facility",
    },
  ],
}
