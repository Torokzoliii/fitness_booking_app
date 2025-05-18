import mongoose, {Schema, Document, Model} from "mongoose";

export interface ITrainer extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    bio: string;
    specialties: string[];
}

const TrainerSchema = new Schema<ITrainer>({
    name: { type: String, required: true },
    bio: { type: String, required: true },
    specialties: { type: [String], required: true },
});

export const Trainer: Model<ITrainer> = mongoose.model<ITrainer>("Trainer", TrainerSchema);