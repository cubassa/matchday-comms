import {
  useState,
  type ChangeEvent,
} from "react";

import HospitalsPage from "./pages/HospitalsPage";
import VenuesPage from "./pages/VenuesPage";
import RefereesPage from "./pages/RefereesPage";
import ClubProfilePage from "./pages/ClubProfilePage";
import FixturesPage from "./pages/FixturesPage";

import type { Hospital } from "./types/Hospital";
import type { Venue } from "./types/Venue";
import type { Referee } from "./types/Referee";
import type { ClubProfile } from "./types/ClubProfile";
import type { Fixture } from "./types/Fixture";
import type { MessageTemplates } from "./types/MessageTemplates";
import { DEFAULT_MESSAGE_TEMPLATES } from "./utils/messageTemplates";

import {
  loadData,
  saveData,
} from "./storage/storage";

import {
  downloadBackup,
  importBackup,
} from "./storage/backup";

const VENUE_STORAGE_KEY =
  "matchday-comms-venues";

const HOSPITAL_STORAGE_KEY =
  "matchday-comms-hospitals";

const REFEREE_STORAGE_KEY =
  "matchday-comms-referees";

const CLUB_PROFILE_STORAGE_KEY =
  "matchday-comms-club-profile";

const FIXTURE_STORAGE_KEY =
  "matchday-comms-fixtures";

const MESSAGE_TEMPLATES_STORAGE_KEY =
  "matchday-comms-message-templates";

const DEFAULT_PROFILE: ClubProfile = {
  clubName: "",
  teamName: "",
  clubDescription: "",

  managerName: "",
  managerMobile: "",
  managerEmail: "",

  homeColours: "",

  groundsInformationText: "",
  groundsInformationUrl: "",

  badgeImage: "",
};

function App() {
  const [page, setPage] = useState<
    | "venues"
    | "hospitals"
    | "referees"
    | "profile"
    | "fixtures"
  >("venues");

  const [venues, setVenues] =
    useState<Venue[]>(() =>
      loadData(
        VENUE_STORAGE_KEY,
        []
      )
    );

  const [hospitals, setHospitals] =
    useState<Hospital[]>(() =>
      loadData(
        HOSPITAL_STORAGE_KEY,
        []
      )
    );

  const [referees, setReferees] =
    useState<Referee[]>(() =>
      loadData(
        REFEREE_STORAGE_KEY,
        []
      )
    );

  const [clubProfile, setClubProfile] =
    useState<ClubProfile>(() =>
      loadData(
        CLUB_PROFILE_STORAGE_KEY,
        DEFAULT_PROFILE
      )
    );

  const [fixtures, setFixtures] =
    useState<Fixture[]>(() =>
      loadData(
        FIXTURE_STORAGE_KEY,
        []
      )
    );

  const [messageTemplates, setMessageTemplates] =
    useState<MessageTemplates>(() =>
      loadData(
        MESSAGE_TEMPLATES_STORAGE_KEY,
        DEFAULT_MESSAGE_TEMPLATES
      )
    );

  const updateVenues = (
    data: Venue[]
  ) => {
    setVenues(data);

    saveData(
      VENUE_STORAGE_KEY,
      data
    );
  };

  const updateHospitals = (
    data: Hospital[]
  ) => {
    setHospitals(data);

    saveData(
      HOSPITAL_STORAGE_KEY,
      data
    );
  };

  const updateReferees = (
    data: Referee[]
  ) => {
    setReferees(data);

    saveData(
      REFEREE_STORAGE_KEY,
      data
    );
  };

  const updateClubProfile = (
    profile: ClubProfile
  ) => {
    setClubProfile(profile);

    saveData(
      CLUB_PROFILE_STORAGE_KEY,
      profile
    );
  };

  const updateFixtures = (
    data: Fixture[]
  ) => {
    setFixtures(data);

    saveData(
      FIXTURE_STORAGE_KEY,
      data
    );
  };

  const updateMessageTemplates = (
    templates: MessageTemplates
  ) => {
    setMessageTemplates(templates);

    saveData(
      MESSAGE_TEMPLATES_STORAGE_KEY,
      templates
    );
  };

  const exportData = () => {
    downloadBackup({
      venues,
      hospitals,
      referees,
      clubProfile,
      fixtures,
      messageTemplates,
    });
  };

  const handleImport = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const data =
        await importBackup(file);

      updateVenues(
        data.venues ?? []
      );

      updateHospitals(
        data.hospitals ?? []
      );

      updateReferees(
        data.referees ?? []
      );

      updateClubProfile(
        data.clubProfile ??
          DEFAULT_PROFILE
      );

      updateMessageTemplates(
        data.messageTemplates ?? DEFAULT_MESSAGE_TEMPLATES
      );

      updateFixtures(
        data.fixtures ?? []
      );

      alert(
        "Data imported successfully."
      );
    } catch {
      alert(
        "Invalid backup file."
      );
    }

    event.target.value = "";
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            MC
          </div>
          <div>
            <p className="eyebrow">Matchday operations</p>
            <h1>Matchday Comms</h1>
          </div>
        </div>
        <p className="app-intro">
          Generate consistent matchday communications for your team.
        </p>
      </header>

      <div className="workspace-bar">
        <nav className="page-navigation" aria-label="Main navigation">
          <button
            className={page === "fixtures" ? "nav-button active" : "nav-button"}
            aria-current={page === "fixtures" ? "page" : undefined}
            onClick={() => setPage("fixtures")}
          >
            Fixtures
          </button>
          <button
            className={page === "venues" ? "nav-button active" : "nav-button"}
            aria-current={page === "venues" ? "page" : undefined}
            onClick={() => setPage("venues")}
          >
            Venues
          </button>
          <button
            className={page === "hospitals" ? "nav-button active" : "nav-button"}
            aria-current={page === "hospitals" ? "page" : undefined}
            onClick={() => setPage("hospitals")}
          >
            Hospitals
          </button>
          <button
            className={page === "referees" ? "nav-button active" : "nav-button"}
            aria-current={page === "referees" ? "page" : undefined}
            onClick={() => setPage("referees")}
          >
            Referees
          </button>
          <button
            className={page === "profile" ? "nav-button active" : "nav-button"}
            aria-current={page === "profile" ? "page" : undefined}
            onClick={() => setPage("profile")}
          >
            Profile & Templates
          </button>
        </nav>

        <div className="data-actions">
          <button className="utility-button" onClick={exportData}>
            Export Data
          </button>
          <label className="utility-button import-button">
            Import Data
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>

      <main className="page-panel">
        <div className="page-content">
          {page === "venues" && (
            <VenuesPage
              venues={venues}
              hospitals={hospitals}
              setVenues={updateVenues}
            />
          )}

          {page === "hospitals" && (
            <HospitalsPage
              hospitals={hospitals}
              setHospitals={updateHospitals}
            />
          )}

          {page === "referees" && (
            <RefereesPage
              referees={referees}
              setReferees={updateReferees}
            />
          )}

          {page === "profile" && (
            <ClubProfilePage
              profile={clubProfile}
              setProfile={updateClubProfile}
              templates={messageTemplates}
              setTemplates={updateMessageTemplates}
            />
          )}

          {page === "fixtures" && (
            <FixturesPage
              fixtures={fixtures}
              venues={venues}
              referees={referees}
              hospitals={hospitals}
              profile={clubProfile}
              templates={messageTemplates}
              setFixtures={updateFixtures}
            />
          )}
        </div>
      </main>

    </div>
  );
}

export default App;