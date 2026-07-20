import { NextResponse } from "next/server";

// Shared translation from Mongoose/Mongo errors to HTTP responses so every
// route handler doesn't have to duplicate this switch.
export function handleApiError(err) {
  if (err.name === "ValidationError") {
    return NextResponse.json(
      { error: err.message, fields: Object.keys(err.errors || {}) },
      { status: 400 },
    );
  }

  if (err.name === "CastError") {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return NextResponse.json(
      { error: `${field} is already in use` },
      { status: 409 },
    );
  }

  console.error(err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
