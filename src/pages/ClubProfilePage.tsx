import type { ClubProfile } from "../types/ClubProfile";

type Props = {
  profile: ClubProfile;
  setProfile: (profile: ClubProfile) => void;
};

export default function ClubProfilePage({
  profile,
  setProfile,
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

  const handlePaste = async (
    event: React.ClipboardEvent<HTMLDivElement>
    ) => {
    const items =
        event.clipboardData.items;

    for (const item of items) {
        if (
        item.type.startsWith("image/")
        ) {
        const file =
            item.getAsFile();

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

        event.preventDefault();
        return;
        }
    }
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
    </>
  );
}