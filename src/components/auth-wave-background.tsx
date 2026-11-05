"use client";

import React from "react";

export function AuthWaveBackground() {
  // Generate a set of harmonic contour lines that form the 3D undulating ribbon
  const lines = [
    { amp: 1.0,  offsetY: 0,   color: "url(#waveGrad1)", width: 2,   opacity: 0.9 },
    { amp: 0.95, offsetY: 12,  color: "url(#waveGrad2)", width: 1.6, opacity: 0.85 },
    { amp: 0.9,  offsetY: 24,  color: "url(#waveGrad1)", width: 1.4, opacity: 0.8 },
    { amp: 0.85, offsetY: 36,  color: "url(#waveGrad3)", width: 1.4, opacity: 0.75 },
    { amp: 0.8,  offsetY: 48,  color: "url(#waveGrad2)", width: 1.2, opacity: 0.7 },
    { amp: 0.75, offsetY: 60,  color: "url(#waveGrad1)", width: 1.2, opacity: 0.65 },
    { amp: 0.7,  offsetY: 72,  color: "url(#waveGrad3)", width: 1.2, opacity: 0.6 },
    { amp: 0.65, offsetY: 84,  color: "url(#waveGrad2)", width: 1.1, opacity: 0.55 },
    { amp: 0.6,  offsetY: 96,  color: "url(#waveGrad1)", width: 1.1, opacity: 0.5 },
    { amp: 0.55, offsetY: 108, color: "url(#waveGrad3)", width: 1.0, opacity: 0.45 },
    { amp: 0.5,  offsetY: 120, color: "url(#waveGrad2)", width: 1.0, opacity: 0.4 },
    { amp: 0.45, offsetY: 132, color: "url(#waveGrad1)", width: 0.9, opacity: 0.35 },
  ];

  // Helper to build smooth cubic Bezier wave path across 1400px width
  const makePath = (ampFactor: number, yShift: number) => {
    // Base control points roughly mimicking the reference image:
    // Start (0, 240) -> dip (220, 310) -> crest (380, 150) -> deep trough (580, 390)
    // -> high peak (760, 110) -> dip (1000, 300) -> end (1440, 240)
    const p0 = [0, 240 + yShift * 0.4];
    const cp1a = [100, 240 + yShift * 0.4];
    const cp1b = [140, 290 + 70 * ampFactor + yShift * 0.8];
    const p1 = [230, 270 + 50 * ampFactor + yShift * 0.8];

    const cp2a = [310, 250 - 40 * ampFactor + yShift * 0.5];
    const cp2b = [330, 140 - 50 * ampFactor + yShift * 0.2];
    const p2 = [400, 160 - 40 * ampFactor + yShift * 0.2];

    const cp3a = [480, 180 + 30 * ampFactor + yShift * 0.4];
    const cp3b = [510, 380 + 70 * ampFactor + yShift];
    const p3 = [590, 370 + 60 * ampFactor + yShift];

    const cp4a = [670, 360 + 50 * ampFactor + yShift * 0.9];
    const cp4b = [690, 130 - 70 * ampFactor + yShift * 0.1];
    const p4 = [780, 120 - 60 * ampFactor + yShift * 0.1];

    const cp5a = [880, 110 - 40 * ampFactor + yShift * 0.2];
    const cp5b = [920, 300 + 40 * ampFactor + yShift * 0.7];
    const p5 = [1040, 280 + 30 * ampFactor + yShift * 0.7];

    const cp6a = [1150, 260 + 20 * ampFactor + yShift * 0.6];
    const cp6b = [1280, 230 + yShift * 0.5];
    const p6 = [1440, 240 + yShift * 0.5];

    return `M ${p0[0]} ${p0[1]} ` +
      `C ${cp1a[0]} ${cp1a[1]}, ${cp1b[0]} ${cp1b[1]}, ${p1[0]} ${p1[1]} ` +
      `C ${cp2a[0]} ${cp2a[1]}, ${cp2b[0]} ${cp2b[1]}, ${p2[0]} ${p2[1]} ` +
      `C ${cp3a[0]} ${cp3a[1]}, ${cp3b[0]} ${cp3b[1]}, ${p3[0]} ${p3[1]} ` +
      `C ${cp4a[0]} ${cp4a[1]}, ${cp4b[0]} ${cp4b[1]}, ${p4[0]} ${p4[1]} ` +
      `C ${cp5a[0]} ${cp5a[1]}, ${cp5b[0]} ${cp5b[1]}, ${p5[0]} ${p5[1]} ` +
      `C ${cp6a[0]} ${cp6a[1]}, ${cp6b[0]} ${cp6b[1]}, ${p6[0]} ${p6[1]}`;
  };

  const topPath = makePath(1.0, 0);
  const bottomPath = makePath(0.45, 132);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Soft ambient radial glows to mimic the vibrant light of the reference image */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-sky-300/25 dark:bg-sky-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-pink-300/30 dark:bg-pink-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[350px] bg-purple-300/25 dark:bg-purple-500/10 rounded-full blur-3xl" />

      {/* SVG Wave Ribbon Canvas */}
      <svg
        viewBox="0 0 1440 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-95 transition-opacity duration-700"
      >
        <defs>
          {/* Vibrant cyan to pink/purple gradient 1 */}
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="25%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="75%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          {/* Complementary gradient 2 */}
          <linearGradient id="waveGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="30%" stopColor="#a855f7" />
            <stop offset="60%" stopColor="#fb7185" />
            <stop offset="85%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Soft pastel blend gradient 3 */}
          <linearGradient id="waveGrad3" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="5%" stopColor="#67e8f9" />
            <stop offset="35%" stopColor="#f43f5e" />
            <stop offset="65%" stopColor="#d946ef" />
            <stop offset="95%" stopColor="#3b82f6" />
          </linearGradient>

          {/* Translucent ribbon body fill */}
          <linearGradient id="ribbonBodyFill" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.28" />
            <stop offset="35%" stopColor="#f472b6" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#c084fc" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.25" />
          </linearGradient>

          {/* Subtle drop shadow for ribbon depth */}
          <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Translucent filled ribbon mesh between boundary lines */}
        <path
          d={`${topPath} L 1440 380 L 1440 450 ${bottomPath.replace('M 0', 'L 0')} Z`}
          fill="url(#ribbonBodyFill)"
          className="backdrop-blur-[1px]"
        />

        {/* Additional luminous inner fill */}
        <path
          d={makePath(0.85, 30) + " L 1440 320 L 1440 400 L 0 350 Z"}
          fill="url(#waveGrad1)"
          fillOpacity="0.08"
        />

        {/* Contour lines forming the elegant 3D undulating wave */}
        <g filter="url(#softGlow)">
          {lines.map((line, idx) => (
            <path
              key={idx}
              d={makePath(line.amp, line.offsetY)}
              stroke={line.color}
              strokeWidth={line.width}
              strokeOpacity={line.opacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
