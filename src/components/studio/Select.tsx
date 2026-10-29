"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, m } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

interface SelectProps {
  id: string;
  value: string;
  options: string[];
  placeholder: string;
  invalid?: boolean;
  describedBy?: string;
  className?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export default function Select({ id, value, options, placeholder, invalid, describedBy, className = "", onChange, onBlur }: Readonly<SelectProps>) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const close = () => {
    if (listRef.current) listRef.current.style.pointerEvents = "none";
    setOpen(false);
    onBlur?.();
  };

  const show = (index = Math.max(0, options.indexOf(value))) => {
    if (listRef.current) listRef.current.style.pointerEvents = "";
    setActive(index);
    setOpen(true);
  };

  const choose = (index: number) => {
    onChange(options[index]);
    close();
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  });

  useEffect(() => {
    const list = listRef.current;
    const option = list?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    if (!open || !list || !option) return;
    const bottom = option.offsetTop + option.offsetHeight;
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  }, [open, active]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        show();
      }
      return;
    }
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive((i) => Math.min(options.length - 1, i + 1)),
      ArrowUp: () => setActive((i) => Math.max(0, i - 1)),
      Home: () => setActive(0),
      End: () => setActive(options.length - 1),
      Enter: () => choose(active),
      " ": () => choose(active),
      Escape: close,
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    } else if (e.key === "Tab") {
      close();
    } else if (e.key.length === 1) {
      const next = options.findIndex((o) => o.toLocaleLowerCase("tr-TR").startsWith(e.key.toLocaleLowerCase("tr-TR")));
      if (next >= 0) setActive(next);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={invalid ? "true" : "false"}
        aria-describedby={describedBy}
        onClick={(e) => {
          e.currentTarget.focus();
          if (open) close();
          else show();
        }}
        onKeyDown={onKeyDown}
        className={`${className} flex items-center justify-between gap-4 text-left`}
      >
        <span className={value ? "text-ink" : "text-mute/80"}>{value || placeholder}</span>
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          className={`h-4 w-4 shrink-0 text-mute transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path d="m3.5 6 4.5 4.5L12.5 6" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <m.ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={id}
            onMouseDown={(e) => e.preventDefault()}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            className="custom-scrollbar absolute inset-x-0 top-full z-40 mt-2 max-h-[min(22rem,60vh)] overflow-y-auto rounded-[3px] border border-line bg-paper-2 py-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)]"
          >
            {options.map((option, i) => {
              const selected = option === value;
              return (
                <li
                  key={option}
                  id={`${listId}-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={selected}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(i)}
                  className={`flex cursor-pointer items-center justify-between gap-4 px-4 py-3 text-[16px] transition-colors ${
                    i === active ? "bg-night text-bone" : "text-ink/85"
                  }`}
                >
                  <span className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] tabular-nums text-mute">{String(i + 1).padStart(2, "0")}</span>
                    {option}
                  </span>
                  {selected && (
                    <svg aria-hidden viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4 shrink-0 text-clay">
                      <path d="m3.5 8.5 3 3 6-7" />
                    </svg>
                  )}
                </li>
              );
            })}
          </m.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
