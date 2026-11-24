import { useState } from "react";

import type { Venue } from "../types/Venue";
import type { Hospital } from "../types/Hospital";

type Props = {
  venues: Venue[];
  hospitals: Hospital[];
  setVenues: (venues: Venue[]) => void;
};

export default function VenuesPage({
  venues,
  hospitals,
  setVenues,
}: Props) {
  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [
    defibrillatorLocation,
    setDefibrillatorLocation,
  ] = useState("");
  const [
    nearestHospitalId,
    setNearestHospitalId,
  ] = useState("");
  const [venueNotes, setVenueNotes] =
    useState("");

  const clearForm = () => {
    setEditingId(null);

    setName("");
    setAddress("");
    setDefibrillatorLocation("");
    setNearestHospitalId("");
    setVenueNotes("");
  };

  const saveVenue = () => {
    if (!name.trim()) {
      return;
    }

    const venue: Venue = {
      id: editingId ?? crypto.randomUUID(),
      name,
      address,
      defibrillatorLocation,
      nearestHospitalId,
      venueNotes,
    };

    if (editingId) {
      setVenues(
        venues.map((v) =>
          v.id === editingId ? venue : v
        )
      );
    } else {
      setVenues([...venues, venue]);
    }

    clearForm();
  };

  const editVenue = (venue: Venue) => {
    setEditingId(venue.id);

    setName(venue.name);
    setAddress(venue.address);
    setDefibrillatorLocation(
      venue.defibrillatorLocation
    );
    setNearestHospitalId(
      venue.nearestHospitalId
    );
    setVenueNotes(venue.venueNotes);
  };

  const deleteVenue = (id: string) => {
    if (
      !window.confirm(
        "Delete this venue?"
      )
    ) {
      return;
    }

    setVenues(
      venues.filter(
        (venue) => venue.id !== id
      )
    );

    if (editingId === id) {
      clearForm();
    }
  };

  return (
    <>
      <h2>
        {editingId
          ? "Edit Venue"
          : "Add Venue"}
      </h2>

      <div
        style={{
          display: "grid",
          gap: "0.75rem",
          marginBottom: "2rem",
        }}
      >
        <input
          placeholder="Venue Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) =>
            setAddress(e.target.value)
          }
        />

        <input
          placeholder="Defibrillator Location"
          value={defibrillatorLocation}
          onChange={(e) =>
            setDefibrillatorLocation(
              e.target.value
            )
          }
        />

        <select
          value={nearestHospitalId}
          onChange={(e) =>
            setNearestHospitalId(
              e.target.value
            )
          }
        >
          <option value="">
            Select nearest hospital
          </option>

          {hospitals.map((hospital) => (
            <option
              key={hospital.id}
              value={hospital.id}
            >
              {hospital.name}
            </option>
          ))}
        </select>

        <textarea
          rows={8}
          placeholder="Venue information, parking instructions, footwear restrictions, access instructions, toilets, etc."
          value={venueNotes}
          onChange={(e) =>
            setVenueNotes(
              e.target.value
            )
          }
        />

        <button
          onClick={saveVenue}
        >
          {editingId
            ? "Update Venue"
            : "Add Venue"}
        </button>

        {editingId && (
          <button
            onClick={clearForm}
          >
            Cancel Edit
          </button>
        )}
      </div>

      <div className="section-heading saved-list-heading">
        <div>
          <p className="eyebrow">Saved locations</p>
          <h2>Venues</h2>
        </div>
        <span className="item-count">
          {venues.length} {venues.length === 1 ? "venue" : "venues"}
        </span>
      </div>

      {venues.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            +
          </span>
          <h3>No venues yet</h3>
          <p>Add a venue to keep its matchday information in one place.</p>
        </div>
      )}

      <div className="record-list">
        {venues.map((venue) => {
          const hospital = hospitals.find(
            (item) => item.id === venue.nearestHospitalId
          );

          return (
            <article className="record-card" key={venue.id}>
              <div className="record-card-heading">
                <div>
                  <p className="eyebrow">Match venue</p>
                  <h3>{venue.name}</h3>
                </div>
              </div>

              <div className="record-details">
                <p>
                  <span>Address</span>
                  <strong>{venue.address || "Not entered"}</strong>
                </p>
                <p>
                  <span>Defibrillator</span>
                  <strong>
                    {venue.defibrillatorLocation || "Not entered"}
                  </strong>
                </p>
                <p>
                  <span>Nearest hospital</span>
                  <strong>{hospital?.name ?? "Not selected"}</strong>
                </p>
              </div>

              {venue.venueNotes && (
                <div className="record-notes">
                  <span>Venue information</span>
                  <p>{venue.venueNotes}</p>
                </div>
              )}

              <div className="record-card-actions">
                <button
                  className="subtle-button"
                  onClick={() => editVenue(venue)}
                >
                  Edit
                </button>
                <button
                  className="text-button"
                  onClick={() => deleteVenue(venue.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}