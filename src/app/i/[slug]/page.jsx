import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/mongodb";
import Invitation from "@/models/Invitation";
import { TEMPLATE_REGISTRY } from "@/components/templates/templates";
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

  const templateConfig =
    TEMPLATE_REGISTRY[invitation.templateId] ||
    TEMPLATE_REGISTRY["classic-ivory"];
  const ActiveTemplate = templateConfig.component;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink px-6 py-14 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-md">
        <div className="aspect-[3.5/5] overflow-hidden rounded-lg border border-ink-line shadow-2xl shadow-black/50">
          <ActiveTemplate data={invitation} />
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
