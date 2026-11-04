"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Chess, DEFAULT_POSITION, type Square } from "chess.js";
import { Chessboard, type PieceDropHandlerArgs, type SquareHandlerArgs } from "react-chessboard";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CalendarCheck, Lock, MessageCircle, Sparkles, UserRound, ArrowLeft } from "lucide-react";
import { whatsappLink } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ContactForm } from "@/components/ContactForm";
import { useBooking } from "@/components/BookingProvider";
import { Reveal } from "@/components/Reveal";

const LIGHT = "#F2ECD9";
const DARK = "#4E8A6A";
const SELECTED = "rgba(215, 243, 107, 0.75)";

const dotStyle = (capture: boolean): CSSProperties => ({
  background: capture
    ? "radial-gradient(circle, transparent 58%, rgba(16,26,36,0.38) 60%, rgba(16,26,36,0.38) 74%, transparent 76%)"
    : "radial-gradient(circle, rgba(16,26,36,0.34) 0 17%, transparent 19%)",
});

type MoveResult = { san: string; from: string; to: string };

export function InteractiveChessboard() {
  const reduceMotion = useReducedMotion();
  const gameRef = useRef(new Chess());
  const lockedRef = useRef(false);
  const { openBooking } = useBooking();

  const [fen, setFen] = useState<string>(DEFAULT_POSITION);
  const [selected, setSelected] = useState<Square | null>(null);
  const [targets, setTargets] = useState<{ square: string; capture: boolean }[]>([]);
  const [played, setPlayed] = useState<MoveResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState<"choices" | "form">("choices");

  const clearSelection = useCallback(() => {
    setSelected(null);
    setTargets([]);
  }, []);

  /** Attempts the visitor's one move. Returns true only for a legal move. */
  const tryMove = useCallback(
    (from: string, to: string): boolean => {
      if (lockedRef.current) return false;
      const game = gameRef.current;
      let move;
      try {
        move = game.move({ from, to, promotion: "q" });
      } catch {
        return false; // illegal — does NOT consume the move
      }
      lockedRef.current = true; // exactly ONE move
      clearSelection();
      setMessage(null);
      setFen(game.fen());
      setPlayed({ san: move.san, from: move.from, to: move.to });
      return true;
    },
    [clearSelection],
  );

  const selectSquare = useCallback(
    (square: Square) => {
      const moves = gameRef.current.moves({ square, verbose: true });
      if (moves.length === 0) {
        setMessage("That piece can't move right now — try another one.");
        clearSelection();
        return;
      }
      setMessage(null);
      setSelected(square);
      setTargets(moves.map((m) => ({ square: m.to, capture: Boolean(m.captured) })));
    },
    [clearSelection],
  );

  const onSquareClick = useCallback(
    ({ square, piece }: SquareHandlerArgs) => {
      if (lockedRef.current) return;
      const sq = square as Square;
      if (selected && targets.some((t) => t.square === sq)) {
        tryMove(selected, sq);
        return;
      }
      if (piece && piece.pieceType.startsWith("w")) {
        if (selected === sq) clearSelection();
        else selectSquare(sq);
        return;
      }
      if (selected) {
        setMessage("That's not a legal move for this piece. Try one of the highlighted squares.");
        clearSelection();
      } else if (piece) {
        setMessage("You play White — choose a white piece to start.");
      }
    },
    [selected, targets, tryMove, selectSquare, clearSelection],
  );

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }: PieceDropHandlerArgs): boolean => {
      if (!targetSquare || sourceSquare === targetSquare) return false;
      const ok = tryMove(sourceSquare, targetSquare);
      if (!ok && !lockedRef.current) setMessage("That's not a legal move — your move is still waiting. Try again!");
      return ok;
    },
    [tryMove],
  );

  // Reveal the modal shortly after the piece animation finishes.
  useEffect(() => {
    if (!played) return;
    const t = window.setTimeout(() => setModalOpen(true), reduceMotion ? 300 : 1100);
    return () => window.clearTimeout(t);
  }, [played, reduceMotion]);

  const squareStyles = useMemo(() => {
    const styles: Record<string, CSSProperties> = {};
    if (played) {
      styles[played.from] = { background: "rgba(215, 243, 107, 0.45)" };
      styles[played.to] = { background: "rgba(215, 243, 107, 0.7)" };
    }
    if (selected) styles[selected] = { background: SELECTED };
    for (const t of targets) styles[t.square] = { ...styles[t.square], ...dotStyle(t.capture) };
    return styles;
  }, [played, selected, targets]);

  const notation = played ? `1. ${played.san}` : null;
  const waMessage = played
    ? `Hi! I just visited Zugzwang and tried the interactive chessboard (I played ${notation}). I'd love to know more about your coaching sessions and book a free introductory call.`
    : undefined;

  const closeThen = (fn: () => void) => () => {
    setModalOpen(false);
    window.setTimeout(fn, 180);
  };

  return (
    <section id="challenge" className="relative overflow-hidden bg-midnight py-24 text-ivory sm:py-32">
      <div className="bg-grid-lines pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-emerald/25 blur-[120px]" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-lime">The one-move challenge</p>
          <h2 className="mt-4 text-4xl font-bold text-balance sm:text-5xl lg:text-6xl">
            One move. One conversation. Endless possibilities.
          </h2>
          <p className="mt-5 text-lg text-ivory/75">Make your first move and let&apos;s start your chess journey.</p>
        </Reveal>

        <div className="mx-auto mt-12 flex max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-14">
          {/* ------------------------------ Board ------------------------------ */}
          <div className="w-full max-w-[560px]">
            <div className="relative rounded-[1.75rem] bg-charcoal p-2.5 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] ring-1 ring-white/10 sm:p-3.5">
              <div
                className="relative aspect-square w-full touch-manipulation select-none overflow-hidden rounded-2xl"
                aria-label="Interactive chessboard. You play White and make one move."
              >
                <Chessboard
                  options={{
                    id: "zugzwang-board",
                    position: fen,
                    boardOrientation: "white",
                    lightSquareStyle: { backgroundColor: LIGHT },
                    darkSquareStyle: { backgroundColor: DARK },
                    squareStyles,
                    showNotation: true,
                    alphaNotationStyle: { fontSize: "clamp(9px, 2.2vw, 13px)", fontWeight: 700, bottom: 2, right: 4, left: "auto" },
                    numericNotationStyle: { fontSize: "clamp(9px, 2.2vw, 13px)", fontWeight: 700, top: 2, left: 4 },
                    animationDurationInMs: reduceMotion ? 0 : 320,
                    allowDragging: !played,
                    allowDrawingArrows: false,
                    canDragPiece: ({ piece }) => !lockedRef.current && piece.pieceType.startsWith("w"),
                    onPieceDrop,
                    onSquareClick,
                    boardStyle: { borderRadius: 16, touchAction: "manipulation" },
                  }}
                />

                {/* Success burst */}
                <AnimatePresence>
                  {played && (
                    <motion.div
                      key="burst"
                      className="pointer-events-none absolute inset-0 grid place-items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        initial={reduceMotion ? false : { scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.25 }}
                        className="flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 font-heading text-xl font-bold text-midnight shadow-xl"
                      >
                        <Sparkles className="size-5" aria-hidden /> {notation}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-5 min-h-12 text-center" aria-live="polite">
              {played ? (
                <p className="flex items-center justify-center gap-2 font-medium text-lime">
                  <Lock className="size-4" aria-hidden />
                  Move played: <span className="font-heading text-lg font-bold">{notation}</span> — the board is now locked.
                </p>
              ) : message ? (
                <p className="font-medium text-gold">{message}</p>
              ) : (
                <p className="text-ivory/75">Drag a white piece or tap it and choose a destination square.</p>
              )}
            </div>
          </div>

          {/* --------------------------- Side panel --------------------------- */}
          <div className="w-full max-w-md text-center lg:pt-6 lg:text-left">
            <ol className="space-y-4 text-left">
              {[
                ["1", "Pick a white piece", "Drag it, or tap it to see its legal squares."],
                ["2", "Make your one move", "Illegal moves never count — try again until it's legal."],
                ["3", "Start the conversation", "Book a free call, message me, or share your chess handle."],
              ].map(([n, title, text]) => (
                <li key={n} className="glass flex gap-4 rounded-2xl p-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-lime font-heading font-bold text-midnight">{n}</span>
                  <span>
                    <span className="block font-heading font-semibold">{title}</span>
                    <span className="text-sm text-ivory/70">{text}</span>
                  </span>
                </li>
              ))}
            </ol>

            <AnimatePresence>
              {played && !modalOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-3"
                >
                  <p className="font-heading text-lg font-semibold">Nice move! ♟ Ready for your next step?</p>
                  <Button variant="primary" size="lg" className="w-full" onClick={openBooking}>
                    <CalendarCheck className="size-5" aria-hidden /> Schedule My FREE Call
                  </Button>
                  <Button asChild variant="whatsapp" size="lg" className="w-full">
                    <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="size-5" aria-hidden /> Chat With Me on WhatsApp
                    </a>
                  </Button>
                  <Button variant="glass" size="lg" className="w-full" onClick={() => { setView("form"); setModalOpen(true); }}>
                    <UserRound className="size-5" aria-hidden /> Let Me Share My Chess Handle
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ------------------------------ Modal ------------------------------ */}
      <Dialog open={modalOpen} onOpenChange={(o) => { setModalOpen(o); if (!o) setView("choices"); }}>
        <DialogContent>
          {view === "choices" ? (
            <div className="text-center">
              <motion.div
                initial={reduceMotion ? false : { rotate: -20, scale: 0.4 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 12 }}
                className="mx-auto grid size-20 place-items-center rounded-full bg-emerald text-5xl text-white"
                aria-hidden
              >
                ♞
              </motion.div>
              <DialogTitle className="mt-5 font-heading text-3xl font-bold">Nice move! ♟</DialogTitle>
              <DialogDescription className="mx-auto mt-2 max-w-sm text-midnight/75">
                Every chess journey starts somewhere. Ready to take your next step?
              </DialogDescription>
              {notation && (
                <p className="mx-auto mt-3 w-fit rounded-full bg-midnight px-4 py-1 font-heading text-sm font-semibold text-lime">
                  You played {notation}
                </p>
              )}
              <div className="mt-6 space-y-3">
                <Button variant="primary" size="lg" className="w-full bg-midnight text-lime shadow-none hover:bg-charcoal hover:text-lime" onClick={closeThen(openBooking)}>
                  <CalendarCheck className="size-5" aria-hidden /> Schedule My FREE Call
                </Button>
                <Button asChild variant="whatsapp" size="lg" className="w-full">
                  <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-5" aria-hidden /> Chat With Me on WhatsApp
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="w-full" onClick={() => setView("form")}>
                  <UserRound className="size-5" aria-hidden /> Let Me Share My Chess Handle
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => setView("choices")}
                className="mb-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full text-sm font-semibold text-emerald hover:underline"
              >
                <ArrowLeft className="size-4" aria-hidden /> Back
              </button>
              <DialogTitle className="font-heading text-2xl font-bold">Share your chess handle</DialogTitle>
              <DialogDescription className="mb-5 mt-1 text-sm text-midnight/70">
                Leave your name and where to find you — I&apos;ll reach out personally.
              </DialogDescription>
              <ContactForm source="chessboard" compact idPrefix="board" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

