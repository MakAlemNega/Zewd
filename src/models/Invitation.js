import mongoose, { Schema } from "mongoose";

// Kept in sync by hand with the ids in src/components/templates/templates.js
// (not imported directly — that module pulls in "use client" React components,
// which have no place in a model file that also runs in server-only contexts).
export const TEMPLATE_IDS = ["classic-ivory", "modern-minimal", "cultural-gold"];

const InvitationSchema = new Schema(
  {
    // Always set from the session on creation (see api/invitations POST) —
    // nullable only so records from before real accounts existed still load.
    owner: { type: Schema.Types.ObjectId, ref: "User", default: null },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 200,
    },

    brideName: { type: String, required: true, trim: true, maxlength: 100 },
    groomName: { type: String, required: true, trim: true, maxlength: 100 },
    brideParents: { type: String, trim: true, default: "", maxlength: 200 },
    groomParents: { type: String, trim: true, default: "", maxlength: 200 },

    weddingDate: { type: Date },
    weddingTime: { type: String, trim: true, default: "", maxlength: 50 },

    venueName: { type: String, trim: true, default: "", maxlength: 150 },
    venueAddress: { type: String, trim: true, default: "", maxlength: 300 },

    personalMessage: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    templateId: {
      type: String,
      enum: TEMPLATE_IDS,
      default: "classic-ivory",
    },
    colorTheme: {
      type: String,
      trim: true,
      default: "gold-default",
      maxlength: 50,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Invitation ||
  mongoose.model("Invitation", InvitationSchema);
