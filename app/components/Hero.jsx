"use client";

import { GdIcon } from "./GdIcon";

export function Hero({ cubeIcon, currentLevel }) {
  const progress = currentLevel.progress.toFixed(currentLevel.decimals);

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orbit orbit-one" aria-hidden="true" />
      <div className="hero-orbit orbit-two" aria-hidden="true" />

      <div className="hero-copy">
        <p className="eyebrow reveal">
          <span className="pulse" /> Geometry Dash player
        </p>
        <h1 className="reveal" id="hero-title">
          <span className="outline">KETCHUP</span>
          <span>ANDMAYO</span>
        </h1>
        <p className="hero-lead reveal">
          Bloodbath пройден. До финала EON осталось всего{" "}
          <strong>{(100 - currentLevel.progress).toFixed(2)}%.</strong>
        </p>
        <div className="hero-actions reveal">
          <a className="button button-primary" href="#run">
            СМОТРЕТЬ ПРОГРЕСС <span>↓</span>
          </a>
          <a className="button button-ghost" href="#profile">
            LIVE GD PROFILE
          </a>
        </div>
      </div>

      <div className="hero-visual reveal">
        <div className="hero-visual-label">
          <span>LIVE PLAYER SET</span>
          <strong>CUBE / 01</strong>
        </div>
        <div className="hero-icon-wrap" data-tilt>
          <GdIcon icon={cubeIcon} alt="Основной куб ketchupandmayo" />
        </div>
        <div className="hero-best">
          <span>NEW BEST / {currentLevel.title.join("")}</span>
          <div>
            <strong>{progress}</strong>
            <sup>%</sup>
          </div>
        </div>
      </div>

      <div className="hero-rail reveal" aria-label="Ключевые результаты">
        <span><small>CURRENT</small><strong>EON {progress}%</strong></span>
        <span><small>NEXT</small><strong>ZODIAC 8%</strong></span>
        <span><small>HARDEST</small><strong>BLOODBATH 100%</strong></span>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span>SCROLL TO ENTER</span>
        <i />
      </div>
    </section>
  );
}
