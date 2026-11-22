"use client";

import { useEffect, useState } from "react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";

import { DARK, LIGHT, THEME_KEY } from "@/lib/theme";

export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || LIGHT);
  }, []);

  const toggle = () => {
    const next = theme === DARK ? LIGHT : DARK;
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    window.dispatchEvent(new CustomEvent("themechange", { detail: next }));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`btn btn-ghost btn-circle btn-sm text-lg ${className}`}
      title={theme === DARK ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === DARK ? <HiOutlineSun /> : <HiOutlineMoon />}
    </button>
  );
}
