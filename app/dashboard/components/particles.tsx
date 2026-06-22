const particles = [
  { top: "8%", left: "12%", size: 3, delay: "0s", duration: "14s" },
  { top: "22%", left: "28%", size: 2, delay: "1.2s", duration: "18s" },
  { top: "15%", left: "55%", size: 2, delay: "0.5s", duration: "16s" },
  { top: "35%", left: "72%", size: 3, delay: "2s", duration: "20s" },
  { top: "48%", left: "18%", size: 2, delay: "0.8s", duration: "15s" },
  { top: "60%", left: "42%", size: 3, delay: "1.5s", duration: "17s" },
  { top: "72%", left: "65%", size: 2, delay: "3s", duration: "19s" },
  { top: "85%", left: "30%", size: 2, delay: "0.3s", duration: "16s" },
  { top: "40%", left: "88%", size: 3, delay: "2.5s", duration: "21s" },
  { top: "55%", left: "8%", size: 2, delay: "1.8s", duration: "14s" },
  { top: "78%", left: "80%", size: 2, delay: "0.6s", duration: "18s" },
  { top: "28%", left: "92%", size: 2, delay: "2.2s", duration: "15s" },
  { top: "92%", left: "52%", size: 3, delay: "1s", duration: "22s" },
  { top: "18%", left: "38%", size: 2, delay: "3.5s", duration: "17s" },
  { top: "65%", left: "95%", size: 2, delay: "0.9s", duration: "19s" },
  { top: "12%", left: "75%", size: 2, delay: "1.4s", duration: "16s" },
  { top: "33%", left: "5%", size: 3, delay: "2.8s", duration: "20s" },
  { top: "68%", left: "48%", size: 2, delay: "0.2s", duration: "18s" },
  { top: "44%", left: "62%", size: 1, delay: "3.2s", duration: "14s" },
  { top: "88%", left: "12%", size: 2, delay: "1.7s", duration: "21s" },
];

export function DashboardParticles() {
  return (
    <div aria-hidden className="dash-particles">
      {particles.map((p, i) => (
        <span
          key={i}
          className="dash-particle"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: i % 3 === 0 ? 0.85 : 0.55,
          }}
        />
      ))}
    </div>
  );
}
