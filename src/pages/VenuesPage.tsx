import type { Venue } from "../types/Venue";
import type { Hospital } from "../types/Hospital";

type Props = {
  venues: Venue[];
  hospitals: Hospital[];
};

export default function VenuesPage({
  venues,
}: Props) {
  return (
    <div>
      <h2>Venues</h2>

      <p>
        Current Venue Count: {venues.length}
      </p>
    </div>
  );
}