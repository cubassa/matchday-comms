import { useState } from "react";

import HospitalsPage from "./pages/HospitalsPage";
import VenuesPage from "./pages/VenuesPage";

import type { Hospital } from "./types/Hospital";
import type { Venue } from "./types/Venue";

import {
  loadData,
  saveData,
} from "./storage/storage";

const VENUE_STORAGE_KEY =
  "hrbyfc-venues";

const HOSPITAL_STORAGE_KEY =
  "hrbyfc-hospitals";

function App() {
  const [page, setPage] = useState<
    "venues" | "hospitals"
  >("venues");

  const [venues, setVenues] = useState<
    Venue[]
  >(() =>
    loadData(VENUE_STORAGE_KEY, [])
  );

  const [hospitals, setHospitals] =
    useState<Hospital[]>(() =>
      loadData(HOSPITAL_STORAGE_KEY, [])
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

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1>HRBYFC Fixture Tool</h1>

      <div
        style={{
          display: "flex",
          gap: "1rem",
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
      </div>

      {page === "venues" && (
        <VenuesPage
          venues={venues}
          hospitals={hospitals}
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
    </div>
  );
}

export default App;