"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store";

export function FocusManager() {
  const { focusMode, toggleFocusMode } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFocusMode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleFocusMode]);

  useEffect(() => {
    if (focusMode) {
      document.body.classList.add("focus-mode-active");
    } else {
      document.body.classList.remove("focus-mode-active");
    }
  }, [focusMode]);

  if (!focusMode) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-500">
      <div className="absolute inset-0 bg-black/40 mix-blend-multiply transition-opacity duration-500" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.8)_100%)] transition-opacity duration-500" />
    </div>
  );
}
