import { ChessKnight, Coffee } from "lucide-react";
import { activeSocialLinks, siteConfig, socialLabels, whatsappLink } from "@/config/site";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { SocialIcon } from "@/components/AboutSection";

const footerNav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Awards", href: "#awards" },
  { label: "India Time", href: "#india-time" },
  { label: "Feedback", href: "#feedback" },
];

export function Footer() {
  const socials = activeSocialLinks();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-midnight pb-10 pt-20 text-ivory">
      <ChessKnight aria-hidden strokeWidth={0.5} className="pointer-events-none absolute -right-16 -top-16 size-[28rem] text-white/[0.035]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs font-heading text-xl font-semibold leading-snug">
              Every great chess game begins with a single move.
            </p>
            <Button asChild variant="coffee" className="mt-6">
              <a href={siteConfig.buyMeACoffeeUrl} target="_blank" rel="noopener noreferrer">
                <Coffee className="size-5" aria-hidden /> Buy Me a Coffee
              </a>
            </Button>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-lime">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {footerNav.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-ivory/80 transition hover:text-lime">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-lime">Follow</h2>
            {socials.length > 0 ? (
              <ul className="mt-4 space-y-2.5">
                {socials.map(({ key, url }) => (
                  <li key={key}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-ivory/80 transition hover:text-lime">
                      <SocialIcon name={key} className="size-4" /> {socialLabels[key]}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 max-w-[14rem] text-sm text-ivory/60">Social profiles are coming soon.</p>
            )}
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-lime">Talk to me</h2>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2.5 rounded-full bg-whatsapp px-5 py-3 font-semibold text-midnight transition hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="size-5" /> {siteConfig.contact.whatsappDisplay}
            </a>
            <p className="mt-3 text-sm text-ivory/60">Free intro call · No commitment</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-ivory/60 sm:flex-row">
          <p>© {year} {siteConfig.brand.name}. All rights reserved.</p>
          <ul className="flex gap-6">
            <li><a href="/privacy" className="hover:text-lime">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-lime">Terms &amp; Conditions</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
