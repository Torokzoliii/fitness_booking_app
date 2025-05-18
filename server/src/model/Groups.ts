import mongoose, {Schema, Document, Model} from "mongoose";

export interface IGroup extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    description: string;
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' };
    capacity: number;
    schedule: { day: string; time: string }[];
}

const GroupSchema = new Schema<IGroup>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    trainerId: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
    capacity: { type: Number, required: true },
    schedule: [
        {
            day: { type: String, required: true },
            time: { type: String, required: true },
        },
    ],
});

export const Group: Model<IGroup> = mongoose.model<IGroup>("Group", GroupSchema);