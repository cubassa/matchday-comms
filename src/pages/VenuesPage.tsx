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

      <h2>Venues</h2>

      {venues.length === 0 && (
        <p>No venues added yet.</p>
      )}

      {venues.map((venue) => {
        const hospital =
          hospitals.find(
            (h) =>
              h.id ===
              venue.nearestHospitalId
          );

        return (
          <div
            key={venue.id}
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3>{venue.name}</h3>

            <p>
              <strong>Address:</strong>{" "}
              {venue.address}
            </p>

            <p>
              <strong>
                Defibrillator:
              </strong>{" "}
              {
                venue.defibrillatorLocation
              }
            </p>

            <p>
              <strong>
                Nearest Hospital:
              </strong>{" "}
              {hospital?.name ??
                "Not selected"}
            </p>

            {venue.venueNotes && (
              <>
                <p>
                  <strong>
                    Venue Information:
                  </strong>
                </p>

                <pre
                  style={{
                    whiteSpace:
                      "pre-wrap",
                    fontFamily:
                      "inherit",
                  }}
                >
                  {venue.venueNotes}
                </pre>
              </>
            )}

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={() =>
                  editVenue(
                    venue
                  )
                }
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteVenue(
                    venue.id
                  )
                }
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}