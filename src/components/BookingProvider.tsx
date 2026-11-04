"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalEmbed } from "@/components/CalEmbed";

type Ctx = { openBooking: () => void };
const BookingContext = createContext<Ctx>({ openBooking: () => {} });

export const useBooking = () => useContext(BookingContext);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openBooking = useCallback(() => setOpen(true), []);
  const value = useMemo(() => ({ openBooking }), [openBooking]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl p-4 sm:p-6" closeLabel="Close booking">
          <DialogTitle className="pr-10 font-heading text-2xl font-bold">
            Book your FREE {siteConfig.booking.callDurationMinutes}-minute call
          </DialogTitle>
          <DialogDescription className="mb-4 mt-1 text-sm text-midnight/70">
            Times are shown in your own timezone automatically.
          </DialogDescription>
          {open && <CalEmbed namespace="zugzwang-modal" />}
          <div className="mt-4 flex flex-col items-center justify-between gap-3 rounded-2xl bg-sage/50 p-4 sm:flex-row">
            <p className="text-sm font-medium">Booking inconvenient? Continue on WhatsApp instead.</p>
            <Button asChild variant="whatsapp" size="sm">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" aria-hidden /> WhatsApp me
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </BookingContext.Provider>
  );
}
