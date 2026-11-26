import type { ClubProfile } from "../types/ClubProfile";
import type { MessageTemplates } from "../types/MessageTemplates";
import { MESSAGE_PLACEHOLDERS } from "../utils/messageTemplates";

type Props = {
  profile: ClubProfile;
  setProfile: (profile: ClubProfile) => void;
  templates: MessageTemplates;
  setTemplates: (templates: MessageTemplates) => void;
};

export default function ClubProfilePage({
  profile,
  setProfile,
  templates,
  setTemplates,
}: Props) {
  const updateField = (
    key: keyof ClubProfile,
    value: string
  ) => {
    setProfile({
      ...profile,
      [key]: value,
    });
  };

  const updateTemplate = (
    key: keyof MessageTemplates,
    value: string
  ) => {
    setTemplates({
      ...templates,
      [key]: value,
    });
  };

  const handleBadgeUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      setProfile({
        ...profile,
        badgeImage:
          reader.result as string,
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <>
      <h2>Club Profile</h2>

      <div
        style={{
          display: "grid",
          gap: "0.75rem",
        }}
      >
        <input
          placeholder="Club Name"
          value={profile.clubName}
          onChange={(e) =>
            updateField(
              "clubName",
              e.target.value
            )
          }
        />

        <input
          placeholder="Team Name"
          value={profile.teamName}
          onChange={(e) =>
            updateField(
              "teamName",
              e.target.value
            )
          }
        />

        <textarea
            rows={5}
            placeholder="Club Description"
            value={profile.clubDescription}
            onChange={(e) =>
                updateField(
                "clubDescription",
                e.target.value
                )
            }
        />

        <input
          placeholder="Manager Name"
          value={profile.managerName}
          onChange={(e) =>
            updateField(
              "managerName",
              e.target.value
            )
          }
        />

        <input
          placeholder="Manager Mobile"
          value={profile.managerMobile}
          onChange={(e) =>
            updateField(
              "managerMobile",
              e.target.value
            )
          }
        />

        <input
          placeholder="Manager Email"
          value={profile.managerEmail}
          onChange={(e) =>
            updateField(
              "managerEmail",
              e.target.value
            )
          }
        />

        <input
          placeholder="Home Colours"
          value={profile.homeColours}
          onChange={(e) =>
            updateField(
              "homeColours",
              e.target.value
            )
          }
        />

        <textarea
          rows={3}
          placeholder="Grounds Information Text"
          value={
            profile.groundsInformationText
          }
          onChange={(e) =>
            updateField(
              "groundsInformationText",
              e.target.value
            )
          }
        />

        <input
          placeholder="Grounds Information URL"
          value={
            profile.groundsInformationUrl
          }
          onChange={(e) =>
            updateField(
              "groundsInformationUrl",
              e.target.value
            )
          }
        />

        {profile.badgeImage && (
        <img
            src={profile.badgeImage}
            alt="Club Badge"
            style={{
            width: "200px",
            maxHeight: "200px",
            objectFit: "contain",
            border: "1px solid #ccc",
            padding: "10px",
            backgroundColor: "white",
            }}
        />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={
            handleBadgeUpload
          }
        />


      </div>

      <section className="message-template-settings">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Matchday communications</p>
            <h2>Message templates</h2>
          </div>
        </div>
        <p className="template-description">
          Customize the email for opposition managers and the WhatsApp
          message for referees. Templates are saved automatically.
        </p>

        <label className="template-field">
          <span>Opposition manager email</span>
          <textarea
            rows={10}
            value={templates.oppositionEmail}
            onChange={(event) =>
              updateTemplate("oppositionEmail", event.target.value)
            }
          />
        </label>

        <label className="template-field">
          <span>Referee WhatsApp message</span>
          <textarea
            rows={8}
            value={templates.refereeWhatsApp}
            onChange={(event) =>
              updateTemplate("refereeWhatsApp", event.target.value)
            }
          />
        </label>

        <details className="template-placeholder-guide">
          <summary>Available placeholders</summary>
          <p>
            Use a placeholder with double curly braces. Empty optional
            details are left blank; an unassigned referee appears as TBC.
          </p>
          <div className="template-placeholder-list">
            {MESSAGE_PLACEHOLDERS.map((placeholder) => (
              <code key={placeholder}>{`{{${placeholder}}}`}</code>
            ))}
          </div>
        </details>
      </section>
    </>
  );
}