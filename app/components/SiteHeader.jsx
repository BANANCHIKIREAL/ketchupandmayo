"use client";

import { useEffect, useState } from "react";
import { LEVELS } from "../site-data";

const NAV_ITEMS = [
  { href: "#run", label: "Current" },
  { href: "#zodiac", label: "Next" },
  { href: "#hardest", label: "Hardest" },
  { href: "#profile", label: "Profile" },
  { href: "#set", label: "Icon set" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentRun = LEVELS[0];

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    document.body.classList.toggle("menu-open", menuOpen);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  return (
    <header className={`site-header${menuOpen ? " menu-is-open" : ""}`}>
      <a className="brand" href="#top" aria-label="На главную">
        <span className="brand-mark"><span /></span>
        <span className="brand-copy">
          <strong>K&amp;M</strong>
          <small>PLAYER FILE</small>
        </span>
      </a>

      <nav id="site-navigation" aria-label="Основная навигация">
        {NAV_ITEMS.map((item) => (
          <a href={item.href} onClick={() => setMenuOpen(false)} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-status" href="#run">
        <span><i /> EON</span>
        <strong>{currentRun.progress.toFixed(currentRun.decimals)}%</strong>
      </a>

      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
        aria-controls="site-navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
      </button>
    </header>
  );
}
