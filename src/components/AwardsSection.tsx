import { Award as AwardIcon, BadgeCheck, ChessRook, GraduationCap, Medal, Star, Trophy, ExternalLink } from "lucide-react";
import { siteConfig, type AwardType } from "@/config/site";
import { Reveal } from "@/components/Reveal";

const typeMeta: Record<AwardType, { label: string; Icon: typeof Trophy }> = {
  tournament: { label: "Tournament", Icon: Trophy },
  rating: { label: "Rating", Icon: Star },
  coaching: { label: "Coaching milestone", Icon: Medal },
  certificate: { label: "Certificate", Icon: GraduationCap },
  other: { label: "Achievement", Icon: BadgeCheck },
};

export function AwardsSection() {
  const awards = siteConfig.awards;

  return (
    <section id="awards" className="relative overflow-hidden bg-charcoal py-24 text-ivory sm:py-32">
      <div className="bg-grid-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <ChessRook aria-hidden strokeWidth={0.5} className="pointer-events-none absolute -left-20 bottom-0 size-[30rem] text-white/[0.035]" />
      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <Reveal className="text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br from-[#e8d3a2] via-gold to-[#8a6d36] text-midnight shadow-[0_10px_40px_-10px_rgba(201,169,110,0.8)]">
            <Trophy className="size-8" aria-hidden />
          </span>
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-gold">Awards &amp; achievements</p>
          <h2 className="mt-4 text-4xl font-bold text-balance sm:text-5xl lg:text-6xl">Every Move Has a Story.</h2>
        </Reveal>

        {awards.length === 0 ? (
          <Reveal delay={0.1} className="mx-auto mt-10 max-w-2xl text-center">
            <p className="text-lg leading-relaxed text-ivory/80">
              Rather than a wall of trophies, this space is for what matters most: the progress you make. Tournament
              results, ratings and milestones will appear here as they are verified. Until then, the best proof is your
              own next game.
            </p>
            <div className="mx-auto mt-8 flex w-fit items-center gap-3 rounded-full border border-gold/30 px-5 py-2.5 text-sm text-gold">
              <AwardIcon className="size-4" aria-hidden /> Achievements coming soon
            </div>
          </Reveal>
        ) : (
          <ol className="relative mt-16 space-y-8 before:absolute before:bottom-2 before:left-6 before:top-2 before:w-px before:bg-gradient-to-b before:from-gold before:to-transparent sm:before:left-1/2">
            {awards.map((a, i) => {
              const { Icon, label } = typeMeta[a.type];
              const right = i % 2 === 1;
              return (
                <li key={`${a.title}-${i}`} className="relative pl-16 sm:grid sm:grid-cols-2 sm:gap-16 sm:pl-0">
                  <span className="absolute left-0 top-1 grid size-12 place-items-center rounded-full bg-gradient-to-br from-[#e8d3a2] via-gold to-[#8a6d36] text-midnight shadow-lg sm:left-1/2 sm:-translate-x-1/2">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <Reveal className={right ? "sm:col-start-2" : "sm:col-start-1 sm:text-right"}>
                    <div className="glass rounded-3xl p-6">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
                        {label}
                        {a.year ? ` · ${a.year}` : ""}
                      </p>
                      <h3 className="mt-2 text-xl font-bold">{a.title}</h3>
                      {a.description && <p className="mt-2 text-ivory/75">{a.description}</p>}
                      {a.link && (
                        <a href={a.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-lime hover:underline">
                          View proof <ExternalLink className="size-3.5" aria-hidden />
                        </a>
                      )}
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
