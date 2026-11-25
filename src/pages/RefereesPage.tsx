import { useState } from "react";
import type { Referee } from "../types/Referee";
import RecordDialog from "../components/RecordDialog";

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
  const [formOpen, setFormOpen] = useState(false);

  const clearForm = () => {
    setFormOpen(false);
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
    setFormOpen(true);
  };

  const addReferee = () => {
    clearForm();
    setFormOpen(true);
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
      <div className="section-heading saved-list-heading">
        <div>
          <p className="eyebrow">Saved contacts</p>
          <h2>Referees</h2>
        </div>
        <div className="list-heading-actions">
          <span className="item-count">
            {referees.length}{" "}
            {referees.length === 1 ? "referee" : "referees"}
          </span>
          <button className="primary-button" onClick={addReferee}>
            Add referee
          </button>
        </div>
      </div>

      <RecordDialog
        open={formOpen}
        title={editingId ? "Edit referee" : "Add referee"}
        onClose={clearForm}
      >
        <div className="record-dialog-content">
          <div className="record-dialog-heading">
            <h2>{editingId ? "Edit referee" : "Add referee"}</h2>
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
              saveReferee();
            }}
          >
            <input
              placeholder="Referee Name"
              aria-label="Referee name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              placeholder="Mobile Number"
              aria-label="Mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
            />
            <textarea
              rows={4}
              placeholder="Notes"
              aria-label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="record-form-actions">
              <button type="button" className="subtle-button" onClick={clearForm}>
                Cancel
              </button>
              <button type="submit" className="primary-button">
                {editingId ? "Save changes" : "Add referee"}
              </button>
            </div>
          </form>
        </div>
      </RecordDialog>

      {referees.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            +
          </span>
          <h3>No referees yet</h3>
          <p>Add referee contacts to keep matchday details close at hand.</p>
        </div>
      )}

      <div className="record-list">
        {referees.map((referee) => (
          <article className="record-card" key={referee.id}>
            <div className="record-card-heading">
              <div>
                <p className="eyebrow">Match official</p>
                <h3>{referee.name}</h3>
              </div>
            </div>

            <div className="record-details">
              <p>
                <span>Mobile</span>
                <strong>{referee.mobileNumber || "Not entered"}</strong>
              </p>
              {referee.notes && (
                <p>
                  <span>Notes</span>
                  <strong>{referee.notes}</strong>
                </p>
              )}
            </div>

            <div className="record-card-actions">
              <button
                className="subtle-button"
                onClick={() => editReferee(referee)}
              >
                Edit
              </button>
              <button
                className="text-button"
                onClick={() => deleteReferee(referee.id)}
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