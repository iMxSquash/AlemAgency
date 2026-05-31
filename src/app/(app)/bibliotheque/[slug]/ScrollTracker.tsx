"use client";

import { useEffect, useRef } from "react";
import { markAsCompleted } from "./actions";

export function ScrollTracker({ slug, isCompleted }: { slug: string; isCompleted: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const doneRef = useRef(isCompleted);

  useEffect(() => {
    if (doneRef.current) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !doneRef.current) {
          doneRef.current = true;
          observer.disconnect();
          markAsCompleted(slug).catch(console.error);
        }
      },
      { threshold: 1.0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [slug]);

  return <div ref={ref} className="h-px" />;
}
