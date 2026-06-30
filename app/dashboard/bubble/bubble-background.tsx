import type { CSSProperties } from "react";

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

export function BubbleBackground() {
  return (
    <div aria-hidden className="chat-nebula">
      <div className="chat-nebula-void" />
      <div className="chat-nebula-depth" />
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
