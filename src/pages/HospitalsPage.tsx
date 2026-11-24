import { useState } from "react";
import type { Hospital } from "../types/Hospital";

type Props = {
  hospitals: Hospital[];
  setHospitals: (hospitals: Hospital[]) => void;
};

export default function HospitalsPage({
  hospitals,
  setHospitals,
}: Props) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");

  const addHospital = () => {
    if (!name.trim()) {
      return;
    }

    const hospital: Hospital = {
    id: crypto.randomUUID(),
    name,
    address,
    postcode,
    phone: "",
    notes: "",
    };

    setHospitals([...hospitals, hospital]);

    setName("");
    setAddress("");
    setPostcode("");
  };

  const deleteHospital = (id: string) => {
    setHospitals(
      hospitals.filter(
        (hospital) => hospital.id !== id
      )
    );
  };

  return (
    <>
      <h2>Add Hospital</h2>

      <div
        style={{
          display: "grid",
          gap: "0.75rem",
          marginBottom: "2rem",
        }}
      >
        <input
          placeholder="Hospital Name"
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
          placeholder="Postcode"
          value={postcode}
          onChange={(e) =>
            setPostcode(e.target.value)
          }
        />

        <button onClick={addHospital}>
          Add Hospital
        </button>
      </div>

      <div className="section-heading saved-list-heading">
        <div>
          <p className="eyebrow">Saved contacts</p>
          <h2>Hospitals</h2>
        </div>
        <span className="item-count">
          {hospitals.length}{" "}
          {hospitals.length === 1 ? "hospital" : "hospitals"}
        </span>
      </div>

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