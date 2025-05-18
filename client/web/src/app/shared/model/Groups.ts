export interface Groups {
  _id: string;
  name: string;
  description: string;
  capacity: number;
  schedule: { day: string; time: string }[];
  trainerId: {
    _id: string;
    name: string;
  };
}
