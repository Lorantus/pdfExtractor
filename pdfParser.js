const PdfParser = require('pdf2json');

const parsePdf = pdfDesc => {
    const pdfParser = new PdfParser();
    pdfParser.loadPDF(pdfDesc);
    return new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", reject);
      pdfParser.on("pdfParser_dataReady", pdfData => resolve(pdfParser, pdfData));
    });
  };

module.exports = parsePdf;  