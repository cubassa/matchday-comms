import { useState } from "react";
import type { Hospital } from "../types/Hospital";
import RecordDialog from "../components/RecordDialog";

type Props = {
  hospitals: Hospital[];
  setHospitals: (hospitals: Hospital[]) => void;
};

export default function HospitalsPage({
  hospitals,
  setHospitals,
}: Props) {
  const [editingId, setEditingId] =
    useState<string | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const clearForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setName("");
    setAddress("");
    setPostcode("");
  };

  const saveHospital = () => {
    if (!name.trim()) {
      return;
    }

    const existing = hospitals.find(
      (hospital) => hospital.id === editingId
    );
    const hospital: Hospital = {
      id: editingId ?? crypto.randomUUID(),
      name,
      address,
      postcode,
      phone: existing?.phone ?? "",
      notes: existing?.notes ?? "",
    };

    if (editingId) {
      setHospitals(
        hospitals.map((item) =>
          item.id === editingId ? hospital : item
        )
      );
    } else {
      setHospitals([...hospitals, hospital]);
    }

    clearForm();
  };

  const addHospital = () => {
    clearForm();
    setFormOpen(true);
  };

  const editHospital = (hospital: Hospital) => {
    setEditingId(hospital.id);
    setName(hospital.name);
    setAddress(hospital.address);
    setPostcode(hospital.postcode);
    setFormOpen(true);
  };

  const deleteHospital = (id: string) => {
    setHospitals(
      hospitals.filter(
        (hospital) => hospital.id !== id
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
          <p className="eyebrow">Saved contacts</p>
          <h2>Hospitals</h2>
        </div>
        <div className="list-heading-actions">
          <span className="item-count">
            {hospitals.length}{" "}
            {hospitals.length === 1 ? "hospital" : "hospitals"}
          </span>
          <button className="primary-button" onClick={addHospital}>
            Add hospital
          </button>
        </div>
      </div>

      <RecordDialog
        open={formOpen}
        title={editingId ? "Edit hospital" : "Add hospital"}
        onClose={clearForm}
      >
        <div className="record-dialog-content">
          <div className="record-dialog-heading">
            <h2>{editingId ? "Edit hospital" : "Add hospital"}</h2>
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
              saveHospital();
            }}
          >
            <input
              placeholder="Hospital Name"
              aria-label="Hospital name"
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
              placeholder="Postcode"
              aria-label="Postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
            <div className="record-form-actions">
              <button type="button" className="subtle-button" onClick={clearForm}>
                Cancel
              </button>
              <button type="submit" className="primary-button">
                {editingId ? "Save changes" : "Add hospital"}
              </button>
            </div>
          </form>
        </div>
      </RecordDialog>

      {hospitals.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            +
          </span>
          <h3>No hospitals yet</h3>
          <p>Add nearby hospitals to keep important contacts handy.</p>
        </div>
      )}

      <div className="record-list">
        {hospitals.map((hospital) => (
          <article className="record-card" key={hospital.id}>
            <div className="record-card-heading">
              <div>
                <p className="eyebrow">Medical facility</p>
                <h3>{hospital.name}</h3>
              </div>
            </div>

            <div className="record-details">
              <p>
                <span>Address</span>
                <strong>{hospital.address || "Not entered"}</strong>
              </p>
              <p>
                <span>Postcode</span>
                <strong>{hospital.postcode || "Not entered"}</strong>
              </p>
              {hospital.phone && (
                <p>
                  <span>Phone</span>
                  <strong>{hospital.phone}</strong>
                </p>
              )}
            </div>

            {hospital.notes && (
              <div className="record-notes">
                <span>Notes</span>
                <p>{hospital.notes}</p>
              </div>
            )}

            <div className="record-card-actions">
              <button
                className="subtle-button"
                onClick={() => editHospital(hospital)}
              >
                Edit
              </button>
              <button
                className="text-button"
                onClick={() => deleteHospital(hospital.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}