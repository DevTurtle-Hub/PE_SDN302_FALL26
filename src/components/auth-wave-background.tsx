"use client";

import React from "react";

export function AuthWaveBackground() {
  // Generate a set of harmonic contour lines that form the 3D undulating ribbon
  const lines = [
    { amp: 1.15, offsetY: 0,   color: "url(#waveGrad1)", width: 2.4, opacity: 0.95 },
    { amp: 1.1,  offsetY: 15,  color: "url(#waveGrad2)", width: 2.0, opacity: 0.9 },
    { amp: 1.05, offsetY: 30,  color: "url(#waveGrad1)", width: 1.8, opacity: 0.85 },
    { amp: 1.0,  offsetY: 45,  color: "url(#waveGrad3)", width: 1.6, opacity: 0.8 },
    { amp: 0.95, offsetY: 60,  color: "url(#waveGrad2)", width: 1.5, opacity: 0.75 },
    { amp: 0.9,  offsetY: 75,  color: "url(#waveGrad1)", width: 1.4, opacity: 0.7 },
    { amp: 0.85, offsetY: 90,  color: "url(#waveGrad3)", width: 1.3, opacity: 0.65 },
    { amp: 0.8,  offsetY: 105, color: "url(#waveGrad2)", width: 1.3, opacity: 0.6 },
    { amp: 0.75, offsetY: 120, color: "url(#waveGrad1)", width: 1.2, opacity: 0.55 },
    { amp: 0.7,  offsetY: 135, color: "url(#waveGrad3)", width: 1.1, opacity: 0.5 },
    { amp: 0.65, offsetY: 150, color: "url(#waveGrad2)", width: 1.1, opacity: 0.45 },
    { amp: 0.6,  offsetY: 165, color: "url(#waveGrad1)", width: 1.0, opacity: 0.4 },
    { amp: 0.55, offsetY: 180, color: "url(#waveGrad3)", width: 0.9, opacity: 0.35 },
  ];

  // Helper to build smooth cubic Bezier wave path across 1440px width with larger amplitude
  const makePath = (ampFactor: number, yShift: number) => {
    const p0 = [0, 260 + yShift * 0.4];
    const cp1a = [120, 260 + yShift * 0.4];
    const cp1b = [150, 320 + 80 * ampFactor + yShift * 0.8];
    const p1 = [250, 290 + 60 * ampFactor + yShift * 0.8];

    const cp2a = [340, 260 - 50 * ampFactor + yShift * 0.5];
    const cp2b = [360, 130 - 65 * ampFactor + yShift * 0.2];
    const p2 = [440, 150 - 50 * ampFactor + yShift * 0.2];

    const cp3a = [530, 170 + 40 * ampFactor + yShift * 0.4];
    const cp3b = [560, 420 + 85 * ampFactor + yShift];
    const p3 = [660, 400 + 75 * ampFactor + yShift];

    const cp4a = [750, 380 + 60 * ampFactor + yShift * 0.9];
    const cp4b = [770, 110 - 85 * ampFactor + yShift * 0.1];
    const p4 = [880, 100 - 75 * ampFactor + yShift * 0.1];

    const cp5a = [990, 90 - 50 * ampFactor + yShift * 0.2];
    const cp5b = [1030, 320 + 50 * ampFactor + yShift * 0.7];
    const p5 = [1160, 300 + 40 * ampFactor + yShift * 0.7];

    const cp6a = [1270, 280 + 25 * ampFactor + yShift * 0.6];
    const cp6b = [1350, 240 + yShift * 0.5];
    const p6 = [1440, 250 + yShift * 0.5];

    return `M ${p0[0]} ${p0[1]} ` +
      `C ${cp1a[0]} ${cp1a[1]}, ${cp1b[0]} ${cp1b[1]}, ${p1[0]} ${p1[1]} ` +
      `C ${cp2a[0]} ${cp2a[1]}, ${cp2b[0]} ${cp2b[1]}, ${p2[0]} ${p2[1]} ` +
      `C ${cp3a[0]} ${cp3a[1]}, ${cp3b[0]} ${cp3b[1]}, ${p3[0]} ${p3[1]} ` +
      `C ${cp4a[0]} ${cp4a[1]}, ${cp4b[0]} ${cp4b[1]}, ${p4[0]} ${p4[1]} ` +
      `C ${cp5a[0]} ${cp5a[1]}, ${cp5b[0]} ${cp5b[1]}, ${p5[0]} ${p5[1]} ` +
      `C ${cp6a[0]} ${cp6a[1]}, ${cp6b[0]} ${cp6b[1]}, ${p6[0]} ${p6[1]}`;
  };

  const topPath = makePath(1.15, 0);
  const bottomPath = makePath(0.55, 180);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Soft ambient radial glows with larger coverage */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[450px] bg-sky-300/30 dark:bg-sky-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-pink-300/35 dark:bg-pink-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/4 right-1/4 w-[550px] h-[450px] bg-purple-300/30 dark:bg-purple-500/10 rounded-full blur-3xl" />

      {/* SVG Wave Ribbon Canvas */}
      <svg
        viewBox="0 0 1440 680"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-95"
      >
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="25%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="75%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>

          <linearGradient id="waveGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="30%" stopColor="#a855f7" />
            <stop offset="60%" stopColor="#fb7185" />
            <stop offset="85%" stopColor="#e879f9" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <linearGradient id="waveGrad3" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="5%" stopColor="#67e8f9" />
            <stop offset="35%" stopColor="#f43f5e" />
            <stop offset="65%" stopColor="#d946ef" />
            <stop offset="95%" stopColor="#3b82f6" />
          </linearGradient>

          <linearGradient id="ribbonBodyFill" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.32" />
            <stop offset="35%" stopColor="#f472b6" stopOpacity="0.40" />
            <stop offset="70%" stopColor="#c084fc" stopOpacity="0.36" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.28" />
          </linearGradient>

          <filter id="softGlow" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Translucent filled ribbon body */}
        <path
          d={`${topPath} L 1440 430 L 1440 500 ${bottomPath.replace('M 0', 'L 0')} Z`}
          fill="url(#ribbonBodyFill)"
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
