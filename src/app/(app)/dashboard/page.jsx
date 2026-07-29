import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { dbConnect } from "@/lib/mongodb";
import Invitation from "@/models/Invitation";
import Guest from "@/models/Guest";
import PublishToggle from "@/components/dashboard/PublishToggle";
import InvitationThumbnail from "@/components/dashboard/InvitationThumbnail";
import CustomCardRenderer from "@/components/templates/CustomCardRenderer";
import { TEMPLATE_REGISTRY } from "@/components/templates/templates";

export const dynamic = "force-dynamic";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function timeAgo(dateInput) {
  const diffMs = Date.now() - new Date(dateInput).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function summarize(guests) {
  return guests.reduce(
    (acc, guest) => {
      acc.responses += 1;
      if (guest.attending === "yes") {
        acc.attendingYes += 1;
        acc.headcount += guest.guestCount || 0;
      } else if (guest.attending === "maybe") {
        acc.maybe += 1;
      } else {
        acc.no += 1;
      }
      return acc;
    },
    { responses: 0, attendingYes: 0, maybe: 0, no: 0, headcount: 0 },
  );
}

function buildChecklist(invitation, guestCount) {
  const hasDesign =
    Boolean(invitation.coverImageUrl) ||
    (invitation.designMode === "custom" &&
      (invitation.customLayout?.elements?.length || 0) > 0);

  return [
    { label: "Create your event", done: true, href: null },
    {
      label: "Add event details",
      description: "Venue and date are set.",
      done: Boolean(invitation.venueName && invitation.weddingDate),
      href: "/create",
    },
    {
      label: "Design your invitation",
      description: "Add a cover photo, or build a custom card.",
      done: hasDesign,
      href: "/create",
    },
    {
      label: "Publish your invitation",
      description: "Make your guest link live.",
      done: invitation.published,
      href: "#publish-section",
    },
    {
      label: "Get your first RSVP",
      description: "Share your guest link and wait for a response.",
      done: guestCount > 0,
      href: null,
    },
  ];
}

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();

  await dbConnect();
  const invitation = await Invitation.findOne({ owner: user._id })
    .sort({ createdAt: -1 })
    .lean();

  const firstName = user.name?.split(" ")[0] || user.name;

  if (!invitation) {
    return (
      <div className="px-6 py-10 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-widest text-ivory/40">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="mt-1 font-display text-3xl italic text-ivory sm:text-4xl">
            {getGreeting()}, <span className="text-gold-bright">{firstName}</span>
          </h1>

          <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-line py-16 text-center">
            <p className="font-display text-xl italic text-ivory">
              You haven&apos;t designed an invitation yet.
            </p>
            <Link
              href="/create"
              className="mt-6 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
            >
              Start designing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const guestsRaw = await Guest.find({ invitation: invitation._id }).lean();
  const guests = JSON.parse(JSON.stringify(guestsRaw));
  const summary = summarize(guests);
  const shareUrl = `/i/${invitation.slug}`;

  const checklist = buildChecklist(invitation, guests.length);
  const doneCount = checklist.filter((s) => s.done).length;
  const progressPct = Math.round((doneCount / checklist.length) * 100);
  const nextStep = checklist.find((s) => !s.done && s.href);

  const isCustom = invitation.designMode === "custom" && invitation.customLayout;
  const templateConfig =
    TEMPLATE_REGISTRY[invitation.templateId] || TEMPLATE_REGISTRY["classic-ivory"];
  const ActiveTemplate = templateConfig.component;

  return (
    <div className="px-6 py-8 sm:px-10">
      <div className="mx-auto max-w-4xl">
        {/* Welcome header */}
        <p className="text-xs uppercase tracking-widest text-ivory/40">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="mt-1 font-display text-3xl italic text-ivory sm:text-4xl">
          {getGreeting()}, <span className="text-gold-bright">{firstName}</span>
        </h1>

        {/* Draft invitation card */}
        <div className="mt-8 flex flex-col gap-5 rounded-xl border border-ink-line bg-ink-soft/60 p-6 sm:flex-row sm:items-center">
          <InvitationThumbnail width={100}>
            {isCustom ? (
              <CustomCardRenderer layout={invitation.customLayout} />
            ) : (
              <ActiveTemplate data={invitation} />
            )}
          </InvitationThumbnail>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${
                  invitation.published
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                }`}
              >
                {invitation.published ? "Published" : "Draft"}
              </span>
              <span className="text-xs text-ivory/40">
                Last edited {timeAgo(invitation.updatedAt)}
              </span>
            </div>
            <h2 className="mt-1.5 truncate font-display text-xl italic text-ivory">
              {invitation.brideName} &amp; {invitation.groomName}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PublishToggle
              invitationId={invitation._id.toString()}
              initialPublished={invitation.published}
            />
            <a
              href={shareUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink-line px-4 py-2 text-xs font-semibold text-ivory/70 transition-colors hover:border-gold/40 hover:text-ivory"
            >
              Preview
            </a>
            <Link
              href="/create"
              className="rounded-full border border-ink-line px-4 py-2 text-xs font-semibold text-ivory/70 transition-colors hover:border-gold/40 hover:text-ivory"
            >
              Edit invitation
            </Link>
          </div>
        </div>

        {/* Continue setup banner */}
        {nextStep && (
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-gold/20 bg-gold/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gold-bright">
                Continue setup
              </p>
              <p className="mt-1 font-display text-lg italic text-ivory">
                {nextStep.label}
              </p>
              {nextStep.description && (
                <p className="mt-0.5 text-xs text-ivory/50">
                  {nextStep.description}
                </p>
              )}
            </div>
            <Link
              href={nextStep.href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-gold-bright"
            >
              Go
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M7.5 4.5 13 10l-5.5 5.5L6 14l4-4-4-4 1.5-1.5Z" />
              </svg>
            </Link>
          </div>
        )}

        {/* Overview stats + setup checklist */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-ivory/40">
              Overview
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <StatTile label="Responses" value={summary.responses} />
              <StatTile label="Attending" value={summary.attendingYes} accent />
              <StatTile label="Maybe" value={summary.maybe} />
              <StatTile label="Total guests" value={summary.headcount} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-ivory/40">
                Setup
              </h2>
              <span className="text-xs text-ivory/40">
                {doneCount}/{checklist.length} · {progressPct}%
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-line">
              <div
                className="h-full rounded-full bg-gold transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <ul className="mt-4 space-y-2">
              {checklist.map((step) => (
                <li
                  key={step.label}
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                    step.done
                      ? "border-ink-line bg-ink-soft/30"
                      : "border-ink-line bg-ink-soft/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                        step.done
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-white/5 text-ivory/30"
                      }`}
                    >
                      {step.done ? (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                          <path d="M8 13.5 4.5 10 3 11.5l5 5 9-9L15.5 6 8 13.5Z" />
                        </svg>
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </span>
                    <div>
                      <p
                        className={`text-sm ${
                          step.done
                            ? "text-ivory/50 line-through decoration-ivory/30"
                            : "font-medium text-ivory"
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.description && !step.done && (
                        <p className="text-xs text-ivory/40">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {!step.done && step.href && (
                    <Link
                      href={step.href}
                      className="shrink-0 text-xs font-semibold text-gold-bright hover:underline"
                    >
                      Go
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTile({ label, value, accent }) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        accent ? "border-gold/30 bg-gold/10" : "border-ink-line bg-ink-soft/60"
      }`}
    >
      <p
        className={`text-2xl font-semibold ${accent ? "text-gold-bright" : "text-ivory"}`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wide text-ivory/45">
        {label}
      </p>
    </div>
  );
}
