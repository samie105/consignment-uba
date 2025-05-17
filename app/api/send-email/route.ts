import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "capitalnexusonlinebanking@gmail.com",
    pass: "rdyn zyzt mvzo plds",
  },
})

// Simple email HTML template function for user confirmation
function createUserEmailHtml(senderName: string, recipientName: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Shipping Request Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
          }
          .header h1 {
            color: #333;
            font-size: 24px;
            margin: 0;
          }
          .content {
            padding: 20px;
            background-color: #f6f9fc;
            border-radius: 5px;
          }
          .footer {
            text-align: center;
            color: #888;
            font-size: 14px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Shipping Request Confirmation</h1>
          </div>
          <div class="content">
            <p>Thank you for your shipping request. We have received your submission and our team will process it shortly.</p>
            <p>A customer service representative will contact you soon with the tracking details and further information.</p>
            <p><strong>From:</strong> ${senderName}</p>
            <p><strong>To:</strong> ${recipientName}</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Detailed email HTML template function for admin notification
function createAdminEmailHtml(packageData: any, formData: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Shipping Request</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #eee;
          }
          .header h1 {
            color: #333;
            font-size: 24px;
            margin: 0;
          }
          .section {
            padding: 15px;
            margin-bottom: 15px;
            background-color: #f6f9fc;
            border-radius: 5px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
          }
          .footer {
            text-align: center;
            color: #888;
            font-size: 14px;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #eee;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table td {
            padding: 8px;
            vertical-align: top;
          }
          .label {
            font-weight: bold;
            width: 30%;
          }
          .alert {
            padding: 8px 12px;
            background-color: #f8d7da;
            color: #721c24;
            border-radius: 3px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Shipping Request</h1>
          </div>
          
          <p>A new shipping request has been submitted. Details are as follows:</p>
          
          <div class="section">
            <div class="section-title">Package Information</div>
            <table>
              <tr>
                <td class="label">Tracking Number:</td>
                <td>${packageData.tracking_number}</td>
              </tr>
              <tr>
                <td class="label">Status:</td>
                <td>${packageData.status}</td>
              </tr>
              <tr>
                <td class="label">Package Type:</td>
                <td>${packageData.package_type}</td>
              </tr>
              <tr>
                <td class="label">Weight:</td>
                <td>${packageData.weight} kg</td>
              </tr>
              <tr>
                <td class="label">Dimensions:</td>
                <td>${packageData.dimensions.length} x ${packageData.dimensions.width} x ${packageData.dimensions.height} cm</td>
              </tr>
              <tr>
                <td class="label">Service Type:</td>
                <td>${formData.serviceType}</td>
              </tr>
              ${packageData.description ? `
              <tr>
                <td class="label">Description:</td>
                <td>${packageData.description}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div class="section">
            <div class="section-title">Sender Information</div>
            <table>
              <tr>
                <td class="label">Name:</td>
                <td>${packageData.sender.full_name}</td>
              </tr>
              <tr>
                <td class="label">Email:</td>
                <td>${packageData.sender.email}</td>
              </tr>
              <tr>
                <td class="label">Phone:</td>
                <td>${packageData.sender.phone}</td>
              </tr>
              <tr>
                <td class="label">Address:</td>
                <td>${packageData.sender.address}</td>
              </tr>
            </table>
          </div>
          
          <div class="section">
            <div class="section-title">Recipient Information</div>
            <table>
              <tr>
                <td class="label">Name:</td>
                <td>${packageData.recipient.full_name}</td>
              </tr>
              <tr>
                <td class="label">Email:</td>
                <td>${packageData.recipient.email}</td>
              </tr>
              <tr>
                <td class="label">Phone:</td>
                <td>${packageData.recipient.phone}</td>
              </tr>
              <tr>
                <td class="label">Address:</td>
                <td>${packageData.recipient.address}</td>
              </tr>
            </table>
          </div>
          
          <div class="alert">
            This request requires your action. Please review and process the shipment.
          </div>
          
          <div class="footer">
            <p>This is an automated message from the Greenroute Delivery system.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, senderName, recipientName, isAdmin, packageData, formData } = body

    // Validation based on email type
    if (isAdmin) {
      if (!packageData || !formData) {
        return NextResponse.json(
          { error: "Missing package data for admin email" },
          { status: 400 }
        )
      }
    } else {
      if (!to || !subject || !senderName || !recipientName) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        )
      }
    }

    // Generate the appropriate email HTML
    const emailHtml = isAdmin 
      ? createAdminEmailHtml(packageData, formData)
      : createUserEmailHtml(senderName, recipientName)

    const mailOptions = {
      from: "capitalnexusonlinebanking@gmail.com",
      to,
      subject,
      html: emailHtml,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent successfully:", info.messageId)

    return NextResponse.json({ 
      success: true,
      messageId: info.messageId 
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to send email",
        details: JSON.stringify(error)
      },
      { status: 500 }
    )
  }
} 