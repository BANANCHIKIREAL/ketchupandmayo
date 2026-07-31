"use client";

import { useEffect, useMemo, useState } from "react";
import { ICON_FORMS, buildPreviewIconUrl } from "../site-data";

const RENDERER_READY_EVENT = "gd-icon-renderer-ready";
let rendererRuntimePromise;

function createPreviewIcons(profile) {
  return Object.fromEntries(
    ICON_FORMS.map(({ form, field }) => {
      const serverSource = buildPreviewIconUrl(profile, form, field);
      return [form, { url: serverSource, serverSource, quality: "loading" }];
    }),
  );
}

function waitForRenderer() {
  if (window.GDIconRenderer) return Promise.resolve(window.GDIconRenderer);

  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      window.removeEventListener(RENDERER_READY_EVENT, handleReady);
      reject(new Error("GDBrowser renderer did not become ready"));
    }, 20000);

    const handleReady = () => {
      window.clearTimeout(timeout);
      window.removeEventListener(RENDERER_READY_EVENT, handleReady);
      resolve(window.GDIconRenderer);
    };

    window.addEventListener(RENDERER_READY_EVENT, handleReady, { once: true });
    if (window.GDIconRenderer) handleReady();
  });
}

function loadScript(id, src, isReady) {
  if (isReady()) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.addEventListener("load", resolve, { once: true });
    script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), {
      once: true,
    });
    document.head.appendChild(script);
  });
}

function ensureRendererRuntime() {
  if (window.GDIconRenderer) return Promise.resolve(window.GDIconRenderer);
  if (rendererRuntimePromise) return rendererRuntimePromise;

  rendererRuntimePromise = (async () => {
    await loadScript(
      "gd-pixi-runtime",
      "https://gdbrowser.com/iconkit/libs/pixi.js",
      () => Boolean(window.PIXI),
    );
    await loadScript(
      "gd-icon-runtime",
      "https://gdbrowser.com/iconkit/icon.js?v=3",
      () => typeof window.Icon === "function",
    );
    await loadScript(
      "gd-renderer-runtime",
      "/gdbrowser-renderer.js?v=3",
      () => Boolean(window.GDIconRenderer),
    );
    return waitForRenderer();
  })().catch((error) => {
    rendererRuntimePromise = null;
    throw error;
  });

  return rendererRuntimePromise;
}

export function useGdIcons(profile) {
  const signature = ICON_FORMS
    .map(({ field }) => profile[field])
    .concat(profile.col1, profile.col2, profile.colG, Boolean(profile.glow))
    .join(":");

  const iconProfile = useMemo(() => {
    const value = {
      col1: profile.col1,
      col2: profile.col2,
      colG: profile.colG,
      glow: profile.glow,
    };
    ICON_FORMS.forEach(({ field }) => {
      value[field] = profile[field];
    });
    return value;
  }, [signature]);

  const previewIcons = useMemo(() => createPreviewIcons(iconProfile), [iconProfile]);
  const [icons, setIcons] = useState(previewIcons);
  const [renderStatus, setRenderStatus] = useState({ total: ICON_FORMS.length, uhd: 0 });

  useEffect(() => {
    let cancelled = false;
    setIcons(previewIcons);
    setRenderStatus({ total: ICON_FORMS.length, uhd: 0 });

    const render = async () => {
      try {
        const renderer = await ensureRendererRuntime();
        const renderedIcons = {};
        let renderedCount = 0;
        const renderOrder = [
          ICON_FORMS.find(({ form }) => form === "cube"),
          ...ICON_FORMS.filter(({ form }) => form !== "cube"),
        ];

        for (const formConfig of renderOrder) {
          if (cancelled) return;

          const serverSource = buildPreviewIconUrl(
            iconProfile,
            formConfig.form,
            formConfig.field,
          );

          try {
            const url = await renderer.renderIcon(
              iconProfile,
              formConfig.form,
              formConfig.field,
            );
            if (cancelled) return;

            renderedIcons[formConfig.form] = { url, serverSource, quality: "uhd" };
            renderedCount += 1;

            if (formConfig.form === "cube") {
              setIcons((current) => ({ ...current, cube: renderedIcons.cube }));
              setRenderStatus((current) => ({ ...current, uhd: 1 }));
            }
          } catch (error) {
            console.warn(`UHD ${formConfig.form} render failed:`, error);
          }
        }

        if (!cancelled) {
          setIcons((current) =>
            Object.fromEntries(
              Object.entries({ ...current, ...renderedIcons }).map(([form, icon]) => [
                form,
                icon.quality === "loading" ? { ...icon, quality: "preview" } : icon,
              ]),
            ),
          );
          setRenderStatus({ total: ICON_FORMS.length, uhd: renderedCount });
        }
      } catch (error) {
        if (!cancelled) {
          setIcons((current) =>
            Object.fromEntries(
              Object.entries(current).map(([form, icon]) => [
                form,
                { ...icon, quality: "preview" },
              ]),
            ),
          );
        }
        console.warn("GDBrowser icon renderer unavailable:", error);
      }
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [iconProfile, previewIcons]);

  return { icons, renderStatus };
}
