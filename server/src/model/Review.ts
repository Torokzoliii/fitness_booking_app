import mongoose, {Schema, Document, Model} from "mongoose";

export interface IReview extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    groupId: mongoose.Schema.Types.ObjectId;
    trainerId: mongoose.Schema.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    trainerId: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true, maxLength: 255 },
    createdAt: { type: Date, default: Date.now },
});

export const Review: Model<IReview> = mongoose.model<IReview>("Review", ReviewSchema);