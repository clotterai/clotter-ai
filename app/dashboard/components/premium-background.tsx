import type { CSSProperties } from "react";

const stars = [
  { top: "3%", left: "6%", size: 2, delay: "0.1s", duration: "3.4s", bright: false },
  { top: "7%", left: "18%", size: 1, delay: "1.8s", duration: "2.6s", bright: true },
  { top: "5%", left: "34%", size: 2, delay: "0.6s", duration: "4.2s", bright: false },
  { top: "11%", left: "52%", size: 1, delay: "2.4s", duration: "3.1s", bright: false },
  { top: "8%", left: "71%", size: 2, delay: "0.9s", duration: "2.8s", bright: true },
  { top: "14%", left: "88%", size: 1, delay: "3.2s", duration: "3.9s", bright: false },
  { top: "19%", left: "9%", size: 1, delay: "1.1s", duration: "4.6s", bright: false },
  { top: "22%", left: "26%", size: 2, delay: "2.7s", duration: "3.3s", bright: true },
  { top: "17%", left: "43%", size: 1, delay: "0.4s", duration: "2.4s", bright: false },
  { top: "24%", left: "61%", size: 2, delay: "1.5s", duration: "5.1s", bright: false },
  { top: "20%", left: "79%", size: 1, delay: "3.8s", duration: "3.7s", bright: true },
  { top: "28%", left: "94%", size: 2, delay: "0.7s", duration: "4.4s", bright: false },
  { top: "31%", left: "14%", size: 1, delay: "2.1s", duration: "2.9s", bright: false },
  { top: "35%", left: "33%", size: 2, delay: "1.3s", duration: "3.8s", bright: true },
  { top: "38%", left: "48%", size: 1, delay: "4.1s", duration: "4.1s", bright: false },
  { top: "33%", left: "67%", size: 2, delay: "0.2s", duration: "3.2s", bright: false },
  { top: "41%", left: "82%", size: 1, delay: "2.9s", duration: "2.7s", bright: true },
  { top: "44%", left: "5%", size: 2, delay: "1.7s", duration: "4.8s", bright: false },
  { top: "47%", left: "22%", size: 1, delay: "3.5s", duration: "3.5s", bright: false },
  { top: "50%", left: "39%", size: 2, delay: "0.8s", duration: "2.5s", bright: true },
  { top: "46%", left: "56%", size: 1, delay: "2.3s", duration: "5.4s", bright: false },
  { top: "52%", left: "73%", size: 2, delay: "1.0s", duration: "3.6s", bright: false },
  { top: "49%", left: "91%", size: 1, delay: "4.4s", duration: "2.8s", bright: true },
  { top: "57%", left: "11%", size: 2, delay: "0.5s", duration: "4.3s", bright: false },
  { top: "61%", left: "28%", size: 1, delay: "2.6s", duration: "3.0s", bright: false },
  { top: "58%", left: "45%", size: 2, delay: "1.9s", duration: "2.6s", bright: true },
  { top: "64%", left: "63%", size: 1, delay: "3.1s", duration: "4.7s", bright: false },
  { top: "60%", left: "77%", size: 2, delay: "0.3s", duration: "3.9s", bright: false },
  { top: "67%", left: "93%", size: 1, delay: "2.0s", duration: "2.3s", bright: true },
  { top: "71%", left: "8%", size: 1, delay: "3.7s", duration: "4.0s", bright: false },
  { top: "74%", left: "21%", size: 2, delay: "1.4s", duration: "3.1s", bright: false },
  { top: "69%", left: "37%", size: 1, delay: "0.6s", duration: "5.2s", bright: true },
  { top: "76%", left: "54%", size: 2, delay: "2.8s", duration: "2.9s", bright: false },
  { top: "72%", left: "68%", size: 1, delay: "4.0s", duration: "3.4s", bright: false },
  { top: "79%", left: "84%", size: 2, delay: "1.2s", duration: "4.5s", bright: true },
  { top: "83%", left: "16%", size: 1, delay: "3.3s", duration: "2.7s", bright: false },
  { top: "86%", left: "31%", size: 2, delay: "0.9s", duration: "3.8s", bright: false },
  { top: "81%", left: "47%", size: 1, delay: "2.5s", duration: "4.2s", bright: true },
  { top: "88%", left: "62%", size: 2, delay: "1.6s", duration: "3.3s", bright: false },
  { top: "84%", left: "76%", size: 1, delay: "4.6s", duration: "2.5s", bright: false },
  { top: "91%", left: "90%", size: 2, delay: "0.4s", duration: "5.0s", bright: true },
  { top: "93%", left: "4%", size: 1, delay: "2.2s", duration: "3.6s", bright: false },
  { top: "96%", left: "38%", size: 1, delay: "3.9s", duration: "2.8s", bright: false },
  { top: "12%", left: "96%", size: 2, delay: "1.8s", duration: "4.1s", bright: true },
  { top: "26%", left: "3%", size: 1, delay: "4.3s", duration: "3.2s", bright: false },
  { top: "55%", left: "96%", size: 1, delay: "0.7s", duration: "2.4s", bright: true },
  { top: "42%", left: "96%", size: 2, delay: "3.0s", duration: "4.9s", bright: false },
  { top: "63%", left: "2%", size: 1, delay: "1.1s", duration: "3.7s", bright: false },
  { top: "78%", left: "96%", size: 1, delay: "2.4s", duration: "2.6s", bright: true },
];

const orbBaseStyle: CSSProperties = {
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle, rgba(236, 72, 153, 0.85) 0%, rgba(249, 115, 22, 0.45) 40%, transparent 70%)",
  filter: "blur(80px)",
  opacity: 0.15,
  pointerEvents: "none",
};

export function PremiumBackground() {
  return (
    <div aria-hidden className="chat-nebula">
      <div className="chat-nebula-void" />
      <div className="chat-nebula-depth" />
      <div className="chat-nebula-stars">
        {stars.map((star, index) => (
          <span
            key={index}
            className={`chat-nebula-star${star.bright ? " chat-nebula-star--bright" : ""}`}
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>
      <div className="chat-nebula-vignette" />
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <div
          style={{
            ...orbBaseStyle,
            top: "-8%",
            left: "-10%",
            animation: "chat-inline-orb-float-tl 28s ease-in-out infinite",
          }}
        />
        <div
          style={{
            ...orbBaseStyle,
            bottom: "-8%",
            right: "-10%",
            animation: "chat-inline-orb-float-br 32s ease-in-out infinite",
          }}
        />
        <div
          style={{
            ...orbBaseStyle,
            top: "35%",
            right: "-6%",
            animation: "chat-inline-orb-float-cr 9s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
