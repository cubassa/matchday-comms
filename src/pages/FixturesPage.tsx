import { useState } from "react";

import type { Fixture } from "../types/Fixture";
import type { Venue } from "../types/Venue";

type Props = {
  fixtures: Fixture[];
  venues: Venue[];
  setFixtures: (fixtures: Fixture[]) => void;
};

export default function FixturesPage({
  fixtures,
  venues,
  setFixtures,
}: Props) {
  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [date, setDate] = useState("");
  const [kickOffTime, setKickOffTime] =
    useState("");
  const [oppositionName, setOppositionName] =
    useState("");
  const [
    oppositionManager,
    setOppositionManager,
  ] = useState("");
  const [venueId, setVenueId] = useState("");

  const clearForm = () => {
    setEditingId(null);
    setDate("");
    setKickOffTime("");
    setOppositionName("");
    setOppositionManager("");
    setVenueId("");
  };

  const saveFixture = () => {
    if (
      !date ||
      !kickOffTime ||
      !oppositionName.trim() ||
      !venueId
    ) {
      return;
    }

    const fixture: Fixture = {
      id: editingId ?? crypto.randomUUID(),
      date,
      kickOffTime,
      oppositionName,
      oppositionManager,
      venueId,
    };

    if (editingId) {
      setFixtures(
        fixtures.map((item) =>
          item.id === editingId ? fixture : item
        )
      );
    } else {
      setFixtures([...fixtures, fixture]);
    }

    clearForm();
  };

  const editFixture = (fixture: Fixture) => {
    setEditingId(fixture.id);
    setDate(fixture.date);
    setKickOffTime(fixture.kickOffTime);
    setOppositionName(fixture.oppositionName);
    setOppositionManager(fixture.oppositionManager);
    setVenueId(fixture.venueId);
  };

  const deleteFixture = (id: string) => {
    if (!window.confirm("Delete this fixture?")) {
      return;
    }

    setFixtures(
      fixtures.filter((fixture) => fixture.id !== id)
    );

    if (editingId === id) {
      clearForm();
    }
  };

  return (
    <>
      <h2>{editingId ? "Edit Fixture" : "Add Fixture"}</h2>

      <div
        style={{
          display: "grid",
          gap: "0.75rem",
          marginBottom: "2rem",
        }}
      >
        <input
          type="date"
          aria-label="Fixture date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />

        <input
          type="time"
          aria-label="Kick-off time"
          value={kickOffTime}
          onChange={(event) =>
            setKickOffTime(event.target.value)
          }
        />

        <input
          placeholder="Opposition Name"
          value={oppositionName}
          onChange={(event) =>
            setOppositionName(event.target.value)
          }
        />

        <input
          placeholder="Opposition Manager"
          value={oppositionManager}
          onChange={(event) =>
            setOppositionManager(event.target.value)
          }
        />

        <select
          value={venueId}
          onChange={(event) => setVenueId(event.target.value)}
        >
          <option value="">Select venue</option>
          {venues.map((venue) => (
            <option key={venue.id} value={venue.id}>
              {venue.name}
            </option>
          ))}
        </select>

        {venues.length === 0 && (
          <p>Add a venue before creating a fixture.</p>
        )}

        <button onClick={saveFixture}>
          {editingId ? "Update Fixture" : "Add Fixture"}
        </button>

        {editingId && (
          <button onClick={clearForm}>Cancel Edit</button>
        )}
      </div>

      <h2>Fixtures</h2>

      {fixtures.length === 0 && <p>No fixtures added yet.</p>}

      {fixtures.map((fixture) => {
        const venue = venues.find(
          (item) => item.id === fixture.venueId
        );

        return (
          <div
            key={fixture.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3>{fixture.oppositionName}</h3>

            <p>
              <strong>Date:</strong> {fixture.date}
            </p>

            <p>
              <strong>Kick-off:</strong> {fixture.kickOffTime}
            </p>

            <p>
              <strong>Opposition Manager:</strong>{" "}
              {fixture.oppositionManager || "Not entered"}
            </p>

            <p>
              <strong>Venue:</strong>{" "}
              {venue?.name ?? "Not selected"}
            </p>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => editFixture(fixture)}>
                Edit
              </button>

              <button onClick={() => deleteFixture(fixture.id)}>
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}
