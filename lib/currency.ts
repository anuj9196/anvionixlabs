"use client";

import { useSyncExternalStore } from "react";

export type Currency = "inr" | "usd";

/** Visitors in India see rupees; everyone else dollars. Either can switch. */
function guessCurrency(): Currency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz === "Asia/Kolkata" || tz === "Asia/Calcutta" ? "inr" : "usd";
  } catch {
    return "usd";
  }
}

const noop = () => () => {};

/** The server renders dollars; the browser switches to its guess. */
export function useGuessedCurrency(): Currency {
  return useSyncExternalStore(noop, guessCurrency, () => "usd" as Currency);
}

export const isCurrency = (v: unknown): v is Currency => v === "inr" || v === "usd";
