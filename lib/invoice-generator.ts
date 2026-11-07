import { jsPDF } from "jspdf";
import type { Booking } from "@/types/booking";

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
    if (y && m && d) {
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return timeStr;
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  const displayMin = m < 10 ? `0${m}` : `${m}`;
  return `${displayHour}:${displayMin} ${period}`;
}

export function generateBookingInvoice(booking: Booking): void {
  // A4 portrait: 595.28 x 841.89 points
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = 595.28;
  const leftMargin = 40;
  const rightMargin = 555.28;
  const contentWidth = rightMargin - leftMargin; // 515.28 pt

  // Calculate pricing breakdown
  const hours = booking.hours || 1;
  const totalPrice = Number(booking.totalPrice) || 0;
  const deposit = Number(booking.securityDeposit) || 0;
  const rate = hours > 0 ? Math.round((totalPrice / hours) * 100) / 100 : totalPrice;
  const grandTotal = totalPrice + deposit;

  const formattedDate = formatDisplayDate(booking.date);
  const formattedStartTime = formatTimeDisplay(booking.startTime);
  const formattedEndTime = formatTimeDisplay(booking.endTime);
  const formattedTimeRange = `${formattedStartTime} – ${formattedEndTime}`;
  const issueDate = formatDisplayDate(new Date().toISOString());

  // -------------------------------------------------------------
  // 1. BRAND HEADER
  // -------------------------------------------------------------
  // StudioSpace Brand Wordmark
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(17, 24, 39); // #111827 Charcoal
  doc.text("Studio", leftMargin, 55);

  const brandWidth = doc.getTextWidth("Studio");
  doc.setTextColor(79, 70, 229); // #4F46E5 Indigo
  doc.text("Space", leftMargin + brandWidth, 55);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128); // #6B7280 Gray
  doc.text("CREATIVE WORKSPACE & PRODUCTION STUDIO RENTALS", leftMargin, 68);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175); // #9CA3AF
  doc.text("www.studiospace.com • support@studiospace.com", leftMargin, 79);

  // Right Header: INVOICE / RECEIPT
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39);
  doc.text("BOOKING INVOICE", rightMargin, 52, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99);
  doc.text(`Invoice Ref: #${booking._id.toUpperCase()}`, rightMargin, 66, {
    align: "right",
  });
  doc.text(`Issue Date: ${issueDate}`, rightMargin, 79, { align: "right" });

  // Divider Line
  doc.setDrawColor(229, 231, 235); // #E5E7EB
  doc.setLineWidth(1);
  doc.line(leftMargin, 92, rightMargin, 92);

  // -------------------------------------------------------------
  // 2. STATUS & RESERVATION BANNER
  // -------------------------------------------------------------
  const isConfirmed = booking.status === "Confirmed";
  if (isConfirmed) {
    doc.setFillColor(240, 253, 244); // #F0FDF4 emerald-50
    doc.setDrawColor(187, 247, 208); // #BBF7D0
  } else {
    doc.setFillColor(243, 244, 246); // #F3F4F6
    doc.setDrawColor(229, 231, 235);
  }
  doc.roundedRect(leftMargin, 105, contentWidth, 38, 4, 4, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  if (isConfirmed) {
    doc.setTextColor(22, 101, 52); // #166534 emerald-800
    doc.text("✓ STATUS: CONFIRMED RESERVATION", leftMargin + 14, 122);
  } else {
    doc.setTextColor(55, 65, 81);
    doc.text(`STATUS: ${booking.status.toUpperCase()}`, leftMargin + 14, 122);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(75, 85, 99);
  doc.text(
    `Reserved for ${formattedDate} (${formattedTimeRange}) • Duration: ${hours} hour${hours === 1 ? "" : "s"}`,
    leftMargin + 14,
    134
  );

  // -------------------------------------------------------------
  // 3. TWO-COLUMN METADATA (GUEST vs STUDIO / HOST)
  // -------------------------------------------------------------
  const cardY = 155;
  const cardHeight = 82;
  const colGap = 15;
  const cardWidth = (contentWidth - colGap) / 2;

  // Left Box: Billed To / Guest Info
  doc.setFillColor(249, 250, 251); // #F9FAFB
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(leftMargin, cardY, cardWidth, cardHeight, 4, 4, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text("BILLED TO / GUEST", leftMargin + 12, cardY + 16);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(17, 24, 39);
  doc.text(booking.userName || "Studio Creator", leftMargin + 12, cardY + 33);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(75, 85, 99);
  doc.text(`Email: ${booking.userEmail}`, leftMargin + 12, cardY + 47);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text(`Booking ID: ${booking._id}`, leftMargin + 12, cardY + 62);

  // Right Box: Studio & Host Info
  const rightColX = leftMargin + cardWidth + colGap;
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(rightColX, cardY, cardWidth, cardHeight, 4, 4, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text("STUDIO & HOST DETAILS", rightColX + 12, cardY + 16);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(17, 24, 39);
  // Truncate studio title if too long to prevent overflow
  const maxTitleLength = 32;
  const displayTitle =
    booking.studioTitle.length > maxTitleLength
      ? booking.studioTitle.substring(0, maxTitleLength) + "..."
      : booking.studioTitle;
  doc.text(displayTitle, rightColX + 12, cardY + 33);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(75, 85, 99);
  doc.text(`Host: ${booking.hostEmail}`, rightColX + 12, cardY + 47);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text(`Studio ID: ${booking.studioId}`, rightColX + 12, cardY + 62);

  // -------------------------------------------------------------
  // 4. ITEMIZED CHARGES TABLE
  // -------------------------------------------------------------
  const tableY = 252;
  const tableHeaderHeight = 24;

  // Header background
  doc.setFillColor(31, 41, 55); // #1F2937 Dark Slate
  doc.roundedRect(leftMargin, tableY, contentWidth, tableHeaderHeight, 3, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("ITEM & DESCRIPTION", leftMargin + 12, tableY + 15);
  doc.text("HOURS / DURATION", leftMargin + 250, tableY + 15);
  doc.text("RATE", leftMargin + 380, tableY + 15, { align: "right" });
  doc.text("AMOUNT", rightMargin - 12, tableY + 15, { align: "right" });

  let currentY = tableY + tableHeaderHeight + 20;

  // Row 1: Studio Rental
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(17, 24, 39);
  doc.text(`${booking.studioTitle} — Production Rental`, leftMargin + 12, currentY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(
    `Date: ${formattedDate} (${formattedTimeRange})`,
    leftMargin + 12,
    currentY + 12
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81);
  doc.text(`${hours} hr${hours === 1 ? "" : "s"}`, leftMargin + 250, currentY + 5);
  doc.text(`$${rate.toFixed(2)}/hr`, leftMargin + 380, currentY + 5, {
    align: "right",
  });

  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text(`$${totalPrice.toFixed(2)}`, rightMargin - 12, currentY + 5, {
    align: "right",
  });

  currentY += 26;
  doc.setDrawColor(243, 244, 246);
  doc.line(leftMargin, currentY, rightMargin, currentY);

  // Row 2: Security Deposit (if present)
  if (deposit > 0) {
    currentY += 18;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(17, 24, 39);
    doc.text("Refundable Security Deposit", leftMargin + 12, currentY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text("Refunded post-session following inspection", leftMargin + 12, currentY + 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    doc.text("1 reservation", leftMargin + 250, currentY + 5);
    doc.text(`$${deposit.toFixed(2)}`, leftMargin + 380, currentY + 5, {
      align: "right",
    });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 24, 39);
    doc.text(`$${deposit.toFixed(2)}`, rightMargin - 12, currentY + 5, {
      align: "right",
    });

    currentY += 26;
    doc.setDrawColor(243, 244, 246);
    doc.line(leftMargin, currentY, rightMargin, currentY);
  }

  // -------------------------------------------------------------
  // 5. FINANCIAL SUMMARY TOTALS (Right-aligned)
  // -------------------------------------------------------------
  currentY += 16;
  const summaryBoxWidth = 220;
  const summaryBoxX = rightMargin - summaryBoxWidth;

  // Subtotal (Rental)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(107, 114, 128);
  doc.text("Studio Rental Subtotal:", summaryBoxX, currentY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text(`$${totalPrice.toFixed(2)}`, rightMargin - 12, currentY, {
    align: "right",
  });

  // Security Deposit
  currentY += 16;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text("Security Deposit (Refundable):", summaryBoxX, currentY);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text(`$${deposit.toFixed(2)}`, rightMargin - 12, currentY, {
    align: "right",
  });

  // Divider in summary
  currentY += 10;
  doc.setDrawColor(209, 213, 219);
  doc.line(summaryBoxX, currentY, rightMargin, currentY);
  currentY += 16;

  // Grand Total Highlight Box
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(summaryBoxX - 8, currentY - 12, summaryBoxWidth + 8, 30, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(17, 24, 39);
  doc.text("Total Amount:", summaryBoxX, currentY + 6);

  doc.setFontSize(13);
  doc.setTextColor(79, 70, 229); // Brand Indigo
  doc.text(`$${grandTotal.toFixed(2)}`, rightMargin - 12, currentY + 7, {
    align: "right",
  });

  // -------------------------------------------------------------
  // 6. SHOOT NOTES / PRODUCTION INSTRUCTIONS (If present)
  // -------------------------------------------------------------
  currentY += 45;
  if (booking.notes && booking.notes.trim()) {
    doc.setFillColor(254, 243, 199); // #FEF3C7 amber-100
    doc.setDrawColor(251, 191, 36); // #FBBF24
    doc.roundedRect(leftMargin, currentY, contentWidth, 42, 4, 4, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(146, 64, 14); // #92400E amber-800
    doc.text("GUEST SHOOT NOTES & PRODUCTION DETAILS:", leftMargin + 12, currentY + 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(120, 53, 15);
    const cleanNotes = booking.notes.trim();
    const splitNotes = doc.splitTextToSize(cleanNotes, contentWidth - 24);
    doc.text(splitNotes, leftMargin + 12, currentY + 28);

    currentY += 56;
  }

  // -------------------------------------------------------------
  // 7. POLICIES & HOST GUARANTEE
  // -------------------------------------------------------------
  const policyY = Math.max(currentY + 10, 640);
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(leftMargin, policyY, contentWidth, 74, 4, 4, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(75, 85, 99);
  doc.text("STUDIOSPACE HOST GUARANTEE & POLICIES", leftMargin + 12, policyY + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(107, 114, 128);
  const policyText =
    "• Please arrive 10-15 minutes prior to your call time for studio orientation.\n" +
    "• Respect studio equipment and leave the workspace tidy at wrap time.\n" +
    "• Security deposits are processed and released back to your original payment method within 48 hours post-session.\n" +
    "• Questions or immediate studio assistance? Reach out to your host via the contact email listed above or visit studiospace.com/help.";
  doc.text(policyText, leftMargin + 12, policyY + 29);

  // -------------------------------------------------------------
  // 8. FOOTER
  // -------------------------------------------------------------
  const footerY = 790;
  doc.setDrawColor(229, 231, 235);
  doc.line(leftMargin, footerY, rightMargin, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text(
    "StudioSpace Inc. • Seamless Studio Booking Platform • All Rights Reserved",
    leftMargin,
    footerY + 14
  );
  doc.text(
    `Invoice generated on ${new Date().toLocaleDateString("en-US")} • Page 1 of 1`,
    rightMargin,
    footerY + 14,
    { align: "right" }
  );

  // Download PDF
  const filename = `StudioSpace-Invoice-${booking._id.slice(-6).toUpperCase()}.pdf`;
  doc.save(filename);
}

