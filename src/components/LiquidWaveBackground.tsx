"use client";

export default function LiquidWaveBackground() {
  return (
    <div
      className="absolute inset-0 overflow-visible pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden
    >
      <div
        className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(15,15,15,0.12) 0%, transparent 65%)",
          animation: "liquid-blob-1 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/3 -left-20 w-[450px] h-[450px] rounded-full"
        style={{
          background: "radial-gradient(circle at 70% 30%, rgba(15,15,15,0.1) 0%, transparent 65%)",
          animation: "liquid-blob-2 15s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-10 right-1/3 w-[380px] h-[380px] rounded-full"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(15,15,15,0.11) 0%, transparent 65%)",
          animation: "liquid-blob-3 10s ease-in-out infinite",
        }}
      />
      <svg className="absolute bottom-0 left-0 w-full h-48" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ opacity: 0.12 }}>
        <path
          fill="#0f0f0f"
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,165.3C960,171,1056,149,1152,138.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          style={{ animation: "wave-slow 6s ease-in-out infinite" }}
        />
      </svg>
      <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ opacity: 0.1 }}>
        <path
          fill="#0f0f0f"
          d="M0,192L60,197.3C120,203,240,213,360,208C480,203,600,181,720,165.3C840,149,960,139,1080,149.3C1200,160,1320,192,1380,208L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          style={{ animation: "wave-medium 4s ease-in-out infinite" }}
        />
      </svg>
    </div>
  );
}
