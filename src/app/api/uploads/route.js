import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentUser } from "@/lib/auth";
import { rateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { handleApiError } from "@/lib/apiError";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// POST /api/uploads — upload a cover photo for the signed-in user's
// invitation. Requires a Vercel Blob store: set BLOB_READ_WRITE_TOKEN in
// .env (https://vercel.com/docs/vercel-blob) to enable this.
export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error:
            "Image uploads aren't configured yet. Add BLOB_READ_WRITE_TOKEN to .env to enable them.",
        },
        { status: 503 },
      );
    }

    const { allowed, retryAfterMs } = rateLimit(request, {
      key: "uploads:create",
      limit: 10,
      windowMs: 60 * 60 * 1000,
    });
    if (!allowed) return rateLimitResponse(retryAfterMs);

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!file.type?.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image must be smaller than 5MB" },
        { status: 400 },
      );
    }

    const extension = file.name?.split(".").pop()?.toLowerCase() || "jpg";
    // Namespaced by user so one host's photo can never collide with or
    // overwrite another's.
    const pathname = `invitations/${user._id}/${Date.now()}.${extension}`;

    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    return handleApiError(err);
  }
}
