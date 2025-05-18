import mongoose, {Schema, Document, Model} from "mongoose";
import {IGroup} from "./Groups";
import {IUser} from "./User";

export interface IBooking extends Document {
    _id: mongoose.Types.ObjectId;
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' };
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' };
    status: "confirmed" | "cancelled" | "waiting";
    createdAt: Date;
}

export interface IBookingPopulated extends Omit<IBooking, 'userId' | 'groupId'> {
    userId: IUser;
    groupId: IGroup;
}
const BookingSchema = new Schema<IBooking>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    status: { type: String, enum: ["confirmed", "cancelled", "waiting"], default: "confirmed" },
    createdAt: { type: Date, default: Date.now },
});

export const Booking: Model<IBooking> = mongoose.model<IBooking>("Booking", BookingSchema);