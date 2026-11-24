import type { Hospital } from "../types/Hospital";
import type { Venue } from "../types/Venue";
import type { Referee } from "../types/Referee";
import type { ClubProfile } from "../types/ClubProfile";
import type { Fixture } from "../types/Fixture";

export type BackupData = {
  hospitals: Hospital[];
  venues: Venue[];
  referees: Referee[];
  clubProfile: ClubProfile;
  fixtures: Fixture[];
};

export function downloadBackup(
  data: BackupData
) {
  const json = JSON.stringify(
    data,
    null,
    2
  );

  const blob = new Blob(
    [json],
    {
      type: "application/json",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  const date =
    new Date()
      .toISOString()
      .split("T")[0];

  link.href = url;

  link.download =
    `matchday-comms-${date}.json`;

  document.body.appendChild(
    link
  );

  link.click();

  document.body.removeChild(
    link
  );

  URL.revokeObjectURL(url);
}

export function importBackup(
  file: File
): Promise<BackupData> {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = (
        event
      ) => {
        try {
          const text =
            event.target
              ?.result as string;

          const data =
            JSON.parse(text);

          resolve(data);
        } catch {
          reject(
            new Error(
              "Invalid backup file"
            )
          );
        }
      };

      reader.onerror = () => {
        reject(
          new Error(
            "Unable to read file"
          )
        );
      };

      reader.readAsText(file);
    }
  );
}