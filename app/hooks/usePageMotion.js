"use client";

import { useEffect } from "react";

export function usePageMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealElements = Array.from(document.querySelectorAll(".reveal"));
    let revealObserver;

    if (!reducedMotion && "IntersectionObserver" in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
      );
      revealElements.forEach((element) => revealObserver.observe(element));
    } else {
      revealElements.forEach((element) => element.classList.add("visible"));
    }

    const header = document.querySelector(".site-header");
    let scrollFrame = 0;
    const updateScrollState = () => {
      scrollFrame = 0;
      const scrollable = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      document.documentElement.style.setProperty("--page-progress", progress);
      header?.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    const handleScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateScrollState);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollState();

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const tiltCleanups = [];
    if (finePointer && !reducedMotion) {
      document.querySelectorAll("[data-tilt]").forEach((element) => {
        let rect = null;
        let tiltFrame = 0;
        let latestEvent = null;

        const updateTilt = () => {
          tiltFrame = 0;
          if (!rect || !latestEvent) return;
          const x = (latestEvent.clientX - rect.left) / rect.width - 0.5;
          const y = (latestEvent.clientY - rect.top) / rect.height - 0.5;
          element.style.transform =
            `perspective(1000px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
        };
        const handleEnter = () => {
          rect = element.getBoundingClientRect();
        };
        const handleTilt = (event) => {
          latestEvent = event;
          if (!tiltFrame) tiltFrame = window.requestAnimationFrame(updateTilt);
        };
        const resetTilt = () => {
          rect = null;
          latestEvent = null;
          element.style.transform = "";
          if (tiltFrame) window.cancelAnimationFrame(tiltFrame);
          tiltFrame = 0;
        };

        element.addEventListener("pointerenter", handleEnter);
        element.addEventListener("pointermove", handleTilt, { passive: true });
        element.addEventListener("pointerleave", resetTilt);
        tiltCleanups.push(() => {
          element.removeEventListener("pointerenter", handleEnter);
          element.removeEventListener("pointermove", handleTilt);
          element.removeEventListener("pointerleave", resetTilt);
          if (tiltFrame) window.cancelAnimationFrame(tiltFrame);
        });
      });
    }

    return () => {
      revealObserver?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      tiltCleanups.forEach((cleanup) => cleanup());
    };
  }, []);
}
