import { useState } from "react";
import type { Referee } from "../types/Referee";

type Props = {
  referees: Referee[];
  setReferees: (referees: Referee[]) => void;
};

export default function RefereesPage({
  referees,
  setReferees,
}: Props) {
  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] =
    useState("");
  const [notes, setNotes] = useState("");

  const clearForm = () => {
    setEditingId(null);
    setName("");
    setMobileNumber("");
    setNotes("");
  };

  const saveReferee = () => {
    if (!name.trim()) {
      return;
    }

    const referee: Referee = {
      id: editingId ?? crypto.randomUUID(),
      name,
      mobileNumber,
      notes,
    };

    if (editingId) {
      setReferees(
        referees.map((r) =>
          r.id === editingId ? referee : r
        )
      );
    } else {
      setReferees([
        ...referees,
        referee,
      ]);
    }

    clearForm();
  };

  const editReferee = (
    referee: Referee
  ) => {
    setEditingId(referee.id);
    setName(referee.name);
    setMobileNumber(
      referee.mobileNumber
    );
    setNotes(referee.notes);
  };

  const deleteReferee = (
    id: string
  ) => {
    if (
      !window.confirm(
        "Delete this referee?"
      )
    ) {
      return;
    }

    setReferees(
      referees.filter(
        (referee) =>
          referee.id !== id
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
          ? "Edit Referee"
          : "Add Referee"}
      </h2>

      <div
        style={{
          display: "grid",
          gap: "0.75rem",
          marginBottom: "2rem",
        }}
      >
        <input
          placeholder="Referee Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          placeholder="Mobile Number"
          value={mobileNumber}
          onChange={(e) =>
            setMobileNumber(
              e.target.value
            )
          }
        />

        <textarea
          rows={4}
          placeholder="Notes"
          value={notes}
          onChange={(e) =>
            setNotes(
              e.target.value
            )
          }
        />

        <button
          onClick={saveReferee}
        >
          {editingId
            ? "Update Referee"
            : "Add Referee"}
        </button>

        {editingId && (
          <button
            onClick={clearForm}
          >
            Cancel Edit
          </button>
        )}
      </div>

      <h2>Referees</h2>

      {referees.length === 0 && (
        <p>No referees added yet.</p>
      )}

      {referees.map((referee) => (
        <div
          key={referee.id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "8px",
          }}
        >
          <h3>{referee.name}</h3>

          <p>
            <strong>Mobile:</strong>{" "}
            {referee.mobileNumber ||
              "Not entered"}
          </p>

          {referee.notes && (
            <p>
              <strong>Notes:</strong>{" "}
              {referee.notes}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <button
              onClick={() =>
                editReferee(
                  referee
                )
              }
            >
              Edit
            </button>

            <button
              onClick={() =>
                deleteReferee(
                  referee.id
                )
              }
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </>
  );
}