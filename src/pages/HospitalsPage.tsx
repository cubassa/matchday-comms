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

      <h2>Hospitals</h2>

      {hospitals.length === 0 && (
        <p>No hospitals added yet.</p>
      )}

      {hospitals.map((hospital) => (
        <div
          key={hospital.id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "8px",
          }}
        >
          <h3>{hospital.name}</h3>

          <p>
            <strong>Address:</strong>{" "}
            {hospital.address}
          </p>

          <p>
            <strong>Postcode:</strong>{" "}
            {hospital.postcode}
          </p>

          <button
            onClick={() =>
              deleteHospital(hospital.id)
            }
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
}