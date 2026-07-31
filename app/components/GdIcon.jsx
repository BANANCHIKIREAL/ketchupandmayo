"use client";

export function GdIcon({ icon, alt, className = "" }) {
  const qualityClass =
    icon.quality === "uhd"
      ? "server-icon-hd"
      : icon.quality === "loading"
        ? "server-icon-pending"
        : "server-icon-preview";

  return (
    <img
      className={`${className} ${qualityClass}`.trim()}
      src={icon.url}
      alt={alt}
      data-server-source={icon.serverSource}
      data-icon-quality={icon.quality}
    />
  );
}
