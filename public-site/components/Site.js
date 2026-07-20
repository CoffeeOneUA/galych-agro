"use client";

import { useEffect, useRef, useState } from "react";
import { SERVICE_ICONS, CHECK_ICON } from "./icons";

function useReveal() {
  const containerRef = useRef(null);
  useEffect(() => {
    const els = containerRef.current
      ? containerRef.current.querySelectorAll(".reveal")
      : [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return containerRef;
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 520 440" width="100%" height="100%" role="img" aria-label="Ілюстрація елеватора та поля">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6EBCF" />
          <stop offset="100%" stopColor="#F1E9D2" />
        </linearGradient>
        <linearGradient id="siloGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D8AF57" />
          <stop offset="100%" stopColor="#C89B3C" />
        </linearGradient>
      </defs>
      <rect width="520" height="440" fill="url(#sky)" />
      <circle cx="440" cy="90" r="46" fill="#EAD9A5" opacity="0.7" />
      <rect x="0" y="330" width="520" height="110" fill="#B7C79A" opacity="0.35" />
      <g>
        <rect x="70" y="180" width="58" height="160" rx="10" fill="url(#siloGrad)" />
        <ellipse cx="99" cy="180" rx="29" ry="14" fill="#E7C878" />
        <rect x="150" y="140" width="58" height="200" rx="10" fill="#5F7259" />
        <ellipse cx="179" cy="140" rx="29" ry="14" fill="#748A6B" />
        <rect x="230" y="200" width="58" height="140" rx="10" fill="url(#siloGrad)" />
        <ellipse cx="259" cy="200" rx="29" ry="14" fill="#E7C878" />
      </g>
      <line x1="288" y1="230" x2="360" y2="270" stroke="#78878A" strokeWidth="6" strokeLinecap="round" />
      <g transform="translate(345,272)">
        <rect x="0" y="0" width="86" height="46" rx="6" fill="#2B2E26" />
        <rect x="66" y="-22" width="30" height="30" rx="5" fill="#2B2E26" />
        <circle cx="18" cy="50" r="11" fill="#1c1e18" />
        <circle cx="70" cy="50" r="11" fill="#1c1e18" />
      </g>
      <g stroke="#8C9B4E" strokeWidth="4" strokeLinecap="round">
        <path d="M40 340 L36 300" />
        <path d="M58 340 L56 296" />
        <path d="M76 340 L80 302" />
        <path d="M420 340 L416 300" />
        <path d="M440 340 L444 298" />
        <path d="M460 340 L456 304" />
      </g>
      <rect x="0" y="336" width="520" height="4" fill="#2B2E26" opacity="0.08" />
    </svg>
  );
}

export default function Site({ content }) {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const revealRef = useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={revealRef}>
      <header className={scrolled ? "solid" : ""}>
        <div className="header-inner container">
          <a href="#top" className="logo">
            {content.images.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={content.images.logo} alt={content.brandName} />
            ) : (
              <span className="logo-mark">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="9" width="4" height="12" rx="1" fill="#fff" />
                  <rect x="10" y="4" width="4" height="17" rx="1" fill="#fff" />
                  <rect x="17" y="9" width="4" height="12" rx="1" fill="#fff" />
                </svg>
              </span>
            )}
            <span>{content.brandName}</span>
          </a>
          <nav className={navOpen ? "open" : ""} id="nav-menu">
            <a href="#about" onClick={() => setNavOpen(false)}>Про нас</a>
            <a href="#services" onClick={() => setNavOpen(false)}>Послуги</a>
            <a href="#advantages" onClick={() => setNavOpen(false)}>Переваги</a>
            <a href="#contact" onClick={() => setNavOpen(false)}>Контакти</a>
          </nav>
          <div className="header-actions">
            <a href="#contact" className="btn btn-primary btn-primary-desktop">Зв&apos;язатися</a>
            <button className="burger" aria-label="Меню" onClick={() => setNavOpen((v) => !v)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">{content.hero.eyebrow}</p>
              <h1>{content.hero.title}</h1>
              <p className="lede" style={{ marginTop: 22 }}>{content.hero.subtitle}</p>
              <div className="hero-actions">
                <a href="#contact" className="btn btn-primary">{content.hero.cta1}</a>
                <a href="#services" className="btn btn-ghost">{content.hero.cta2}</a>
              </div>
              <div className="stats-row">
                {content.stats.map((s, i) => (
                  <div key={i}>
                    <div className="stat-num">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-art">
              <div className="hero-photo">
                {content.images.hero ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={content.images.hero} alt={content.brandName} />
                ) : (
                  <HeroIllustration />
                )}
              </div>
              <div className="wheat-row" aria-hidden="true">
                {[0, 1, 2].map((i) => (
                  <svg key={i} viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 22V10M12 10c0-3 2-5 5-6-1 3-1 6-5 6ZM12 10c0-3-2-5-5-6 1 3 1 6 5 6Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad" id="about">
          <div className="container about-grid reveal">
            <div>
              <p className="eyebrow">Про компанію</p>
              <h2>{content.about.title}</h2>
            </div>
            <div>
              <p className="lede" style={{ maxWidth: "none", fontSize: 17 }}>{content.about.text}</p>
            </div>
          </div>
        </section>

        <section className="section-pad tint" id="services">
          <div className="container reveal">
            <p className="eyebrow">Що ми робимо</p>
            <h2>Наші послуги</h2>
            <div className="services-grid">
              {content.services.map((s, i) => (
                <div className="service-card" key={i}>
                  {s.image && (
                    <div className="service-photo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.image} alt={s.title} />
                    </div>
                  )}
                  <div className="service-body">
                    <div className="service-icon">{SERVICE_ICONS[s.icon] || SERVICE_ICONS.wheat}</div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad" id="advantages">
          <div className="container reveal">
            <p className="eyebrow">Наші переваги</p>
            <h2>{content.advantagesTitle}</h2>
            <div className="adv-grid">
              {content.advantages.map((a, i) => (
                <div className="adv-item" key={i}>
                  <span className="adv-check">{CHECK_ICON}</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="container reveal">
            <div className="cta-band">
              <p className="eyebrow" style={{ color: "#E7D9A0" }}>Співпраця</p>
              <h2>{content.cta.title}</h2>
              <p>{content.cta.text}</p>
              <a href="#contact" className="btn btn-gold">{content.cta.button}</a>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="logo" style={{ marginBottom: 14 }}>
                <span className="logo-mark" style={{ background: "var(--gold)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="9" width="4" height="12" rx="1" fill="#2B2408" />
                    <rect x="10" y="4" width="4" height="17" rx="1" fill="#2B2408" />
                    <rect x="17" y="9" width="4" height="12" rx="1" fill="#2B2408" />
                  </svg>
                </span>
                <span>{content.brandName}</span>
              </div>
              <p style={{ maxWidth: "34ch" }}>Українська аграрна компанія: закупівля, зберігання та переробка зерна з 2011 року.</p>
            </div>
            <div>
              <h3>Контакти</h3>
              <ul>
                <li><a href={`tel:${content.contact.phone.replace(/[^\d+]/g, "")}`}>{content.contact.phone}</a></li>
                <li><a href={`mailto:${content.contact.email}`}>{content.contact.email}</a></li>
                <li><span>{content.contact.address}</span></li>
              </ul>
            </div>
            <div>
              <h3>Розділи</h3>
              <ul>
                <li><a href="#about">Про нас</a></li>
                <li><a href="#services">Послуги</a></li>
                <li><a href="#advantages">Переваги</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} {content.brandName}. Усі права захищено.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
