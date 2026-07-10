import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { OrderResponseDTO } from "@/lib/api/types/orders.types";
import { formatDate } from "@/lib/utils/date";
import type { RGB } from "pdf-lib";

const BLACK = rgb(0, 0, 0);
const WHITE = rgb(1, 1, 1);
const GOLD = rgb(0.72, 0.53, 0.04);
const GRAY = rgb(0.42, 0.42, 0.42);
const LIGHT_GRAY = rgb(0.95, 0.95, 0.95);
const RED = rgb(0.86, 0.15, 0.15);

const M = 50;
const PW = 595.28;
const PH = 841.89;
const CW = PW - M * 2;

export async function downloadInvoicePdf(
  order: OrderResponseDTO,
  currency = "NGN",
): Promise<void> {
  const doc = await PDFDocument.create();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);

  // ── embed logo ──
  const logoUrl = "/assets/icons/Sax-Rapid-Logo1.png";
  const logoResp = await fetch(logoUrl);
  const logoBuf = await logoResp.arrayBuffer();
  const logoImage = await doc.embedPng(logoBuf);

  let page = doc.addPage([PW, PH]);
  let y = PH - 40;

  // ── black top bar with logo ──
  page.drawRectangle({ x: 0, y: PH - 40, width: PW, height: 40, color: BLACK });
  const logoAspect = logoImage.width / logoImage.height;
  const logoH = 22;
  const logoW = logoH * logoAspect;
  page.drawImage(logoImage, {
    x: M,
    y: PH - 31,
    width: logoW,
    height: logoH,
  });
  page.drawText("OFFICIAL INVOICE", {
    x: M + logoW + 8,
    y: PH - 27,
    size: 9,
    font: bold,
    color: WHITE,
  });

  y = PH - 85;

  // ── company name ──
  page.drawText("SAX RAPID", { x: M, y, size: 26, font: bold, color: BLACK });
  y -= 18;
  page.drawText("Vendor Dashboard \u2014 Invoice Generated Automatically", {
    x: M,
    y,
    size: 8,
    font: reg,
    color: GRAY,
  });
  y -= 15;

  // gold line
  page.drawLine({
    start: { x: M, y },
    end: { x: PW - M, y },
    thickness: 1,
    color: GOLD,
  });
  y -= 30;

  // ── INVOICE title + meta ──
  const invNo = order.orderNumber || order.id.slice(0, 8).toUpperCase();
  page.drawText("INVOICE", { x: M, y, size: 22, font: bold, color: BLACK });
  y -= 20;

  page.drawText(`Invoice #: INV-${invNo}`, {
    x: M,
    y,
    size: 9,
    font: reg,
    color: GRAY,
  });
  y -= 14;
  page.drawText(`Date: ${formatDate(order.createdAt)}`, {
    x: M,
    y,
    size: 9,
    font: reg,
    color: GRAY,
  });
  y -= 14;
  page.drawText(`Order #: ${invNo}`, {
    x: M,
    y,
    size: 9,
    font: reg,
    color: GRAY,
  });
  y -= 24;

  // ── BILL TO / ORDER INFO ──
  page.drawLine({
    start: { x: M, y },
    end: { x: PW - M, y },
    thickness: 0.5,
    color: LIGHT_GRAY,
  });
  y -= 18;

  const L = M;
  const R = PW / 2 + 15;

  page.drawText("BILL TO", { x: L, y, size: 10, font: bold, color: BLACK });
  page.drawText("ORDER INFO", { x: R, y, size: 10, font: bold, color: BLACK });
  y -= 16;

  const custLines = [];
  if (order.user) {
    const name = [order.user.firstName, order.user.lastName]
      .filter(Boolean)
      .join(" ");
    if (name) custLines.push(name);
    if (order.user.email) custLines.push(order.user.email);
    if (order.user.phoneNumber) custLines.push(order.user.phoneNumber);
  }
  if (!custLines.length) custLines.push("N/A");

  const leftStart = y;
  custLines.forEach((l, i) =>
    page.drawText(l, {
      x: L,
      y: leftStart - i * 13,
      size: 9,
      font: reg,
      color: GRAY,
    }),
  );

  const infoRows: [string, string, RGB][] = [
    ["Status:", order.status, order.status === "Cancelled" ? RED : GOLD],
    ["Payment:", order.paymentStatus, GRAY],
    ["Method:", order.paymentMethod, GRAY],
  ];
  infoRows.forEach(([label, value, vColor], i) => {
    page.drawText(label as string, {
      x: R,
      y: leftStart - i * 13,
      size: 9,
      font: reg,
      color: GRAY,
    });
    page.drawText(value as string, {
      x: R + 42,
      y: leftStart - i * 13,
      size: 9,
      font: bold,
      color: vColor,
    });
  });

  const colCount = Math.max(custLines.length, infoRows.length);
  y = leftStart - colCount * 13 - 14;

  // ── separator before table ──
  page.drawLine({
    start: { x: M, y },
    end: { x: PW - M, y },
    thickness: 0.5,
    color: LIGHT_GRAY,
  });
  y -= 20;

  // ── items table ──
  const checkPage = (needed: number) => {
    if (y - needed < 90) {
      page = doc.addPage([PW, PH]);
      const miniW = logoW * 0.6;
        const miniH = logoH * 0.6;
        page.drawImage(logoImage, {
          x: M,
          y: PH - 34,
          width: miniW,
          height: miniH,
        });
        page.drawText("INVOICE (continued)", {
          x: M + miniW + 6,
        y: PH - 30,
        size: 9,
        font: bold,
        color: GOLD,
      });
      y = PH - 60;
    }
  };

  const colW = [28, 192, 68, 42, 82, 82];
  const colX: number[] = [];
  let cx = M;
  colW.forEach((w) => {
    colX.push(cx);
    cx += w;
  });
  const headers = ["#", "Product", "SKU", "Qty", "Unit Price", "Total"];

  checkPage((order.items?.length || 0) * 16 + 100);

  page.drawRectangle({ x: M, y: y - 14, width: CW, height: 14, color: BLACK });
  headers.forEach((h, i) =>
    page.drawText(h, {
      x: colX[i] + 4,
      y: y - 10,
      size: 8,
      font: bold,
      color: GOLD,
    }),
  );
  y -= 18;

  (order.items || []).forEach((item, idx) => {
    checkPage(30);
    const bg = idx % 2 ? LIGHT_GRAY : WHITE;
    page.drawRectangle({ x: M, y: y - 14, width: CW, height: 14, color: bg });

    const vals = [
      (idx + 1).toString(),
      item.productName || "Product",
      item.productSKU || "\u2014",
      item.quantity.toString(),
      `${currency} ${item.unitPrice.toLocaleString()}`,
      `${currency} ${item.totalPrice.toLocaleString()}`,
    ];
    vals.forEach((v, i) =>
      page.drawText(v, {
        x: colX[i] + 4,
        y: y - 10,
        size: 8,
        font: reg,
        color: rgb(0.2, 0.2, 0.2),
      }),
    );
    y -= 16;
  });

  page.drawLine({
    start: { x: M, y },
    end: { x: PW - M, y },
    thickness: 0.5,
    color: LIGHT_GRAY,
  });
  y -= 16;

  // ── totals ──
  checkPage(130);

  const tx = PW - M - 180;
  const tvx = PW - M;

  const rows: [string, number, RGB][] = [
    ["Subtotal", order.subTotal, GRAY],
    ["Shipping", order.shippingFee, GRAY],
    ["Tax", order.taxAmount, GRAY],
  ];
  if (order.discountAmount > 0)
    rows.push(["Discount", -order.discountAmount, RED]);
  rows.push(["Total", order.totalAmount, BLACK]);

  rows.forEach(([label, value, color]) => {
    const isTot = label === "Total";
    page.drawText(label, {
      x: tx,
      y,
      size: isTot ? 13 : 10,
      font: isTot ? bold : reg,
      color,
    });
    const valStr = `${currency} ${Math.abs(value).toLocaleString()}`;
    const valW = (isTot ? bold : reg).widthOfTextAtSize(
      valStr,
      isTot ? 13 : 10,
    );
    page.drawText(valStr, {
      x: tvx - valW,
      y,
      size: isTot ? 13 : 10,
      font: isTot ? bold : reg,
      color,
    });
    y -= isTot ? 24 : 16;
  });

  y -= 16;

  // ── footer ──
  checkPage(60);
  page.drawLine({
    start: { x: M, y },
    end: { x: PW - M, y },
    thickness: 0.5,
    color: LIGHT_GRAY,
  });
  y -= 18;
  page.drawText("Thank you for your business!", {
    x: M,
    y,
    size: 9,
    font: reg,
    color: GRAY,
  });
  y -= 14;
  page.drawText(`Generated on ${new Date().toISOString().split("T")[0]}`, {
    x: M,
    y,
    size: 8,
    font: reg,
    color: GRAY,
  });

  // ── save & download ──
  const pdfBytes = await doc.save();
  const blob = new Blob([pdfBytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `invoice-${invNo}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
