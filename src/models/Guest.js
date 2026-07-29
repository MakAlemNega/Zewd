import mongoose, { Schema } from "mongoose";

const GuestSchema = new Schema(
  {
    invitation: {
      type: Schema.Types.ObjectId,
      ref: "Invitation",
      required: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, trim: true, default: "", maxlength: 30 },
    attending: {
      type: String,
      enum: ["yes", "no", "maybe"],
      default: "maybe",
    },
    guestCount: { type: Number, min: 0, max: 50, default: 1 },
    message: { type: String, trim: true, default: "", maxlength: 500 },
  },
  { timestamps: true },
);

GuestSchema.index({ invitation: 1, createdAt: -1 });

export default mongoose.models.Guest || mongoose.model("Guest", GuestSchema);
