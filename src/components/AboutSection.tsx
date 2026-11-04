import Image from "next/image";
import { ChessKnight, Quote } from "lucide-react";
import { activeSocialLinks, siteConfig, socialLabels, type SocialKey } from "@/config/site";
import { InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/icons";
import { Reveal } from "@/components/Reveal";

export const socialIcons: Record<SocialKey, React.ComponentType<React.SVGProps<SVGSVGElement>> | null> = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
  chesscom: null,
  lichess: null,
};

export function SocialIcon({ name, className }: { name: SocialKey; className?: string }) {
  const Icon = socialIcons[name];
  if (Icon) return <Icon className={className} />;
  // Chess.com / Lichess have no lucide brand glyph — use a pawn-style knight mark
  return <ChessKnight className={className} aria-hidden />;
}

export function AboutSection() {
  const { coach } = siteConfig;
  const socials = activeSocialLinks();

  return (
    <section id="about" className="on-light relative overflow-hidden bg-ivory py-24 sm:py-32">
      <div className="bg-checker pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 text-midnight opacity-[0.025] lg:block" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
            <div className="absolute -inset-3 rotate-3 rounded-[2.5rem] bg-sage" aria-hidden />
            <div className="absolute -inset-3 -rotate-2 rounded-[2.5rem] border-2 border-emerald/40" aria-hidden />
            <div className="relative size-full overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-charcoal to-midnight shadow-2xl">
              {coach.profileImage ? (
                <Image
                  src={coach.profileImage}
                  alt={coach.profileImageAlt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 440px"
                  className="object-cover"
                />
              ) : (
                <div className="grid size-full place-items-center">
                  <div className="text-center text-ivory/70">
                    <ChessKnight className="mx-auto size-40 text-lime/80" strokeWidth={1} aria-hidden />
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em]">Your photo here</p>
                  </div>
                </div>
              )}
            </div>
            <div className="glass absolute -bottom-5 -right-3 rounded-2xl bg-midnight/80 px-5 py-3 text-ivory shadow-xl sm:-right-8">
              <p className="font-heading text-sm font-bold">{coach.role}</p>
              <p className="text-xs text-ivory/70">Based in {coach.location}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald">About me</p>
          <h2 className="mt-4 text-4xl font-bold text-balance sm:text-5xl lg:text-6xl">The Mind Behind Zugzwang</h2>
          <p className="mt-6 font-heading text-2xl font-semibold text-emerald">{coach.name}</p>
          <p className="mt-3 max-w-xl text-lg text-midnight/80">{coach.intro}</p>

          <figure className="relative mt-8 rounded-3xl bg-midnight p-7 text-ivory">
            <Quote className="absolute -top-4 left-6 size-9 rounded-full bg-lime p-2 text-midnight" aria-hidden />
            <figcaption className="text-xs font-bold uppercase tracking-[0.2em] text-lime">Chess philosophy</figcaption>
            <blockquote className="mt-2 text-lg leading-relaxed text-ivory/90">{coach.philosophy}</blockquote>
          </figure>

          <h3 className="mt-8 text-lg font-bold">Teaching approach</h3>
          <ul className="mt-3 space-y-2.5">
            {coach.teachingApproach.map((line, i) => (
              <li key={line} className="flex gap-3">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-emerald text-xs font-bold text-white">{i + 1}</span>
                <span className="text-midnight/80">{line}</span>
              </li>
            ))}
          </ul>

          {socials.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-3" aria-label="Social media">
              {socials.map(({ key, url }) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-midnight/15 bg-white px-4 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-emerald hover:text-emerald"
                  >
                    <SocialIcon name={key} className="size-4" />
                    {socialLabels[key]}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  );
}
