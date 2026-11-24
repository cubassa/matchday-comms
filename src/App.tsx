import {
  useState,
  type ChangeEvent,
} from "react";

import HospitalsPage from "./pages/HospitalsPage";
import VenuesPage from "./pages/VenuesPage";
import RefereesPage from "./pages/RefereesPage";
import ClubProfilePage from "./pages/ClubProfilePage";

import type { Hospital } from "./types/Hospital";
import type { Venue } from "./types/Venue";
import type { Referee } from "./types/Referee";
import type { ClubProfile } from "./types/ClubProfile";

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

  const exportData = () => {
    downloadBackup({
      venues,
      hospitals,
      referees,
      clubProfile,
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
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1>Matchday Comms</h1>

      <p>
        Enter fixture details once and
        generate consistent matchday
        communications.
      </p>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        <button
          onClick={() =>
            setPage("venues")
          }
        >
          Venues
        </button>

        <button
          onClick={() =>
            setPage("hospitals")
          }
        >
          Hospitals
        </button>

        <button
          onClick={() =>
            setPage("referees")
          }
        >
          Referees
        </button>

        <button
          onClick={() =>
            setPage("profile")
          }
        >
          Club Profile
        </button>

        <button
          onClick={exportData}
        >
          Export Data
        </button>

        <label
          style={{
            border:
              "1px solid #ccc",
            padding:
              "0.4rem 0.8rem",
            cursor: "pointer",
            borderRadius:
              "4px",
          }}
        >
          Import Data

          <input
            type="file"
            accept=".json"
            onChange={
              handleImport
            }
            style={{
              display: "none",
            }}
          />
        </label>
      </div>

      {page === "venues" && (
        <VenuesPage
          venues={venues}
          hospitals={hospitals}
          setVenues={
            updateVenues
          }
        />
      )}

      {page === "hospitals" && (
        <HospitalsPage
          hospitals={hospitals}
          setHospitals={
            updateHospitals
          }
        />
      )}

      {page === "referees" && (
        <RefereesPage
          referees={referees}
          setReferees={
            updateReferees
          }
        />
      )}

      {page === "profile" && (
        <ClubProfilePage
          profile={
            clubProfile
          }
          setProfile={
            updateClubProfile
          }
        />
      )}
    </div>
  );
}

export default App;