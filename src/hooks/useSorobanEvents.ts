import { useState, useEffect, useRef, useCallback } from "react";
import { getSorobanClient } from "@/soroban";

export interface SorobanEvent {
  id: string;
  type: string;
  contractId: string;
  ledger: number;
  value: unknown;
}

interface UseSorobanEventsOptions {
  /** Contract ID to filter events for. */
  contractId: string;
  /** Polling interval in milliseconds. Defaults to 10 000 ms. */
  intervalMs?: number;
  /** Only surface events matching these topic prefixes (e.g. ["transfer", "mint"]). */
  topics?: string[];
}

/**
 * Issue #193: Polls the Soroban RPC `getEvents` endpoint at a configurable
 * interval and returns new events as they arrive.
 *
 * - Caches `startLedger` so old events are never re-fetched.
 * - Pauses polling while the browser tab is hidden to save resources.
 */
export function useSorobanEvents({
  contractId,
  intervalMs = 10_000,
  topics = [],
}: UseSorobanEventsOptions) {
  const [events, setEvents] = useState<SorobanEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Persist the last-seen ledger across renders without triggering re-renders.
  const startLedgerRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const poll = useCallback(async () => {
    // Pause when the tab is hidden.
    if (typeof document !== "undefined" && document.hidden) return;

    try {
      const client = getSorobanClient();

      // Build the filter. soroban-client expects topic filters as arrays of
      // ScVal strings; we pass raw string segments and let the RPC match them.
      const filters: any[] = [
        {
          type: "contract",
          contractIds: [contractId],
          ...(topics.length > 0 && { topics: [topics] }),
        },
      ];

      const result = await (client as any).getEvents({
        startLedger: startLedgerRef.current || undefined,
        filters,
        limit: 100,
      });

      if (!result?.events?.length) return;

      const parsed: SorobanEvent[] = result.events.map((e: any) => ({
        id: e.id ?? String(e.ledger) + e.pagingToken,
        type: e.topic?.[0] ?? "unknown",
        contractId: e.contractId ?? contractId,
        ledger: Number(e.ledger ?? 0),
        value: e.value,
      }));

      // Advance the cursor so the next poll only fetches newer events.
      const maxLedger = Math.max(...parsed.map((e) => e.ledger));
      if (maxLedger > startLedgerRef.current) {
        startLedgerRef.current = maxLedger + 1;
      }

      setEvents((prev) => [...prev, ...parsed]);
      setError(null);
    } catch (err: any) {
      // Non-fatal: log and continue polling.
      setError(err.message ?? "Failed to fetch Soroban events");
    }
  }, [contractId, topics]);

  useEffect(() => {
    if (!contractId) return;

    // Kick off immediately, then schedule repeating polls.
    poll();

    const schedule = () => {
      timerRef.current = setTimeout(async () => {
        await poll();
        schedule();
      }, intervalMs);
    };
    schedule();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [poll, intervalMs, contractId]);

  const clearEvents = useCallback(() => setEvents([]), []);

  return { events, error, clearEvents };
}
