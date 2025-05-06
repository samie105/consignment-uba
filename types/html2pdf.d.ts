declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: any;
    jsPDF?: any;
    pagebreak?: { mode?: string; before?: string[]; after?: string[] };
  }

  function html2pdf(): html2pdf.Html2PdfWrapper;
  function html2pdf(element: HTMLElement | string, options?: Html2PdfOptions): html2pdf.Html2PdfWrapper;

  namespace html2pdf {
    interface Html2PdfWrapper {
      from(element: HTMLElement | string): Html2PdfWrapper;
      set(options: Html2PdfOptions): Html2PdfWrapper;
      save(): Promise<void>;
      output(type: string, options?: any): Promise<any>;
      then(callback: (pdf: any) => void): Html2PdfWrapper;
      catch(callback: (error: Error) => void): Html2PdfWrapper;
    }
  }

  export = html2pdf;
} 