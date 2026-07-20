import Link from "next/link";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import ModernTemplate from "@/components/templates/ModernTemplate";
import CulturalTemplate from "@/components/templates/CulturalTemplate";

const showcaseData = {
  brideName: "Selam",
  groomName: "Dawit",
  brideParents: "Ato Tadesse & Woizero Almaz",
  groomParents: "Ato Berhanu & Woizero Aster",
  weddingDate: "2027-01-10",
  weddingTime: "12:00 PM",
  venueName: "Sheraton Addis",
  venueAddress: "Taitu St, Addis Ababa",
  personalMessage:
    "Our families joyfully invite you to celebrate the beginning of our new life together.",
};

const steps = [
  {
    n: "01",
    title: "Tell your story",
    body: "Names, families, venue, and the little details that make your day yours — entered once, in plain language.",
  },
  {
    n: "02",
    title: "Pick a design",
    body: "Three distinct templates, from classic ivory to modern minimal, each rendered instantly with your details.",
  },
  {
    n: "03",
    title: "Send the link",
    body: "One link, shared on Telegram, WhatsApp, or SMS. No printing, no courier, no lost cards.",
  },
];

export default function Home() {
  return (
    <div className="bg-ink">
      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:px-10 sm:pt-28 lg:pb-32">
        {/* Ambient gold glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-gold/10 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[-10%] h-80 w-80 rounded-full bg-clay/30 blur-[100px]"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Copy */}
          <div>
            <p
              className="animate-rise text-xs font-semibold uppercase tracking-[0.3em] text-gold/80"
              style={{ animationDelay: "0ms" }}
            >
              Digital wedding invitations
            </p>

            <h1
              className="animate-rise mt-5 font-display text-5xl font-normal leading-[1.05] text-ivory sm:text-6xl lg:text-[4.5rem]"
              style={{ animationDelay: "80ms" }}
            >
              Your love story,
              <br />
              <span className="italic text-gold-bright">beautifully</span>{" "}
              sent.
            </h1>

            <p
              className="animate-rise mt-6 max-w-lg text-base leading-relaxed text-ivory/65 sm:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              Zewd replaces the printed card with something guests actually
              keep open on their phone — a premium Habesha wedding invitation,
              built in minutes and shared with one link.
            </p>

            <div
              className="animate-rise mt-9 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/create"
                className="rounded-full bg-gold px-7 py-3.5 text-sm font-semibold text-ink transition-all hover:bg-gold-bright hover:shadow-[0_0_0_6px_oklch(0.74_0.12_78/0.15)]"
              >
                Create your invitation
              </Link>
              <Link
                href="#templates"
                className="rounded-full border border-ink-line px-7 py-3.5 text-sm font-semibold text-ivory/80 transition-colors hover:border-gold/50 hover:text-ivory"
              >
                Browse templates
              </Link>
            </div>

            <p
              className="animate-rise mt-8 text-xs uppercase tracking-[0.2em] text-ivory/35"
              style={{ animationDelay: "320ms" }}
            >
              No app for your guests to install · No printing costs
            </p>
          </div>

          {/* Preview stack */}
          <div
            className="animate-rise relative mx-auto w-full max-w-xs sm:max-w-sm"
            style={{ animationDelay: "200ms" }}
          >
            <div className="absolute -inset-x-6 -inset-y-8 -z-10 rounded-[2rem] bg-gradient-to-br from-gold/10 to-transparent blur-2xl" />

            <div className="absolute -right-6 top-10 hidden w-56 rotate-6 overflow-hidden rounded-lg border border-ink-line shadow-2xl shadow-black/40 sm:block">
              <div className="aspect-[3.5/5]">
                <CulturalTemplate data={showcaseData} />
              </div>
            </div>

            <div className="relative w-full -rotate-3 overflow-hidden rounded-lg border border-ink-line shadow-2xl shadow-black/50 transition-transform duration-500 hover:rotate-0">
              <div className="aspect-[3.5/5]">
                <ClassicTemplate data={showcaseData} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="border-t border-ink-line bg-ink-soft/40 px-6 py-20 sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-3">
          <div>
            <h3 className="font-display text-xl italic text-gold-bright">
              Built for Habesha weddings
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ivory/60">
              Bilingual layouts, Amharic honorifics, and cultural motifs
              woven in — not bolted on as an afterthought.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl italic text-gold-bright">
              Live as you type
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ivory/60">
              Every field updates your invitation instantly, so you always
              see exactly what your guests will.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xl italic text-gold-bright">
              One link, every guest
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ivory/60">
              Share once on WhatsApp or Telegram. No print run, no courier,
              nothing lost in the mail.
            </p>
          </div>
        </div>
      </section>

      {/* TEMPLATES SHOWCASE */}
      <section id="templates" className="px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl italic text-ivory sm:text-4xl">
              Three designs, one afternoon of work.
            </h2>
            <p className="mt-4 text-ivory/60">
              Each template is a complete, ready-to-send invitation.
              Switch between them at any time while you design yours.
            </p>
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            <TemplateCard
              label="Classic Ivory"
              description="Timeless serif elegance with a hairline gold frame."
            >
              <ClassicTemplate data={showcaseData} />
            </TemplateCard>
            <TemplateCard
              label="Modern Charcoal"
              description="Sleek, editorial minimalism in ink and gold."
            >
              <ModernTemplate data={showcaseData} />
            </TemplateCard>
            <TemplateCard
              label="Cultural Gold"
              description="A rich Habesha layout with tilet-inspired bands."
            >
              <CulturalTemplate data={showcaseData} />
            </TemplateCard>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        className="border-t border-ink-line bg-ink-soft/40 px-6 py-24 sm:px-10"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl italic text-ivory sm:text-4xl">
            From blank page to sent invitation.
          </h2>

          <div className="relative mt-16 grid gap-12 sm:grid-cols-3">
            <div
              aria-hidden
              className="absolute left-0 right-0 top-5 hidden h-px bg-ink-line sm:block"
            />
            {steps.map((step) => (
              <div key={step.n} className="relative">
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-ink font-display text-sm text-gold-bright">
                  {step.n}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-ivory">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/60">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-28 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl italic text-ivory sm:text-5xl">
            Your guests deserve more than a card.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-ivory/60">
            Start building your invitation now — it's free to try, and you
            can preview every template before you send a single link.
          </p>
          <Link
            href="/create"
            className="mt-9 inline-block rounded-full bg-gold px-8 py-4 text-sm font-semibold text-ink transition-all hover:bg-gold-bright hover:shadow-[0_0_0_6px_oklch(0.74_0.12_78/0.15)]"
          >
            Create your invitation
          </Link>
        </div>
      </section>
    </div>
  );
}

function TemplateCard({ label, description, children }) {
  return (
    <div className="group">
      <div className="aspect-[3.5/5] overflow-hidden rounded-lg border border-ink-line shadow-xl shadow-black/30 transition-transform duration-500 group-hover:-translate-y-1.5">
        {children}
      </div>
      <h3 className="mt-5 text-base font-semibold text-ivory">{label}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ivory/55">
        {description}
      </p>
    </div>
  );
}
