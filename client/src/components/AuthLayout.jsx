import { useEffect, useRef } from "react";
import styles from "./AuthLayout.module.css";
import { Link } from "react-router-dom";

const AuthLayout = ({ title, subtitle, children, isRegister }) => {
  const canvasRef = useRef(null);

  // Animated particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 200, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0, 229, 200, ${0.06 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className={styles.page}>
      {/* Animated background */}
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Gradient orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {/* Brand column */}
      <div className={styles.brandCol}>
        <div className={styles.brandContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L2 10v12l14 8 14-8V10L16 2z" fill="rgba(0,229,200,0.15)" stroke="#00e5c8" strokeWidth="1.5"/>
                <path d="M16 8l-8 4.5v7L16 24l8-4.5v-7L16 8z" fill="rgba(0,229,200,0.25)" stroke="#00e5c8" strokeWidth="1.5"/>
                <circle cx="16" cy="16" r="3" fill="#00e5c8"/>
              </svg>
            </div>
            <span className={styles.logoText}>AuthFlow</span>
          </div>

          <div className={styles.brandHero}>
            <h1 className={styles.brandTitle}>
              Secure.<br />Simple.<br />
              <span className={styles.brandAccent}>Seamless.</span>
            </h1>
            <p className={styles.brandDesc}>
              Enterprise-grade authentication built for the modern web. Your data, protected.
            </p>
          </div>

          <div className={styles.brandStats}>
            {[
              { val: "256-bit", label: "AES Encryption" },
              { val: "JWT", label: "Stateless Auth" },
              { val: "99.9%", label: "Uptime SLA" },
            ].map((s) => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statVal}>{s.val}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form column */}
      <div className={styles.formCol}>
        <div className={styles.card}>
          {/* Top tab strip */}
          <div className={styles.tabStrip}>
            {/* <div className={`${styles.tab} ${!isRegister ? styles.tabActive : ""}`}>
              Sign In
            </div> */}
            
            <div className={`${styles.tab} ${!isRegister ? styles.tabActive : ""}`}>
              <Link to="/login" className={styles.authLabel}>Sign In</Link>
            </div>
            
            
            <div className={`${styles.tab} ${isRegister ? styles.tabActive : ""}`}>
              <Link to="/register" className={styles.authLabel}>Register</Link>
            </div>
            
            {/* <div className={`${styles.tab} ${isRegister ? styles.tabActive : ""}`}>
              Register
            </div> */}
            <div className={`${styles.tabIndicator} ${isRegister ? styles.tabIndicatorRight : ""}`} />
          </div>

          {/* Avatar icon */}
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className={styles.avatarRing} />
          </div>

          {/* Title */}
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>{title}</h2>
            <p className={styles.cardSubtitle}>{subtitle}</p>
          </div>

          {/* Form content */}
          <div className={styles.cardBody}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
