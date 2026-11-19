import type { Hospital } from "../types/Hospital";

type Props = {
  hospitals: Hospital[];
  setHospitals: (
    hospitals: Hospital[]
  ) => void;
};

export default function HospitalsPage({
  hospitals,
  setHospitals,
}: Props) {
  return (
    <div>
      <h2>Hospitals</h2>

      <p>
        Hospital management coming next.
      </p>

      <p>
        Current Hospital Count: {hospitals.length}
      </p>
    </div>
  );
}