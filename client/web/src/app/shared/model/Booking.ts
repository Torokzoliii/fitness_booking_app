export interface Booking {
  _id: string;
  userId: { _id: string; name: string };
  groupId: { _id: string; name: string };
  status: "confirmed" | "cancelled" | "waiting";
  createdAt: Date;
}
