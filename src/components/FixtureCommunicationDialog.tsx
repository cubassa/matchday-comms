import { useState } from "react";

import type { Fixture } from "../types/Fixture";
import type { Venue } from "../types/Venue";
import type { Referee } from "../types/Referee";
import type { Hospital } from "../types/Hospital";
import type { ClubProfile } from "../types/ClubProfile";
import type { MessageTemplates } from "../types/MessageTemplates";
import RecordDialog from "./RecordDialog";
import { downloadMatchPdf } from "../storage/matchdayPdf";
import {
  getMessagePlaceholderValues,
  renderMessageTemplate,
} from "../utils/messageTemplates";

type Props = {
  fixture: Fixture | null;
  venues: Venue[];
  referees: Referee[];
  hospitals: Hospital[];
  profile: ClubProfile;
  templates: MessageTemplates;
  onClose: () => void;
};

export default function FixtureCommunicationDialog({
  fixture,
  venues,
  referees,
  hospitals,
  profile,
  templates,
  onClose,
}: Props) {
  const [copiedMessage, setCopiedMessage] =
    useState<string | null>(null);
  const [error, setError] = useState("");

  if (!fixture) {
    return null;
  }

  const venue = venues.find((item) => item.id === fixture.venueId);
  const referee = referees.find(
    (item) => item.id === fixture.refereeId
  );
  const hospital = hospitals.find(
    (item) => item.id === venue?.nearestHospitalId
  );
  const values = getMessagePlaceholderValues({
    fixture,
    venue,
    referee,
    hospital,
    profile,
  });
  const emailMessage = renderMessageTemplate(
    templates.oppositionEmail,
    values
  );
  const refereeMessage = renderMessageTemplate(
    templates.refereeWhatsApp,
    values
  );

  const copyMessage = async (
    messageType: string,
    text: string
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(messageType);
      setError("");
    } catch {
      setCopiedMessage(null);
      setError(
        "Unable to copy automatically. Select the message and copy it manually."
      );
    }
  };

  const downloadPdf = () => {
    try {
      downloadMatchPdf({
        fixture,
        venue,
        referee,
        hospitals,
        profile,
      });
      setError("");
    } catch (error) {
      setError(
        error instanceof Error
          ? `Unable to create the match PDF: ${error.message}`
          : "Unable to create the match PDF. Please try again."
      );
    }
  };

  return (
    <RecordDialog
      open
      title={`Match communications: ${fixture.oppositionName}`}
      onClose={onClose}
    >
      <div className="record-dialog-content">
        <div className="record-dialog-heading">
          <h2>Match communications</h2>
          <button
            className="dialog-close-button"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="generated-messages">
          <section className="generated-message">
            <div className="generated-message-heading">
              <h3>Opposition manager email</h3>
              <button
                className="subtle-button"
                onClick={() => copyMessage("email", emailMessage)}
              >
                {copiedMessage === "email" ? "Copied" : "Copy email"}
              </button>
            </div>
            <textarea
              aria-label="Generated opposition email"
              rows={9}
              value={emailMessage}
              readOnly
            />
          </section>

          <section className="generated-message">
            <div className="generated-message-heading">
              <h3>Referee WhatsApp</h3>
              <button
                className="subtle-button"
                onClick={() =>
                  copyMessage("referee", refereeMessage)
                }
              >
                {copiedMessage === "referee"
                  ? "Copied"
                  : "Copy WhatsApp"}
              </button>
            </div>
            <textarea
              aria-label="Generated referee WhatsApp"
              rows={7}
              value={refereeMessage}
              readOnly
            />
          </section>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="communication-dialog-actions">
          <button
            className="subtle-button"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="primary-button"
            onClick={downloadPdf}
          >
            Download match PDF
          </button>
        </div>
      </div>
    </RecordDialog>
  );
}
