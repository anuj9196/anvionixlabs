"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { SITE } from "@/data/site";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
let loading: Promise<TurnstileApi> | null = null;

/** Load Cloudflare's script once, only when a page with the form mounts. */
function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loading) {
    loading = new Promise<TurnstileApi>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("turnstile missing")));
      script.onerror = () => {
        loading = null; // a later mount may try again
        script.remove();
        reject(new Error("turnstile blocked"));
      };
      document.head.appendChild(script);
    });
  }
  return loading;
}

export type TurnstileHandle = { reset: () => void };

type Props = {
  /** The token when the check passes, "" when it expires or errors. */
  onToken: (token: string) => void;
  /** The script or widget could not start (blocked, offline). */
  onUnavailable?: () => void;
  ref?: Ref<TurnstileHandle>;
};

/**
 * Cloudflare Turnstile, rendered explicitly. "interaction-only": most visitors see nothing; the
 * widget appears only when Cloudflare wants a click. Colours follow the visitor's colour scheme.
 */
export function TurnstileWidget({ onToken, onUnavailable, ref }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onUnavailableRef = useRef(onUnavailable);
  useEffect(() => {
    onTokenRef.current = onToken;
    onUnavailableRef.current = onUnavailable;
  });

  useImperativeHandle(ref, () => ({
    reset: () => {
      onTokenRef.current("");
      if (widgetId.current !== null) window.turnstile?.reset(widgetId.current);
    },
  }));

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then((api) => {
        if (cancelled || !box.current) return;
        widgetId.current = api.render(box.current, {
          sitekey: SITE.turnstileSiteKey,
          action: "quote",
          theme: "auto",
          size: "flexible",
          appearance: "interaction-only",
          "refresh-expired": "auto",
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(""),
          "timeout-callback": () => onTokenRef.current(""),
          "error-callback": () => {
            onTokenRef.current("");
            onUnavailableRef.current?.();
          },
        });
      })
      .catch(() => onUnavailableRef.current?.());
    return () => {
      cancelled = true;
      if (widgetId.current !== null) window.turnstile?.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  return <div ref={box} data-turnstile className="[&:has(iframe)]:mt-8" />;
}
