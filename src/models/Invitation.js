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

    // A Vercel Blob URL (see api/uploads) — empty until the couple uploads
    // a photo. Every template treats this as fully optional.
    coverImageUrl: { type: String, trim: true, default: "", maxlength: 500 },

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

    // "template" renders one of TEMPLATE_IDS via templateId (above).
    // "custom" renders customLayout instead, via CustomCardRenderer —
    // built with the drag-and-drop editor at /create.
    designMode: {
      type: String,
      enum: ["template", "custom"],
      default: "template",
    },

    // Freeform shape by design (a from-scratch canvas layout doesn't map to
    // a fixed set of fields the way the built-in templates do):
    //   { background: { type: "color"|"image", value: string },
    //     elements: [{ id, type: "text"|"image", x, y, width, zIndex, ...
    //                  (text: text, fontFamily, fontSize, color, fontWeight,
    //                   italic, align) | (image: src) }] }
    // Validated at the API layer (see api/invitations/[id]/route.js), not
    // here — Mongoose can't usefully validate a shape this open-ended.
    customLayout: { type: Schema.Types.Mixed, default: null },

    // Guests see a "not published yet" placeholder until this is true,
    // *unless* they're the invitation's own owner (see /i/[slug]/page.jsx) —
    // so a host can always preview their real card before going live.
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Invitation ||
  mongoose.model("Invitation", InvitationSchema);
