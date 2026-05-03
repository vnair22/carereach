import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: "✉",
    title: "Follow-Up Messages",
    desc: "AI writes personalized patient follow-ups in seconds. No more copy-paste templates. Every message feels human.",
  },
  {
    icon: "📋",
    title: "Intake Summaries",
    desc: "Patients fill out forms. AI turns their answers into a clean clinical summary before the provider walks in.",
  },
  {
    icon: "🛡",
    title: "Pre-Auth Letters",
    desc: "Stop spending 45 minutes drafting insurance letters. CareReach writes them in under 10 seconds.",
  },
];

const TESTIMONIALS = [
  {
    quote: "We used to spend two hours a day on follow-up messages alone. CareReach cut that to fifteen minutes.",
    name: "Dr. Angela Reyes",
    role: "Owner, Reyes Family Dental",
    initials: "AR",
    color: "#d4eddf",
  },
  {
    quote: "The pre-auth letters alone are worth the price. We've had fewer denials and faster approvals since we started.",
    name: "Marcus Webb",
    role: "Office Manager, PrimePhysio",
    initials: "MW",
    color: "#dde8f7",
  },
  {
    quote: "My front desk team actually enjoys their work now. That's not something I thought software could do.",
    name: "Dr. Priya Nair",
    role: "Medical Director, ClearSkin Medspa",
    initials: "PN",
    color: "#f7e8dd",
  },
];

