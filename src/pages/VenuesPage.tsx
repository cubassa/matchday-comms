import {
  useState,
  type ChangeEvent,
} from "react";

import type { Venue } from "../types/Venue";
import type { Hospital } from "../types/Hospital";
import RecordDialog from "../components/RecordDialog";

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
  const [mapImage, setMapImage] = useState("");
  const [mapUploadError, setMapUploadError] =
    useState("");
  const [formOpen, setFormOpen] = useState(false);

  const clearForm = () => {
    setFormOpen(false);
    setEditingId(null);

    setName("");
    setAddress("");
    setDefibrillatorLocation("");
    setNearestHospitalId("");
    setVenueNotes("");
    setMapImage("");
    setMapUploadError("");
  };

  const handleMapUpload = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMapUploadError("Choose an image file for the venue map.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMapUploadError("Venue map images must be 2 MB or smaller.");
      return;
    }

    setMapUploadError("");
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setMapUploadError("Unable to read the selected map image.");
        return;
      }

      setMapImage(reader.result);
    };

    reader.onerror = () => {
      setMapUploadError("Unable to read the selected map image.");
    };

    reader.readAsDataURL(file);
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
      mapImage,
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
    setMapImage(venue.mapImage ?? "");
    setMapUploadError("");
    setFormOpen(true);
  };

  const addVenue = () => {
    clearForm();
    setFormOpen(true);
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
      <div className="section-heading saved-list-heading">
        <div>
          <p className="eyebrow">Saved locations</p>
          <h2>Venues</h2>
        </div>
        <div className="list-heading-actions">
          <span className="item-count">
            {venues.length} {venues.length === 1 ? "venue" : "venues"}
          </span>
          <button className="primary-button" onClick={addVenue}>
            Add venue
          </button>
        </div>
      </div>

      <RecordDialog
        open={formOpen}
        title={editingId ? "Edit venue" : "Add venue"}
        onClose={clearForm}
      >
        <div className="record-dialog-content">
          <div className="record-dialog-heading">
            <h2>{editingId ? "Edit venue" : "Add venue"}</h2>
            <button
              className="dialog-close-button"
              aria-label="Close"
              onClick={clearForm}
            >
              ×
            </button>
          </div>
          <form
            className="record-form"
            onSubmit={(event) => {
              event.preventDefault();
              saveVenue();
            }}
          >
            <input
              placeholder="Venue Name"
              aria-label="Venue name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              placeholder="Address"
              aria-label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <input
              placeholder="Defibrillator Location"
              aria-label="Defibrillator location"
              value={defibrillatorLocation}
              onChange={(e) => setDefibrillatorLocation(e.target.value)}
            />

            <select
              aria-label="Nearest hospital"
              value={nearestHospitalId}
              onChange={(e) => setNearestHospitalId(e.target.value)}
            >
              <option value="">Select nearest hospital</option>
              {hospitals.map((hospital) => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>

            <textarea
              rows={5}
              placeholder="Venue information, parking instructions, footwear restrictions, access instructions, toilets, etc."
              aria-label="Venue information"
              value={venueNotes}
              onChange={(e) => setVenueNotes(e.target.value)}
            />

            <label className="fixture-field">
              <span>Venue map image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleMapUpload}
              />
            </label>

            <p className="form-hint">
              Upload an image up to 2 MB. It will be saved with this venue.
            </p>

            {mapUploadError && (
              <p className="form-error" role="alert">
                {mapUploadError}
              </p>
            )}

            {mapImage && (
              <div className="venue-map-preview">
                <img src={mapImage} alt="Venue map preview" />
                <button
                  type="button"
                  className="subtle-button"
                  onClick={() => setMapImage("")}
                >
                  Remove map image
                </button>
              </div>
            )}

            <div className="record-form-actions">
              <button type="button" className="subtle-button" onClick={clearForm}>
                Cancel
              </button>
              <button type="submit" className="primary-button">
                {editingId ? "Save changes" : "Add venue"}
              </button>
            </div>
          </form>
        </div>
      </RecordDialog>

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

              {venue.mapImage && (
                <div className="venue-map">
                  <span>Venue map</span>
                  <img src={venue.mapImage} alt={`Map for ${venue.name}`} />
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