"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LEAD_STATUSES } from "@/lib/validation";

export function LeadStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [error, setError] = useState(false);
  const [pending, start] = useTransition();

  async function change(next: string) {
    const prev = value;
    setValue(next);
    setError(false);
    const res = await fetch("/api/admin/update?type=lead", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: next }),
    });
    if (!res.ok) {
      setValue(prev);
      setError(true);
      return;
    }
    start(() => router.refresh());
  }

  return (
    <div>
      <Select
        aria-label="Lead status"
        value={value}
        disabled={pending}
        onChange={(e) => change(e.target.value)}
        className="h-10 min-w-32 rounded-xl py-0 text-sm capitalize"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </Select>
      {error && <p role="alert" className="mt-1 text-xs font-medium text-red-700">Update failed</p>}
    </div>
  );
}

export function FeedbackApproveButton({ id, approved }: { id: string; approved: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState(false);

  async function toggle() {
    setError(false);
    const res = await fetch("/api/admin/update?type=feedback", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, approved: !approved }),
    });
    if (!res.ok) return setError(true);
    start(() => router.refresh());
  }

  return (
    <div>
      <Button size="sm" variant={approved ? "outline" : "emerald"} disabled={pending} onClick={toggle}>
        {approved ? "Hide" : "Approve"}
      </Button>
      {error && <p role="alert" className="mt-1 text-xs font-medium text-red-700">Update failed</p>}
    </div>
  );
}
