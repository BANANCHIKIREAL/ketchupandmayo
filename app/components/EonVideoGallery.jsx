"use client";

import { useEffect, useRef, useState } from "react";

const RECORDINGS = [
  {
    id: "bananchikireal",
    label: "BANANCHIKIREAL POV",
    description: "Запись от автора сайта",
    duration: "06:50",
    poster: "/media/eon-bananchikireal-pov.jpg",
    src: "/media/eon-bananchikireal-pov.mp4",
    orientation: "landscape",
  },
  {
    id: "stream",
    label: "STREAM POV",
    description: "Запись со стрима nahbro003",
    duration: "07:37",
    poster: "/media/eon-stream-pov.jpg",
    src: "/media/eon-stream-pov.mp4",
    orientation: "portrait",
  },
];

export function EonVideoGallery() {
  const [activeRecording, setActiveRecording] = useState(null);
  const dialogRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeRecording && dialog && !dialog.open) dialog.showModal();
  }, [activeRecording]);

  function closePlayer() {
    videoRef.current?.pause();
    dialogRef.current?.close();
  }

  return (
    <div className="eon-recordings reveal" aria-labelledby="eon-recordings-title">
      <div className="recordings-heading">
        <div>
          <span>ARCHIVE / EON 99.90%</span>
          <h3 id="eon-recordings-title">ОДИН МОМЕНТ. ДВА ВЗГЛЯДА.</h3>
        </div>
        <p>Записи финального рана — от первого клика до трипл-спайка.</p>
      </div>

      <div className="recordings-grid">
        {RECORDINGS.map((recording, index) => (
          <button
            className={`recording-card recording-${recording.orientation}`}
            type="button"
            key={recording.id}
            onClick={() => setActiveRecording(recording)}
            aria-label={`Смотреть ${recording.label}, ${recording.duration}`}
          >
            <img
              src={recording.poster}
              alt=""
              width={recording.orientation === "portrait" ? 436 : 1280}
              height={recording.orientation === "portrait" ? 960 : 800}
              loading="lazy"
              decoding="async"
            />
            <span className="recording-shade" aria-hidden="true" />
            <span className="recording-index">0{index + 1}</span>
            <span className="recording-play" aria-hidden="true"><i /></span>
            <span className="recording-copy">
              <strong>{recording.label}</strong>
              <small>{recording.description}</small>
            </span>
            <span className="recording-duration">{recording.duration}</span>
          </button>
        ))}
      </div>

      <dialog
        className="recording-dialog"
        ref={dialogRef}
        onClose={() => setActiveRecording(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closePlayer();
        }}
        aria-label={activeRecording ? `Видео: ${activeRecording.label}` : "Видео EON"}
      >
        {activeRecording ? (
          <div className={`recording-player recording-player-${activeRecording.orientation}`}>
            <div className="recording-player-head">
              <div>
                <span>EON / 99.90%</span>
                <strong>{activeRecording.label}</strong>
              </div>
              <button type="button" onClick={closePlayer} aria-label="Закрыть видео">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <video
              ref={videoRef}
              src={activeRecording.src}
              poster={activeRecording.poster}
              controls
              playsInline
              preload="metadata"
            >
              Ваш браузер не поддерживает воспроизведение видео.
            </video>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