const STATS = [
  { num: "3.2h", label: "saved per day, per practice" },
  { num: "94%", label: "faster pre-auth drafting" },
  { num: "200+", label: "practices on the platform" },
  { num: "$0", label: "setup fee, ever" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function AnimSection({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = () => {
    if (email.includes("@")) setSubmitted(true);
  };

  const goToDashboard = () => navigate("/dashboard");

  return (
    <div style={s.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; }

        .cta-btn {
          background: #c8f564; color: #0a1f0f; border: none; border-radius: 12px;
          padding: 16px 32px; font-family: 'Outfit', sans-serif; font-size: 15px;
          font-weight: 700; cursor: pointer; letter-spacing: 0.2px;
          transition: all 0.2s ease; display: inline-block;
        }
        .cta-btn:hover { background: #b8f040; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(200,245,100,0.35); }

        .ghost-btn {
          background: transparent; color: #c8f564;
          border: 1.5px solid rgba(200,245,100,0.35); border-radius: 12px;
          padding: 14px 28px; font-family: 'Outfit', sans-serif;
          font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;
        }
        .ghost-btn:hover { border-color: #c8f564; background: rgba(200,245,100,0.06); }

        .feature-card {
          background: #ffffff; border: 1px solid #e8e2d8; border-radius: 18px;
          padding: 32px 28px; transition: all 0.25s ease; cursor: default; height: 100%;
        }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(26,58,42,0.1); border-color: #c8f564; }

        .email-input {
          background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: 12px; padding: 15px 20px; color: #f0ece3;
          font-family: 'Outfit', sans-serif; font-size: 15px;
          width: 100%; max-width: 340px; outline: none; transition: border-color 0.2s;
        }
        .email-input::placeholder { color: rgba(240,236,227,0.4); }
        .email-input:focus { border-color: #c8f564; }

        .nav-link:hover { color: #c8f564 !important; }

        @keyframes heroReveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

        .hero-tag { animation: heroReveal 0.5s ease 0.1s both; }
        .hero-h1  { animation: heroReveal 0.5s ease 0.25s both; }
        .hero-sub { animation: heroReveal 0.5s ease 0.4s both; }
        .hero-cta { animation: heroReveal 0.5s ease 0.55s both; }
        .hero-img { animation: heroReveal 0.7s ease 0.5s both; }
        .float-card { animation: float 4s ease-in-out infinite; }

        @media(max-width:700px) {
          .hero-flex { flex-direction: column !important; }
          .hero-right { display: none !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .cta-row { flex-direction: column !important; align-items: stretch !important; }
          .email-input { max-width: 100% !important; }
          .pricing-card { flex-direction: column !important; }
          .nav-links { display: none !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ ...s.nav, background: scrolled ? "rgba(10,31,15,0.96)" : "transparent", backdropFilter: scrolled ? "blur(12px)" : "none", boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,0.05)" : "none" }}>
        <div style={s.navInner}>
          <div style={s.logo}>
            <div style={s.logoMark}>+</div>
            <span style={s.logoText}>CareReach</span>
          </div>
          <div className="nav-links" style={s.navLinks}>
            <a href="#features" className="nav-link" style={s.navLink}>Features</a>
            <a href="#pricing" className="nav-link" style={s.navLink}>Pricing</a>
            <a href="#testimonials" className="nav-link" style={s.navLink}>Reviews</a>
          </div>
          <button className="cta-btn" style={{ padding: "10px 22px", fontSize: 13 }} onClick={goToDashboard}>
            Go to Dashboard
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroBg} />
        <div style={s.heroInner}>
          <div className="hero-flex" style={s.heroFlex}>
            <div style={s.heroLeft}>
              <div className="hero-tag" style={s.heroTag}>
                <span style={s.heroDot} /> AI-Powered Admin for Healthcare
              </div>
              <h1 className="hero-h1" style={s.heroH1}>
                Your front desk,<br />
                <em style={{ fontStyle: "italic", color: "#c8f564" }}>supercharged.</em>
              </h1>
              <p className="hero-sub" style={s.heroSub}>
                CareReach uses AI to write patient follow-ups, summarize intake forms, and draft insurance pre-auth letters — in seconds. Small practices save 3+ hours every single day.
              </p>
              <div className="hero-cta" style={s.heroCta}>
                <button className="cta-btn" onClick={goToDashboard}>Try It Free — No Card Needed</button>
                <a href="#features"><button className="ghost-btn">See How It Works</button></a>
              </div>
              <p style={s.heroNote}>14-day free trial. Cancel anytime.</p>
            </div>

            <div className="hero-right" style={s.heroRight}>
              <div className="float-card" style={s.mockCard}>
                <div style={s.mockHeader}>
                  <div style={s.mockDots}>
                    <span style={{ ...s.mockDot, background: "#ff5f57" }} />
                    <span style={{ ...s.mockDot, background: "#ffbd2e" }} />
                    <span style={{ ...s.mockDot, background: "#28ca41" }} />
                  </div>
                  <span style={s.mockTitle}>Follow-Up Generator</span>
                </div>
                <div style={s.mockBody}>
                  <div style={s.mockField}><span style={s.mockFieldLabel}>Patient</span><span style={s.mockFieldVal}>Sarah Johnson</span></div>
                  <div style={s.mockField}><span style={s.mockFieldLabel}>Type</span><span style={s.mockFieldVal}>Dental Cleaning</span></div>
                  <div style={s.mockField}><span style={s.mockFieldLabel}>Date</span><span style={s.mockFieldVal}>May 2, 2026</span></div>
                  <div style={s.mockBtn}>✨ Generate Message</div>
                  <div style={s.mockOutput}>
                    <div style={s.mockOutputLabel}>AI Output</div>
                    <p style={s.mockOutputText}>Hi Sarah! Thank you for coming in for your cleaning yesterday. Dr. Ramirez enjoyed seeing you — your smile looks great! Don't hesitate to reach out with any questions. 😊</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={s.statsSection}>
        <AnimSection>
          <div className="stats-grid" style={s.statsGrid}>
            {STATS.map((st, i) => (
              <div key={i} style={s.statItem}>
                <div style={s.statNum}>{st.num}</div>
                <div style={s.statLabel}>{st.label}</div>
              </div>
            ))}
          </div>
        </AnimSection>
      </section>

      {/* FEATURES */}
      <section id="features" style={s.section}>
        <div style={s.sectionInner}>
          <AnimSection>
            <div style={s.sectionTag}>What's included</div>
            <h2 style={s.sectionH2}>Three tools.<br />One monthly price.</h2>
            <p style={s.sectionSub}>Everything your front desk needs to stop drowning in paperwork and start focusing on patients.</p>
          </AnimSection>
          <div className="features-grid" style={s.featuresGrid}>
            {FEATURES.map((f, i) => (
              <AnimSection key={i} delay={i * 0.1}>
                <div className="feature-card">
                  <div style={s.featureIcon}>{f.icon}</div>
                  <h3 style={s.featureTitle}>{f.title}</h3>
                  <p style={s.featureDesc}>{f.desc}</p>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ ...s.section, background: "#f7f3ec" }}>
        <div style={s.sectionInner}>
          <AnimSection>
            <div style={s.sectionTag}>Real practices. Real results.</div>
            <h2 style={s.sectionH2}>They got their time back.</h2>
          </AnimSection>
          <div className="testimonials-grid" style={s.testimonialsGrid}>
            {TESTIMONIALS.map((t, i) => (
              <AnimSection key={i} delay={i * 0.12}>
                <div style={s.testimonialCard}>
                  <p style={s.testimonialQuote}>"{t.quote}"</p>
                  <div style={s.testimonialAuthor}>
                    <div style={{ ...s.testimonialAvatar, background: t.color }}>{t.initials}</div>
                    <div>
                      <div style={s.testimonialName}>{t.name}</div>
                      <div style={s.testimonialRole}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={s.section}>
        <div style={s.sectionInner}>
          <AnimSection>
            <div style={s.sectionTag}>Simple pricing</div>
            <h2 style={s.sectionH2}>One plan. Everything included.</h2>
          </AnimSection>
          <AnimSection delay={0.1}>
            <div className="pricing-card" style={s.pricingCard}>
              <div style={s.pricingLeft}>
                <div style={s.pricingBadge}>Most Popular</div>
                <div style={s.pricingAmount}><span style={s.pricingDollar}>$</span>399<span style={s.pricingPer}>/mo</span></div>
                <p style={s.pricingDesc}>Per practice location. Unlimited staff accounts. Cancel anytime.</p>
                <button className="cta-btn" style={{ marginTop: 24 }} onClick={goToDashboard}>Start Free Trial</button>
              </div>
              <div style={s.pricingRight}>
                {["Follow-Up Message Generator","Patient Intake Summarizer","Insurance Pre-Auth Drafter","Unlimited messages per month","Unlimited staff accounts","14-day free trial","Priority email support","No setup fee"].map((item, i) => (
                  <div key={i} style={s.pricingFeature}>
                    <span style={s.pricingCheck}>✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={s.ctaSection}>
        <div style={s.ctaBg} />
        <div style={s.sectionInner}>
          <AnimSection>
            <h2 style={s.ctaH2}>Ready to get your<br /><em style={{ fontStyle: "italic", color: "#c8f564" }}>time back?</em></h2>
            <p style={s.ctaSub}>Join hundreds of practices already saving hours every week. Start your free trial — no credit card needed.</p>
            <div className="cta-row" style={s.ctaRow}>
              {submitted ? (
                <div style={s.successMsg}>🎉 You're on the list! We'll be in touch shortly.</div>
              ) : (
                <>
                  <input className="email-input" placeholder="Enter your work email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
                  <button className="cta-btn" onClick={handleSubmit}>Get Early Access</button>
                </>
              )}
            </div>
          </AnimSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={s.footerInner}>
          <div style={s.logo}>
            <div style={s.logoMark}>+</div>
            <span style={s.logoText}>CareReach</span>
          </div>
          <p style={s.footerText}>© 2026 CareReach. Built for the practices that care.</p>
        </div>
      </footer>
    </div>
  );
}

const s = {
  root: { background: "#faf6ef", fontFamily: "'Outfit', sans-serif", overflowX: "hidden" },
  nav: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, transition: "all 0.3s ease" },
  navInner: { maxWidth: 1100, margin: "0 auto", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: { width: 34, height: 34, background: "#c8f564", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#0a1f0f" },
  logoText: { fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#f0ece3", fontWeight: 700 },
  navLinks: { display: "flex", gap: 32 },
  navLink: { color: "rgba(240,236,227,0.7)", fontSize: 14, fontWeight: 500, transition: "color 0.15s" },
  hero: { background: "#0a1f0f", minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 80 },
  heroBg: { position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 60% 40%, rgba(74,222,128,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(200,245,100,0.06) 0%, transparent 60%)" },
  heroInner: { maxWidth: 1100, margin: "0 auto", padding: "80px 32px", position: "relative", width: "100%" },
  heroFlex: { display: "flex", alignItems: "center", gap: 60 },
  heroLeft: { flex: 1, minWidth: 0 },
  heroRight: { flex: "0 0 360px", display: "flex", justifyContent: "center" },
  heroTag: { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,245,100,0.1)", border: "1px solid rgba(200,245,100,0.2)", borderRadius: 100, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#c8f564", letterSpacing: "0.3px", marginBottom: 24 },
  heroDot: { width: 6, height: 6, background: "#c8f564", borderRadius: "50%", display: "inline-block" },
  heroH1: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(40px, 5vw, 62px)", color: "#f0ece3", lineHeight: 1.1, fontWeight: 700, marginBottom: 24 },
  heroSub: { fontSize: 17, color: "rgba(240,236,227,0.65)", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 },
  heroCta: { display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 },
  heroNote: { fontSize: 12, color: "rgba(240,236,227,0.35)" },
  mockCard: { background: "#ffffff", borderRadius: 18, overflow: "hidden", boxShadow: "0 32px 80px rgba(0,0,0,0.5)", width: 320 },
  mockHeader: { background: "#f5f1ea", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #ede8df" },
  mockDots: { display: "flex", gap: 6 },
  mockDot: { width: 10, height: 10, borderRadius: "50%", display: "inline-block" },
  mockTitle: { fontSize: 12, fontWeight: 600, color: "#6b6356" },
  mockBody: { padding: "18px 18px 20px", display: "flex", flexDirection: "column", gap: 10 },
  mockField: { display: "flex", justifyContent: "space-between" },
  mockFieldLabel: { fontSize: 11, color: "#9a9288", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" },
  mockFieldVal: { fontSize: 13, color: "#1c1c1c", fontWeight: 500 },
  mockBtn: { background: "#0a1f0f", color: "#c8f564", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 700, textAlign: "center", marginTop: 4 },
  mockOutput: { background: "#f0faf4", borderRadius: 10, padding: "12px 14px", border: "1px solid #c8e8d4" },
  mockOutputLabel: { fontSize: 10, fontWeight: 700, color: "#1a3a2a", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 6 },
  mockOutputText: { fontSize: 12, color: "#2d4a3a", lineHeight: 1.6 },
  statsSection: { background: "#0a1f0f", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 32px" },
  statsGrid: { maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 },
  statItem: { textAlign: "center" },
  statNum: { fontFamily: "'Playfair Display', serif", fontSize: 42, color: "#c8f564", fontWeight: 700, lineHeight: 1 },
  statLabel: { fontSize: 13, color: "rgba(240,236,227,0.5)", marginTop: 6 },
  section: { padding: "96px 32px" },
  sectionInner: { maxWidth: 1000, margin: "0 auto" },
  sectionTag: { display: "inline-block", background: "#eaf6ee", color: "#1a5a2a", borderRadius: 100, padding: "5px 14px", fontSize: 12, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 16 },
  sectionH2: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(32px, 4vw, 48px)", color: "#1a1a1a", lineHeight: 1.15, fontWeight: 700, marginBottom: 16 },
  sectionSub: { fontSize: 16, color: "#7a7268", lineHeight: 1.7, maxWidth: 520, marginBottom: 56 },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 48 },
  featureIcon: { fontSize: 28, marginBottom: 16 },
  featureTitle: { fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#1a1a1a", fontWeight: 600, marginBottom: 10 },
  featureDesc: { fontSize: 14, color: "#6a6258", lineHeight: 1.7 },
  testimonialsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 48 },
  testimonialCard: { background: "#ffffff", borderRadius: 16, padding: "28px 24px", border: "1px solid #e8e2d8", display: "flex", flexDirection: "column", gap: 20 },
  testimonialQuote: { fontSize: 15, color: "#2d2d2d", lineHeight: 1.75, fontStyle: "italic", flex: 1 },
  testimonialAuthor: { display: "flex", alignItems: "center", gap: 12 },
  testimonialAvatar: { width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#1a1a1a", flexShrink: 0 },
  testimonialName: { fontSize: 14, fontWeight: 700, color: "#1a1a1a" },
  testimonialRole: { fontSize: 12, color: "#9a9288" },
  pricingCard: { background: "#ffffff", borderRadius: 20, border: "1px solid #e8e2d8", boxShadow: "0 8px 40px rgba(26,58,42,0.08)", display: "flex", gap: 48, padding: "48px", marginTop: 48 },
  pricingLeft: { flex: "0 0 240px" },
  pricingRight: { flex: 1, display: "flex", flexDirection: "column", gap: 14, justifyContent: "center" },
  pricingBadge: { display: "inline-block", background: "#eaf6ee", color: "#1a5a2a", borderRadius: 100, padding: "4px 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 16 },
  pricingAmount: { fontFamily: "'Playfair Display', serif", fontSize: 64, color: "#0a1f0f", fontWeight: 700, lineHeight: 1 },
  pricingDollar: { fontSize: 28, verticalAlign: "super" },
  pricingPer: { fontSize: 20, color: "#9a9288", fontWeight: 400 },
  pricingDesc: { fontSize: 13, color: "#7a7268", lineHeight: 1.6, marginTop: 10 },
  pricingFeature: { display: "flex", alignItems: "center", gap: 12, fontSize: 15, color: "#2d2d2d" },
  pricingCheck: { color: "#1a8a3a", fontWeight: 700, fontSize: 16, flexShrink: 0 },
  ctaSection: { background: "#0a1f0f", padding: "100px 32px", position: "relative", textAlign: "center" },
  ctaBg: { position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(74,222,128,0.1) 0%, transparent 70%)" },
  ctaH2: { fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px, 5vw, 58px)", color: "#f0ece3", lineHeight: 1.15, fontWeight: 700, marginBottom: 20, position: "relative" },
  ctaSub: { fontSize: 16, color: "rgba(240,236,227,0.6)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 40px", position: "relative" },
  ctaRow: { display: "flex", gap: 12, justifyContent: "center", alignItems: "center", position: "relative", flexWrap: "wrap" },
  successMsg: { color: "#c8f564", fontSize: 16, fontWeight: 600 },
  footer: { background: "#060f08", padding: "32px" },
  footerInner: { maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 },
  footerText: { fontSize: 13, color: "rgba(240,236,227,0.3)" },
};
