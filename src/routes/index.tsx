import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { RsvpDialog } from "@/components/RsvpDialog";
import "@/styles/rsvp.css";
import "@/styles/wedding-actions.css";

const VENUE_MAP_URL = "https://maps.app.goo.gl/4oR6QQrd9yx6NgRK8";
const MUSIC_SRC = "/wedding/audio/wedding-music.mp3";

function buildGoogleCalendarUrl() {
  const start = "20261012T100000";
  const end = "20261012T140000";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Boudjemaa & Roba — Wedding",
    dates: `${start}/${end}`,
    details: "Join us as we celebrate our wedding.",
    location: VENUE_MAP_URL,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function WeddingActions() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.6;
    const tryPlay = async () => {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        // Autoplay blocked — start on first user interaction
        const resume = async () => {
          try {
            await a.play();
            setPlaying(true);
          } catch {}
          window.removeEventListener("click", resume);
          window.removeEventListener("touchstart", resume);
          window.removeEventListener("keydown", resume);
        };
        window.addEventListener("click", resume, { once: true });
        window.addEventListener("touchstart", resume, { once: true });
        window.addEventListener("keydown", resume, { once: true });
      }
    };
    tryPlay();
    return () => {
      a.pause();
    };
  }, []);

  const toggleMusic = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  return (
    <div className="wedding_actions">
      <a
        className="wedding_action_btn"
        href={buildGoogleCalendarUrl()}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span aria-hidden>+</span> Add to Calendar
      </a>
      <a
        className="wedding_action_btn"
        href={VENUE_MAP_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span aria-hidden>📍</span> View Venue Map
      </a>
      <button type="button" className="wedding_action_btn" onClick={toggleMusic}>
        <span aria-hidden>{playing ? "■" : "♪"}</span>
        {playing ? "Stop Music" : "Play Music"}
      </button>
      <audio
        ref={audioRef}
        src={MUSIC_SRC}
        loop
        preload="auto"
        onEnded={() => setPlaying(false)}
      />
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Boudjemaa & Roba — Wedding Invitation" },
      {
        name: "description",
        content:
          "Join us as we celebrate the wedding of Boudjemaa & Roba on 12.10.2026.",
      },
    ],
    links: [
      { rel: "stylesheet", href: "/wedding/css/bootstrap.min.css" },
      { rel: "stylesheet", href: "/wedding/css/fontawesome.min.css" },
      { rel: "stylesheet", href: "/wedding/css/style.css" },
      { rel: "icon", href: "/wedding/images/favicon.ico" },
    ],
  }),
});

function pad(n: number) {
  return n < 10 ? "0" + n : String(n);
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);


  const diff = Math.max(0, target.getTime() - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function Index() {
  const target = new Date(2026, 9, 12, 10, 0, 0);
  const { days, hours, minutes, seconds } = useCountdown(target);

  return (
    <section className="w-100">
      <div className="Wedding_card_main_wrapper">
        <div className="wedding_box1">
          <div className="wedding_detail_box">
            <div className="curved2">
              <svg viewBox="0 0 400 200">
                <defs>
                  <path id="halfCircle" d="M 50,150 A 150,150 0 0,1 350,150" />
                </defs>
                <text>
                  <textPath href="#halfCircle" startOffset="50%" textAnchor="middle" style={{ fontWeight: 700 }}>
                    We Getting Married
                  </textPath>
                </text>
              </svg>
              <span className="leave_vector_box">
                <img src="/wedding/images/leave_vector_img.svg" alt="" />
              </span>
            </div>
            <h1 className="main_title_txt">Boudjemaa &amp; Roba</h1>
            <div className="date_txt_box">
              <span className="icon_box">
                <svg
                  width="149"
                  height="12"
                  viewBox="0 0 149 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.226497 6L6 11.7735L11.7735 6L6 0.226497L0.226497 6ZM148 7C148.552 7 149 6.55228 149 6C149 5.44772 148.552 5 148 5V7ZM6 6V7L148 7V6V5L6 5V6Z"
                    fill="#C3AE94"
                  />
                </svg>
              </span>
              <h2>12. 10. 2026</h2>
              <span className="icon_box">
                <svg
                  width="149"
                  height="12"
                  viewBox="0 0 149 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5C0.447715 5 0 5.44772 0 6C0 6.55228 0.447715 7 1 7L1 5ZM148.774 6L143 0.226497L137.226 6L143 11.7735L148.774 6ZM1 6L1 7L143 7V6V5L1 5L1 6Z"
                    fill="#C3AE94"
                  />
                </svg>
              </span>
            </div>
            <div id="countdown-container" className="countdown-container">
              <article id="js-countdown" className="countdown">
                <section id="js-days" className="number">
                  <span className="current">{pad(days)}</span>
                </section>
                <section id="js-hours" className="number">
                  <span className="current">{pad(hours)}</span>
                </section>
                <section id="js-minutes" className="number">
                  <span className="current">{pad(minutes)}</span>
                </section>
                <section id="js-seconds" className="number">
                  <span className="current">{pad(seconds)}</span>
                </section>
              </article>
            </div>
            <div className="venue_txt_box">
              <p
                dir="rtl"
                lang="ar"
                style={{
                  fontFamily: "'Amiri', 'Scheherazade New', serif",
                  fontSize: "1.25rem",
                  lineHeight: 1.9,
                  color: "#604C38",
                  marginBottom: "0.5rem",
                  textAlign: "center",
                }}
              >
                وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا
                إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
              </p>
              <h3 style={{ fontStyle: "italic", color: "#8a7355" }}>
                — Surah Ar-Rum (30:21)
              </h3>
            </div>
            <div style={{ textAlign: "center" }}>
              <RsvpDialog />
              <WeddingActions />
            </div>
          </div>
        </div>
        <div className="wedding_box2">
          <div className="wedding_img_box with-bg-size" />
          <span className="vector_box1">
            <img src="/wedding/images/leave_vector1.svg" alt="" />
          </span>
          <span className="vector_box2">
            <img src="/wedding/images/leave_vector2.svg" alt="" />
          </span>
        </div>
        <span className="bg_vector_box">
          <img src="/wedding/images/bg_leave_vector.svg" alt="" />
        </span>
      </div>
    </section>
  );
}
