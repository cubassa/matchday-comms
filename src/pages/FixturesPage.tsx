import { useState } from "react";

import type { Fixture } from "../types/Fixture";
import type { Venue } from "../types/Venue";
import RecordDialog from "../components/RecordDialog";

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
  const [formOpen, setFormOpen] = useState(false);

  const clearForm = () => {
    setFormOpen(false);
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
    setFormOpen(true);
  };

  const addFixture = () => {
    clearForm();
    setFormOpen(true);
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
      <div className="section-heading">
        <div>
          <p className="eyebrow">Match schedule</p>
          <h2>Fixtures</h2>
        </div>
        <div className="list-heading-actions">
          <span className="item-count">
            {fixtures.length} {fixtures.length === 1 ? "match" : "matches"}
          </span>
          <button className="primary-button" onClick={addFixture}>
            Add fixture
          </button>
        </div>
      </div>

      <RecordDialog
        open={formOpen}
        title={editingId ? "Edit fixture" : "Add fixture"}
        onClose={clearForm}
      >
        <div className="record-dialog-content">
          <div className="record-dialog-heading">
            <h2>{editingId ? "Edit fixture" : "Add fixture"}</h2>
            <button
              className="dialog-close-button"
              aria-label="Close"
              onClick={clearForm}
            >
              ×
            </button>
          </div>
          <form
            className="fixture-form"
            onSubmit={(event) => {
              event.preventDefault();
              saveFixture();
            }}
          >
            <label className="fixture-field">
              <span>Match date</span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </label>

            <label className="fixture-field">
              <span>Kick-off time</span>
              <input
                type="time"
                value={kickOffTime}
                onChange={(event) =>
                  setKickOffTime(event.target.value)
                }
                required
              />
            </label>

            <label className="fixture-field">
              <span>Opposition</span>
              <input
                placeholder="e.g. Riverside FC"
                value={oppositionName}
                onChange={(event) =>
                  setOppositionName(event.target.value)
                }
                required
              />
            </label>

            <label className="fixture-field">
              <span>Opposition manager</span>
              <input
                placeholder="Manager name"
                value={oppositionManager}
                onChange={(event) =>
                  setOppositionManager(event.target.value)
                }
              />
            </label>

            <label className="fixture-field fixture-field-wide">
              <span>Venue</span>
              <select
                value={venueId}
                onChange={(event) =>
                  setVenueId(event.target.value)
                }
                required
              >
                <option value="">Select a venue</option>
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </label>

            {venues.length === 0 && (
              <p className="form-hint fixture-field-wide">
                Add a venue before creating a fixture.
              </p>
            )}

            <div className="fixture-form-actions fixture-field-wide">
              <button type="button" className="subtle-button" onClick={clearForm}>
                Cancel
              </button>
              <button type="submit" className="primary-button">
                {editingId ? "Save changes" : "Add fixture"}
              </button>
            </div>
          </form>
        </div>
      </RecordDialog>

      {fixtures.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            +
          </span>
          <h3>No fixtures yet</h3>
          <p>Add your first match above to start building the schedule.</p>
        </div>
      )}

      {fixtures.map((fixture) => {
        const venue = venues.find(
          (item) => item.id === fixture.venueId
        );

        return (
          <article className="fixture-card" key={fixture.id}>
            <div className="fixture-card-heading">
              <div>
                <p className="eyebrow">Away match</p>
                <h3>{fixture.oppositionName}</h3>
              </div>
              <span className="kickoff-badge">
                {fixture.kickOffTime}
              </span>
            </div>

            <div className="fixture-details">
              <p>
                <span>Date</span>
                <strong>{fixture.date}</strong>
              </p>
              <p>
                <span>Venue</span>
                <strong>{venue?.name ?? "Not selected"}</strong>
              </p>
              <p>
                <span>Opposition manager</span>
                <strong>
                  {fixture.oppositionManager || "Not entered"}
                </strong>
              </p>
            </div>

            <div className="fixture-card-actions">
              <button
                className="subtle-button"
                onClick={() => editFixture(fixture)}
              >
                Edit
              </button>
              <button
                className="text-button"
                onClick={() => deleteFixture(fixture.id)}
              >
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </>
  );
}
