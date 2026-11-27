import {
  createMatchPdf,
  type MatchPdfData,
} from "../storage/matchdayPdf";

function createPreviewMap(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 450;
  canvas.height = 300;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create the preview map.");
  }

  context.fillStyle = "#e9f0e5";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#d5e7cc";
  context.fillRect(18, 17, 125, 95);
  context.fillRect(315, 175, 115, 102);
  context.fillStyle = "#d9e8ef";
  context.fillRect(284, 14, 142, 95);

  context.lineCap = "round";
  context.strokeStyle = "#ffffff";
  context.lineWidth = 17;
  context.beginPath();
  context.moveTo(-10, 210);
  context.lineTo(145, 150);
  context.lineTo(250, 162);
  context.lineTo(465, 55);
  context.stroke();
  context.beginPath();
  context.moveTo(180, -10);
  context.lineTo(197, 135);
  context.lineTo(175, 320);
  context.stroke();

  context.strokeStyle = "#9ebf9a";
  context.lineWidth = 2;
  context.strokeRect(35, 32, 91, 64);
  context.beginPath();
  context.moveTo(80, 32);
  context.lineTo(80, 96);
  context.stroke();

  context.fillStyle = "#315d43";
  context.font = "bold 14px Segoe UI, sans-serif";
  context.fillText("RIVERSIDE PARK", 260, 142);
  context.font = "11px Segoe UI, sans-serif";
  context.fillText("SPORTS GROUND", 260, 157);

  context.fillStyle = "#bd483f";
  context.beginPath();
  context.arc(237, 163, 8, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(237, 163, 3, 0, Math.PI * 2);
  context.fill();

  return canvas.toDataURL("image/png");
}

function createPreviewBadge(): string {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create the preview badge.");
  }

  context.fillStyle = "#051735";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#f4f7fb";
  context.beginPath();
  context.moveTo(64, 12);
  context.lineTo(109, 28);
  context.lineTo(103, 82);
  context.lineTo(64, 113);
  context.lineTo(25, 82);
  context.lineTo(19, 28);
  context.closePath();
  context.fill();

  context.fillStyle = "#174b84";
  context.font = "bold 54px Georgia, serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("R", 64, 60);
  context.fillStyle = "#051735";
  context.font = "bold 12px Segoe UI, sans-serif";
  context.fillText("RFC", 64, 95);

  return canvas.toDataURL("image/png");
}

const previewData: MatchPdfData = {
  fixture: {
    id: "preview-fixture",
    date: "2026-11-22",
    kickOffTime: "10:30",
    oppositionName: "Richmond & Kew FC U15 Blues",
    oppositionManager: "Jordan Lee",
    oppositionManagerEmail: "jordan@example.test",
    venueId: "preview-venue",
    refereeId: "preview-referee",
  },
  venue: {
    id: "preview-venue",
    name: "Riverside Park Sports Ground",
    address: "Riverside Road, Richmond, London, TW10 6UZ",
    defibrillatorLocation: "Clubhouse entrance, beside the main doors",
    nearestHospitalId: "preview-hospital-one",
    venueNotes:
      "Parking is available in the main car park. Please use the north gate for team access and arrive at least 30 minutes before kick-off.",
    mapImage: createPreviewMap(),
  },
  referee: {
    id: "preview-referee",
    name: "Alex Carter",
    mobileNumber: "07700 900 321",
    notes: "",
  },
  hospitals: [
    {
      id: "preview-hospital-one",
      name: "Central General Hospital",
      address: "1 Health Way",
      postcode: "KT1 2AB",
      phone: "020 0000 0101",
      notes: "Emergency Department",
    },
    {
      id: "preview-hospital-two",
      name: "Westside Community Hospital",
      address: "22 Sample Road",
      postcode: "TW1 3CD",
      phone: "020 0000 0202",
      notes: "Urgent care entrance on the east side",
    },
  ],
  profile: {
    clubName: "Richmond Rovers FC",
    teamName: "U15 Blues",
    clubDescription: "Community football club",
    managerName: "Sam Taylor",
    managerMobile: "07700 900 123",
    managerEmail: "manager@example.test",
    homeColours: "Royal blue shirts, white shorts",
    groundsInformationText: "",
    groundsInformationUrl: "",
    badgeImage: createPreviewBadge(),
  },
};

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Missing PDF preview element: ${selector}`);
  }
  return element;
}

const previewContainer = requireElement<HTMLDivElement>("#preview");
const scenarioSelect = requireElement<HTMLSelectElement>("#scenario");
const refreshButton = requireElement<HTMLButtonElement>("#refresh");
const openPdfLink = requireElement<HTMLAnchorElement>("#open-pdf");
const status = requireElement<HTMLOutputElement>("#status");

let previewUrl: string | undefined;

const requestedScenario = new URLSearchParams(window.location.search).get(
  "scenario"
);
scenarioSelect.value =
  requestedScenario === "long-venue" || requestedScenario === "long-no-map"
    ? requestedScenario
    : "standard";

window.addEventListener(
  "pagehide",
  () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  },
  { once: true }
);

function renderPreview(): void {
  try {
    const scenario = scenarioSelect.value;
    const isLongVenueScenario =
      scenario === "long-venue" || scenario === "long-no-map";
    const venue = previewData.venue
      ? {
          ...previewData.venue,
          mapImage:
            scenario === "long-no-map"
              ? undefined
              : previewData.venue.mapImage,
          venueNotes: isLongVenueScenario
            ? Array.from(
                { length: 12 },
                (_, index) =>
                  `Facility note ${index + 1}: team parking is beside the clubhouse; use the signed north entrance and keep emergency access clear.`
              ).join("\n\n")
            : previewData.venue.venueNotes,
        }
      : undefined;
    const data = { ...previewData, venue };
    const pdf = createMatchPdf(data);
    const nextUrl = URL.createObjectURL(pdf.output("blob"));
    previewUrl = nextUrl;
    const previewFrame = document.createElement("iframe");
    previewFrame.title = "Generated match PDF preview";
    previewFrame.src = nextUrl;
    previewContainer.replaceChildren(previewFrame);
    openPdfLink.href = nextUrl;
    status.value = `${pdf.getNumberOfPages()} page${pdf.getNumberOfPages() === 1 ? "" : "s"}`;
  } catch (error) {
    status.value =
      error instanceof Error ? error.message : "PDF preview failed.";
  }
}

refreshButton.addEventListener("click", () => window.location.reload());
scenarioSelect.addEventListener("change", () => {
  const url = new URL(window.location.href);
  url.searchParams.set("scenario", scenarioSelect.value);
  window.location.assign(url);
});
renderPreview();

if (import.meta.hot) {
  import.meta.hot.accept("../storage/matchdayPdf.ts", () =>
    window.location.reload()
  );
}
