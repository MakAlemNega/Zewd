import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import Invitation from "@/models/Invitation";
import { TEMPLATE_REGISTRY } from "@/components/templates/templates";
import CustomCardRenderer from "@/components/templates/CustomCardRenderer";
import RsvpForm from "@/components/invitation/RsvpForm";

export const dynamic = "force-dynamic";

async function getInvitationBySlug(slug) {
  await dbConnect();
  const doc = await Invitation.findOne({ slug }).lean();
  if (!doc) return null;
  // Strip Mongoose/BSON types (ObjectId, Date) down to plain JSON so this
  // can be handed to a client component as props.
  return JSON.parse(JSON.stringify(doc));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) return { title: "Invitation not found | Zewd" };

  return {
    title: `${invitation.brideName} & ${invitation.groomName}'s Wedding | Zewd`,
    description:
      invitation.personalMessage ||
      "You're invited to celebrate our wedding.",
  };
}

export default async function GuestInvitationPage({ params }) {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) notFound();

  const viewer = await getCurrentUser();
  const isOwner = Boolean(
    viewer && invitation.owner && viewer._id.toString() === invitation.owner,
  );

  // Unpublished invitations are hidden from everyone except their own
  // owner, who can always preview the real card before going live.
  if (!invitation.published && !isOwner) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-ink px-6 text-center">
        <p className="font-display text-3xl italic text-ivory">
          This invitation isn&apos;t public yet.
        </p>
        <p className="mt-3 max-w-sm text-sm text-ivory/50">
          The couple is still putting the finishing touches on it. Check
          back soon.
        </p>
      </div>
    );
  }

  const isCustom = invitation.designMode === "custom" && invitation.customLayout;
  const templateConfig =
    TEMPLATE_REGISTRY[invitation.templateId] ||
    TEMPLATE_REGISTRY["classic-ivory"];
  const ActiveTemplate = templateConfig.component;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-md">
        {isOwner && !invitation.published && (
          <p className="mb-4 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-center text-xs font-semibold text-amber-400">
            Draft preview — only you can see this until you publish
          </p>
        )}

        <div className="aspect-[3.5/5] overflow-hidden rounded-lg border border-ink-line shadow-2xl shadow-black/50">
          {isCustom ? (
            <CustomCardRenderer layout={invitation.customLayout} />
          ) : (
            <ActiveTemplate data={invitation} />
          )}
        </div>

        <div className="mt-12">
          <RsvpForm
            invitationId={invitation._id}
            coupleNames={`${invitation.brideName} & ${invitation.groomName}`}
          />
        </div>
      </div>
    </div>
  );
}
