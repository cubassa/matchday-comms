import { jsPDF } from "jspdf";

import type { Fixture } from "../types/Fixture";
import type { Venue } from "../types/Venue";
import type { Referee } from "../types/Referee";
import type { Hospital } from "../types/Hospital";
import type { ClubProfile } from "../types/ClubProfile";
import { formatMatchDate } from "../utils/messageTemplates";

export type MatchPdfData = {
  fixture: Fixture;
  venue: Venue | undefined;
  referee: Referee | undefined;
  hospitals: Hospital[];
  profile: ClubProfile;
};

type PdfField = {
  label: string;
  value: string;
};

export function createMatchPdf({
  fixture,
  venue,
  referee,
  hospitals,
  profile,
}: MatchPdfData): jsPDF {
  const pdf = new jsPDF();
  const margin = 14;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  const lineHeight = 4.3;
  const colors = {
    green: [23, 58, 44] as const,
    accent: [46, 116, 83] as const,
    pale: [244, 248, 245] as const,
    border: [220, 230, 222] as const,
    text: [29, 49, 41] as const,
    muted: [105, 121, 111] as const,
  };

  const wrappedLines = (
    value: string,
    width: number,
    fontSize = 9,
    fontStyle: "normal" | "bold" = "normal"
  ) => {
    pdf.setFont("helvetica", fontStyle);
    pdf.setFontSize(fontSize);
    return pdf.splitTextToSize(value.trim() || "Not provided", width) as string[];
  };

  const imageFormat = (data: string): "PNG" | "JPEG" | undefined => {
    const format = data.match(/^data:image\/(png|jpe?g);base64,/i)?.[1];
    if (!format) {
      return undefined;
    }

    return format.toLowerCase() === "png" ? "PNG" : "JPEG";
  };

  const drawImageContained = (
    data: string,
    format: "PNG" | "JPEG",
    x: number,
    top: number,
    width: number,
    height: number
  ) => {
    const properties = pdf.getImageProperties(data);
    const scale = Math.min(
      width / properties.width,
      height / properties.height
    );
    const imageWidth = properties.width * scale;
    const imageHeight = properties.height * scale;
    pdf.addImage(
      data,
      format,
      x + (width - imageWidth) / 2,
      top + (height - imageHeight) / 2,
      imageWidth,
      imageHeight
    );
  };

  const clubName = profile.clubName || profile.teamName || "Club name";
  const clubDescriptionLines = profile.clubDescription.trim()
    ? wrappedLines(profile.clubDescription, pageWidth - margin * 2 - 38, 9)
    : [];
  const badgeFormat = profile.badgeImage
    ? imageFormat(profile.badgeImage)
    : undefined;
  const hasBadge = Boolean(profile.badgeImage && badgeFormat);
  const headerTextX = margin + (hasBadge ? 36 : 0);
  const headerTextWidth = pageWidth - margin - headerTextX;
  const clubNameLines = wrappedLines(clubName, headerTextWidth, 15, "bold");
  const headerHeight = Math.max(
    42,
    13 +
      clubNameLines.length * 5.5 +
      (clubDescriptionLines.length
        ? 2 + clubDescriptionLines.length * 4
        : 0) +
      5
  );

  const hospitalNameWidth = 48;
  const hospitalDetailWidth = contentWidth - hospitalNameWidth - 14;
  const hospitalFontSize = 6.3;
  const hospitalEntries = hospitals.length
    ? hospitals.map((hospital) => {
        const address = [hospital.address, hospital.postcode]
          .filter(Boolean)
          .join(", ");
        const details = [
          address,
          hospital.phone ? `Phone: ${hospital.phone}` : "",
          hospital.notes ? `Notes: ${hospital.notes}` : "",
        ]
          .filter(Boolean)
          .join(" | ");
        const nameLines = wrappedLines(
          hospital.name || "Unnamed hospital",
          hospitalNameWidth - 8,
          hospitalFontSize,
          "bold"
        );
        const detailLines = wrappedLines(
          details || "No additional details",
          hospitalDetailWidth - 8,
          hospitalFontSize
        );

        return {
          nameLines,
          detailLines,
          height: Math.max(
            5.5,
            Math.max(nameLines.length, detailLines.length) * 3.2 + 1.5
          ),
        };
      })
    : [
        {
          nameLines: [""],
          detailLines: ["No hospitals entered."],
          height: 5.5,
        },
      ];
  const hospitalDirectoryHeight =
    7 + hospitalEntries.reduce((total, entry) => total + entry.height, 0) + 3;
  const hospitalDirectoryBottom = pageHeight - margin - 3;
  const hospitalDirectoryTop =
    hospitalDirectoryBottom - hospitalDirectoryHeight;
  const contentBottom = hospitalDirectoryTop - 6;

  let y = headerHeight + 8;

  const drawPageHeader = () => {
    pdf.setFillColor(...colors.green);
    pdf.rect(0, 0, pageWidth, headerHeight, "F");

    if (hasBadge && profile.badgeImage && badgeFormat) {
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(margin, 7, 28, 28, 2, 2, "F");
      drawImageContained(
        profile.badgeImage,
        badgeFormat,
        margin + 2,
        9,
        24,
        24
      );
    }

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    clubNameLines.forEach((line, index) => {
      pdf.text(line, headerTextX, 18 + index * 5.5);
    });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    const descriptionY = 18 + clubNameLines.length * 5.5 + 2;
    clubDescriptionLines.forEach((line, index) => {
      pdf.text(line, headerTextX, descriptionY + index * 4);
    });
    pdf.setTextColor(...colors.text);
  };

  const drawContinuationHeader = () => {
    pdf.addPage();
    drawPageHeader();
    y = headerHeight + 8;
  };

  const ensureSpace = (height: number) => {
    if (y + height > contentBottom) {
      drawContinuationHeader();
    }
  };

  const addSectionHeading = (title: string) => {
    ensureSpace(13);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(...colors.accent);
    pdf.text(title, margin, y);
    y += 3;
    pdf.setDrawColor(...colors.border);
    pdf.setLineWidth(0.35);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 5;
    pdf.setTextColor(...colors.text);
  };

  const drawInfoGrid = (fields: PdfField[]) => {
    const columns = 3;
    const cellWidth = contentWidth / columns;
    const rows: PdfField[][] = [];
    for (let index = 0; index < fields.length; index += columns) {
      rows.push(fields.slice(index, index + columns));
    }

    const rowHeights = rows.map((row) => {
      const width = row.length === 1 ? contentWidth : cellWidth;
      return Math.max(
        22,
        ...row.map(
          (field) =>
            12 +
            wrappedLines(field.value, width - 8, 9).length * lineHeight
        )
      );
    });
    const gridHeight = rowHeights.reduce((total, height) => total + height, 0);
    ensureSpace(gridHeight + 4);

    const top = y;
    pdf.setFillColor(...colors.pale);
    pdf.setDrawColor(...colors.border);
    pdf.roundedRect(margin, top, contentWidth, gridHeight, 2, 2, "FD");
    let rowTop = top;

    rows.forEach((row, rowIndex) => {
      const rowHeight = rowHeights[rowIndex];
      const width = row.length === 1 ? contentWidth : cellWidth;
      if (rowIndex > 0) {
        pdf.line(margin, rowTop, pageWidth - margin, rowTop);
      }

      row.forEach((field, columnIndex) => {
        const x = margin + columnIndex * width;
        if (columnIndex > 0) {
          pdf.line(x, rowTop, x, rowTop + rowHeight);
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(7);
        pdf.setTextColor(...colors.muted);
        pdf.text(field.label.toUpperCase(), x + 4, rowTop + 6);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        pdf.setTextColor(...colors.text);
        wrappedLines(field.value, width - 8, 9).forEach((line, lineIndex) => {
          pdf.text(line, x + 4, rowTop + 12 + lineIndex * lineHeight);
        });
      });

      rowTop += rowHeight;
    });

    y = top + gridHeight + 8;
  };

  const drawVenueSummary = () => {
    const mapFormat = venue?.mapImage
      ? imageFormat(venue.mapImage)
      : undefined;
    const textWidth = contentWidth - 12;
    const columnGap = 8;
    const columnWidth = (textWidth - columnGap) / 2;
    const venueLineHeight = 3.1;
    const nameLines = wrappedLines(
      venue?.name || "Venue not selected",
      textWidth,
      11,
      "bold"
    );
    const addressLines = wrappedLines(
      venue?.address ?? "",
      columnWidth,
      8
    );
    const defibrillatorLines = wrappedLines(
      venue?.defibrillatorLocation ?? "",
      columnWidth,
      8
    );
    const venueInformation = [
      venue?.venueNotes?.replace(/(?:\r?\n){2,}/g, "\n") ||
        "No venue information has been entered.",
      venue?.mapImage && !mapFormat
        ? "The uploaded venue map format could not be embedded in this PDF."
        : "",
    ]
      .filter(Boolean)
      .join("\n");
    const informationLines = wrappedLines(venueInformation, textWidth, 8);

    let textY = 9 + nameLines.length * 5;
    textY += 2;
    const contactDetailsHeight =
      Math.max(addressLines.length, defibrillatorLines.length) *
      venueLineHeight;
    textY += 4.5 + contactDetailsHeight + 1.5;
    textY += 4.5 + informationLines.length * venueLineHeight;
    const panelHeight = Math.max(39, textY + 7);
    ensureSpace(panelHeight + 15);
    addSectionHeading("Venue");

    const top = y;
    pdf.setFillColor(...colors.pale);
    pdf.setDrawColor(...colors.border);
    pdf.roundedRect(margin, top, contentWidth, panelHeight, 2, 2, "FD");

    let cursor = top + 9;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(...colors.text);
    nameLines.forEach((line) => {
      pdf.text(line, margin + 6, cursor);
      cursor += 5;
    });
    cursor += 2;

    const drawLabel = (label: string, x: number) => {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.setTextColor(...colors.muted);
      pdf.text(label, x, cursor);
    };

    const drawLines = (lines: string[], x: number) => {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(...colors.text);
      lines.forEach((line, index) => {
        pdf.text(line, x, cursor + 4.5 + index * venueLineHeight);
      });
    };

    const addressX = margin + 6;
    const defibrillatorX = addressX + columnWidth + columnGap;
    drawLabel("ADDRESS", addressX);
    drawLabel("DEFIBRILLATOR", defibrillatorX);
    drawLines(addressLines, addressX);
    drawLines(defibrillatorLines, defibrillatorX);
    cursor += 4.5 + contactDetailsHeight + 1.5;
    drawLabel("PARKING, ACCESS & FACILITIES", addressX);
    drawLines(informationLines, addressX);

    y = top + panelHeight + 7;
  };

  const drawVenueMap = () => {
    const mapFormat = venue?.mapImage
      ? imageFormat(venue.mapImage)
      : undefined;
    if (!venue?.mapImage || !mapFormat) {
      return;
    }

    drawContinuationHeader();
    addSectionHeading("Venue map");

    const panelHeight = Math.min(170, contentBottom - y - 4);
    const top = y;
    pdf.setFillColor(...colors.pale);
    pdf.setDrawColor(...colors.border);
    pdf.roundedRect(margin, top, contentWidth, panelHeight, 2, 2, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(...colors.text);
    pdf.text(venue.name || "Venue map", margin + 7, top + 9);
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(...colors.border);
    pdf.roundedRect(
      margin + 5,
      top + 13,
      contentWidth - 10,
      panelHeight - 18,
      1,
      1,
      "FD"
    );
    drawImageContained(
      venue.mapImage,
      mapFormat,
      margin + 9,
      top + 17,
      contentWidth - 18,
      panelHeight - 26
    );
    y = top + panelHeight + 7;
  };

  const drawHospitalDirectory = () => {
    const top = hospitalDirectoryTop;
    pdf.setFillColor(...colors.pale);
    pdf.setDrawColor(...colors.border);
    pdf.roundedRect(
      margin,
      top,
      contentWidth,
      hospitalDirectoryHeight,
      2,
      2,
      "FD"
    );

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(...colors.accent);
    pdf.text("NEAREST HOSPITALS", margin + 5, top + 5);

    let rowTop = top + 7;
    hospitalEntries.forEach((entry) => {
      const detailX = margin + hospitalNameWidth + 4;
      if (rowTop > top + 7) {
        pdf.setDrawColor(...colors.border);
        pdf.line(margin + 4, rowTop, pageWidth - margin - 4, rowTop);
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(hospitalFontSize);
      pdf.setTextColor(...colors.text);
      entry.nameLines.forEach((line, index) => {
        if (line) {
          pdf.text(line, margin + 5, rowTop + 3.5 + index * 3.2);
        }
      });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(hospitalFontSize);
      entry.detailLines.forEach((line, index) => {
        pdf.text(line, detailX, rowTop + 3.5 + index * 3.2);
      });
      rowTop += entry.height;
    });
  };

  const teamName = profile.teamName || profile.clubName || "Home team";
  pdf.setProperties({
    title: `${teamName} vs ${fixture.oppositionName}`,
    subject: "Match confirmation",
    creator: profile.clubName || "Club",
  });

  drawPageHeader();
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(...colors.green);
  pdf.text(`${teamName} vs ${fixture.oppositionName}`, margin, y);
  y += 10;
  pdf.setTextColor(...colors.text);

  addSectionHeading("Match confirmation");
  drawInfoGrid([
    { label: "Date", value: formatMatchDate(fixture.date) },
    { label: "Kick-off", value: fixture.kickOffTime },
    { label: "Venue", value: venue?.name ?? "Not selected" },
    { label: "Referee", value: referee?.name ?? "TBC" },
    {
      label: "Home manager",
      value: [profile.managerName, profile.managerMobile]
        .filter(Boolean)
        .join("\n"),
    },
    { label: "Home colours", value: profile.homeColours },
  ]);

  drawVenueSummary();
  drawVenueMap();

  const pageCount = pdf.getNumberOfPages();
  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    pdf.setPage(pageNumber);
    drawHospitalDirectory();
    pdf.setDrawColor(...colors.border);
    pdf.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(...colors.muted);
    pdf.text(
      `${pageNumber} / ${pageCount}`,
      pageWidth - margin,
      pageHeight - 6,
      { align: "right" }
    );
  }

  return pdf;
}

export function downloadMatchPdf(data: MatchPdfData): void {
  const filenamePart = data.fixture.oppositionName
    .trim()
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/^-|-$/g, "");
  createMatchPdf(data).save(
    `matchday-${filenamePart || "fixture"}-${data.fixture.date}.pdf`
  );
}
