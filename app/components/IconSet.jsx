"use client";

import { useEffect, useRef, useState } from "react";
import { ICON_FORMS, LEVELS } from "../site-data";
import { GdIcon } from "./GdIcon";

export function IconSet({ icons }) {
  const [selectedForm, setSelectedForm] = useState("cube");
  const [switching, setSwitching] = useState(false);
  const timeoutRef = useRef(null);
  const selected = ICON_FORMS.find(({ form }) => form === selectedForm) ?? ICON_FORMS[0];
  const sectionNumber = String(LEVELS.length + 2).padStart(2, "0");

  useEffect(
    () => () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const selectForm = (form) => {
    if (form === selectedForm || switching) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSelectedForm(form);
      return;
    }
    setSwitching(true);
    timeoutRef.current = window.setTimeout(() => {
      setSelectedForm(form);
      setSwitching(false);
    }, 150);
  };

  return (
    <section className="icon-set section-pad" id="set" aria-labelledby="set-title">
      <div className="section-heading set-heading reveal">
        <div>
          <span className="section-index">{sectionNumber} / SIGNATURE SET</span>
          <h2 id="set-title">CHOOSE YOUR FORM</h2>
        </div>
        <p>MONOCHROME / SERVER-RENDERED</p>
      </div>

      <div className="set-stage reveal">
        <div className="selected-form">
          <div className="form-frame">
            <span className="corner corner-a" />
            <span className="corner corner-b" />
            <GdIcon
              icon={icons[selected.form]}
              alt={selected.name}
              className={switching ? "switching" : ""}
            />
          </div>
          <div className="selected-form-meta">
            <span className="form-index">{selected.index}</span>
            <div>
              <small>CURRENT FORM</small>
              <strong>{selected.name}</strong>
            </div>
          </div>
        </div>
        <ul className="form-selector" aria-label="Иконки игрового сета">
          {ICON_FORMS.map((form) => (
            <li key={form.form}>
              <button
                className={`form-button${selectedForm === form.form ? " active" : ""}`}
                type="button"
                aria-pressed={selectedForm === form.form}
                onClick={() => selectForm(form.form)}
              >
                <span className="form-button-index">{form.index}</span>
                <GdIcon icon={icons[form.form]} alt="" />
                <span className="form-button-name">{form.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
