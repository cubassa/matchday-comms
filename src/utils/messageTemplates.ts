import type { Fixture } from "../types/Fixture";
import type { Hospital } from "../types/Hospital";
import type { Venue } from "../types/Venue";
import type { Referee } from "../types/Referee";
import type { ClubProfile } from "../types/ClubProfile";
import type { MessageTemplates } from "../types/MessageTemplates";

export const DEFAULT_MESSAGE_TEMPLATES: MessageTemplates = {
  oppositionEmail:
    "Subject: Match arrangements - {{teamName}} vs {{oppositionName}}\n\nHello {{oppositionManager}},\n\nWe look forward to welcoming you on {{date}}. Kick-off is at {{kickOffTime}}.\n\nVenue: {{venueName}}\nAddress: {{venueAddress}}\n\n{{venueNotes}}\n\nPlease let us know if you have any questions.\n\n{{managerName}}\n{{clubName}}",
  refereeWhatsApp:
    "Hi {{refereeName}},\n\nJust confirming your appointment for {{oppositionName}} at {{venueName}} on {{date}}. Kick-off is {{kickOffTime}}.\n\nAddress: {{venueAddress}}\n\nThanks,\n{{managerName}}\n{{clubName}}",
};

export const MESSAGE_PLACEHOLDERS = [
  "clubName",
  "teamName",
  "managerName",
  "managerMobile",
  "managerEmail",
  "oppositionName",
  "oppositionManager",
  "oppositionManagerEmail",
  "date",
  "kickOffTime",
  "venueName",
  "venueAddress",
  "venueNotes",
  "defibrillatorLocation",
  "refereeName",
  "refereeMobile",
  "refereeNotes",
  "nearestHospital",
  "hospitalAddress",
  "hospitalPhone",
  "hospitalNotes",
] as const;

type Placeholder = (typeof MESSAGE_PLACEHOLDERS)[number];

type MatchTemplateData = {
  fixture: Fixture;
  venue: Venue | undefined;
  referee: Referee | undefined;
  hospital: Hospital | undefined;
  profile: ClubProfile;
};

function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? "";
}

export function formatMatchDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) {
    return date;
  }

  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getMessagePlaceholderValues({
  fixture,
  venue,
  referee,
  hospital,
  profile,
}: MatchTemplateData): Record<Placeholder, string> {
  return {
    clubName: profile.clubName,
    teamName: profile.teamName || profile.clubName,
    managerName: profile.managerName,
    managerMobile: profile.managerMobile,
    managerEmail: profile.managerEmail,
    oppositionName: fixture.oppositionName,
    oppositionManager: getFirstName(fixture.oppositionManager) || "there",
    oppositionManagerEmail: fixture.oppositionManagerEmail ?? "",
    date: formatMatchDate(fixture.date),
    kickOffTime: fixture.kickOffTime,
    venueName: venue?.name ?? "",
    venueAddress: venue?.address ?? "",
    venueNotes: venue?.venueNotes ?? "",
    defibrillatorLocation: venue?.defibrillatorLocation ?? "",
    refereeName: referee ? getFirstName(referee.name) || "TBC" : "TBC",
    refereeMobile: referee?.mobileNumber ?? "",
    refereeNotes: referee?.notes ?? "",
    nearestHospital: hospital?.name ?? "",
    hospitalAddress: [hospital?.address, hospital?.postcode]
      .filter(Boolean)
      .join(", "),
    hospitalPhone: hospital?.phone ?? "",
    hospitalNotes: hospital?.notes ?? "",
  };
}

export function renderMessageTemplate(
  template: string,
  values: Record<Placeholder, string>
): string {
  return template.replace(
    /{{\s*([a-zA-Z]+)\s*}}/g,
    (placeholder, key: string) =>
      Object.hasOwn(values, key)
        ? values[key as Placeholder]
        : placeholder
  );
}
