import React from 'react'
import html2pdf from "html2pdf.js"
import { useRef } from "react"
import { Button } from './ui/button'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'



export default function Printclient({packageData,params}:{packageData:any,params:any}) {
    const receiptRef = useRef<HTMLDivElement>(null)

    const downloadPdf = () => {
      if (receiptRef.current) {
        const element = receiptRef.current
        const opt = {
          margin: [10, 10, 10, 10] as [number, number, number, number],
          filename: `DeliveryUno-Receipt-${packageData.tracking_number}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        }
  
        html2pdf().set(opt).from(element).save()
      }
    }
  return (
    <div>
        <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" asChild className="print:hidden">
              <Link href={`/admin/packages/${params.id}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">Package Receipt</h1>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => window.print()} className="print:hidden">
              Print
            </Button>
            <Button onClick={downloadPdf} className="print:hidden">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div ref={receiptRef} className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="border-t border-b py-4 mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">DeliveryUno</h2>
              <p className="text-muted-foreground">Your Trusted Delivery Partner</p>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-12 pt-4 border-t">
            <p>Thank you for choosing DeliveryUno for your shipping needs.</p>
            <p>For any inquiries, please contact support@deliveryuno.com</p>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block border-t border-dashed w-full pt-2 text-xs text-muted-foreground">
              <p>This is an official receipt from DeliveryUno</p>
              <p>Document generated on {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  )
}
