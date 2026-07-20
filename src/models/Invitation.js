import mongoose, { Schema } from "mongoose";

// Kept in sync by hand with the ids in src/components/templates/templates.js
// (not imported directly — that module pulls in "use client" React components,
// which have no place in a model file that also runs in server-only contexts).
export const TEMPLATE_IDS = ["classic-ivory", "modern-minimal", "cultural-gold"];

const InvitationSchema = new Schema(
  {
    // Optional until real authentication exists; lets invitations be created
    // anonymously today and attributed to an account later.
    owner: { type: Schema.Types.ObjectId, ref: "User", default: null },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    brideName: { type: String, required: true, trim: true },
    groomName: { type: String, required: true, trim: true },
    brideParents: { type: String, trim: true, default: "" },
    groomParents: { type: String, trim: true, default: "" },

    weddingDate: { type: Date },
    weddingTime: { type: String, trim: true, default: "" },

    venueName: { type: String, trim: true, default: "" },
    venueAddress: { type: String, trim: true, default: "" },

    personalMessage: { type: String, trim: true, default: "" },

    templateId: {
      type: String,
      enum: TEMPLATE_IDS,
      default: "classic-ivory",
    },
    colorTheme: { type: String, trim: true, default: "gold-default" },
  },
  { timestamps: true },
);

export default mongoose.models.Invitation ||
  mongoose.model("Invitation", InvitationSchema);
