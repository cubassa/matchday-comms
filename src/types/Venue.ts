export type Venue = {
  id: string;

  name: string;
  address: string;

  defibrillatorLocation: string;

  nearestHospitalId: string;

  venueNotes: string;

  mapImage?: string;
};