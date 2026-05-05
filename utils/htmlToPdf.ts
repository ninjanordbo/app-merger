import * as htmlToImage from "html-to-image";
import JsPDF from "jspdf";

export async function exportNodeToPdf(
  el: HTMLElement,
  filename = "document.pdf",
) {
  const dataUrl = await htmlToImage.toPng(el, { pixelRatio: 2 });

  const pdf = new JsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  });

  const imgProps = pdf.getImageProperties(dataUrl);
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let position = 0;

  if (imgHeight <= pageHeight) {
    pdf.addImage(dataUrl, "PNG", 0, position, imgWidth, imgHeight);
  } else {
    while (position < imgHeight) {
      pdf.addImage(dataUrl, "PNG", 0, position * -1, imgWidth, imgHeight);
      position += pageHeight;
      if (position < imgHeight) pdf.addPage();
    }
  }

  pdf.save(filename);
}
