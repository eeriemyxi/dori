// Popover.tsx
import React, {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  dim?: boolean;
  offset?: number; // px offset from trigger (defaults to 8)
};

export default function Popover({
  trigger,
  children,
  dim = true,
  offset = 8,
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  const triggerRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // compute position for bottom-center placement
  const updatePosition = () => {
    const t = triggerRef.current;
    if (!t) return setPos(null);
    const rect = t.getBoundingClientRect();
    const left = rect.left + rect.width / 2; // we'll translateX(-50%)
    const top = rect.bottom + offset; // fixed top in viewport coords
    setPos({ left, top });
  };

  useLayoutEffect(() => {
    if (open) updatePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    function handleDocDown(e: MouseEvent) {
      const target = e.target as Node | null;
      if (
        open &&
        popoverRef.current &&
        triggerRef.current &&
        // if click is outside both trigger and popover, close
        !popoverRef.current.contains(target) &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    window.addEventListener("mousedown", handleDocDown);
    window.addEventListener("keydown", handleEsc);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true); // true to catch scrolling in scrollable ancestors

    return () => {
      window.removeEventListener("mousedown", handleDocDown);
      window.removeEventListener("keydown", handleEsc);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Portal markup (overlay + popover) — appended to document.body
  const portal = (
    <>
      {/* overlay */}
      {dim && (
        <div
          onClick={() => setOpen(false)}
          className={`fixed inset-0 bg-accent/30 backdrop-brightness-110 backdrop-blur-xs transition-opacity duration-150 ${
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } z-40`}
        />
      )}

      {/* popover (positioned using fixed coords so it isn't affected by parent transforms) */}
      {pos &&
        createPortal(
          <div
            ref={popoverRef}
            // position fixed so portal sits relative to viewport
            style={{
              position: "fixed",
              left: `${pos.left}px`,
              top: `${pos.top}px`,
              transform: "translateX(-50%)",
            }}
            className={`z-50 transform origin-top transition duration-150
              ${open ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"}
            `}
            // stop clicks inside from bubbling to the overlay (overlay closes on click)
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-xl bg-white border border-2 border-border shadow-xl w-56 overflow-hidden">
              {children}
            </div>
          </div>,
          typeof document !== "undefined"
            ? document.body
            : document.createElement("div"),
        )}
    </>
  );

  return (
    <>
      {/* trigger rendered in-place so we can measure it */}
      <div
        ref={triggerRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((s) => !s);
        }}
        // inline-block keeps trigger size as expected
        className="inline-block"
      >
        {trigger}
      </div>

      {/* portal pieces (overlay+popover). Using createPortal internally above for popover,
      but overlay is inserted in DOM as usual here via portal pattern — we render overlay normally
      to avoid duplicate portals complexity */}
      {typeof document !== "undefined"
        ? createPortal(portal, document.body)
        : null}
    </>
  );
}
