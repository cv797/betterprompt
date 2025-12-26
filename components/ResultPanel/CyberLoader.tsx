'use client';

/**
 * CyberLoader - Cyberpunk style loading animation
 * A futuristic neural network / circuit processing animation
 */

import styles from './CyberLoader.module.css';

export const CyberLoader = () => {
  return (
    <div className={styles.loaderContainer}>
      <svg
        className={styles.cyberSvg}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(0, 255, 136, 0.1)"
              strokeWidth="0.5"
            />
          </pattern>

          {/* Neon glow filters */}
          <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-magenta" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient for scanning line */}
          <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0, 212, 255, 0)" />
            <stop offset="50%" stopColor="rgba(0, 212, 255, 1)" />
            <stop offset="100%" stopColor="rgba(0, 212, 255, 0)" />
          </linearGradient>
        </defs>

        {/* Grid background */}
        <rect width="200" height="200" fill="url(#grid)" />

        {/* Outer hexagon frame */}
        <polygon
          className={styles.hexFrame}
          points="100,10 170,40 170,120 100,150 30,120 30,40"
          fill="none"
          stroke="#00ff88"
          strokeWidth="1"
          filter="url(#glow-green)"
        />

        {/* Inner rotating hexagon */}
        <g className={styles.rotatingHex}>
          <polygon
            points="100,30 150,55 150,105 100,130 50,105 50,55"
            fill="none"
            stroke="#00d4ff"
            strokeWidth="1.5"
            filter="url(#glow-cyan)"
          />
        </g>

        {/* Center core - pulsing */}
        <g className={styles.pulsingCore}>
          <circle
            cx="100"
            cy="80"
            r="25"
            fill="none"
            stroke="#ff00ff"
            strokeWidth="2"
            filter="url(#glow-magenta)"
          />
          <circle
            cx="100"
            cy="80"
            r="15"
            fill="rgba(255, 0, 255, 0.1)"
            stroke="#ff00ff"
            strokeWidth="1"
          />
          <circle
            cx="100"
            cy="80"
            r="5"
            fill="#ff00ff"
            filter="url(#glow-magenta)"
          />
        </g>

        {/* Data flow lines */}
        <g className={styles.dataFlow}>
          {/* Top line */}
          <line x1="100" y1="10" x2="100" y2="55" stroke="#00ff88" strokeWidth="1" strokeDasharray="4 4" />
          {/* Bottom line */}
          <line x1="100" y1="105" x2="100" y2="150" stroke="#00ff88" strokeWidth="1" strokeDasharray="4 4" />
          {/* Left lines */}
          <line x1="30" y1="80" x2="75" y2="80" stroke="#00d4ff" strokeWidth="1" strokeDasharray="4 4" />
          {/* Right lines */}
          <line x1="125" y1="80" x2="170" y2="80" stroke="#00d4ff" strokeWidth="1" strokeDasharray="4 4" />
        </g>

        {/* Corner brackets - animated */}
        <g className={styles.cornerBrackets}>
          {/* Top left */}
          <path d="M 20 35 L 20 20 L 35 20" fill="none" stroke="#00ff88" strokeWidth="2" />
          {/* Top right */}
          <path d="M 165 20 L 180 20 L 180 35" fill="none" stroke="#00ff88" strokeWidth="2" />
          {/* Bottom left */}
          <path d="M 20 125 L 20 140 L 35 140" fill="none" stroke="#00ff88" strokeWidth="2" />
          {/* Bottom right */}
          <path d="M 165 140 L 180 140 L 180 125" fill="none" stroke="#00ff88" strokeWidth="2" />
        </g>

        {/* Scanning line */}
        <rect
          className={styles.scanLine}
          x="25"
          y="78"
          width="150"
          height="4"
          fill="url(#scanGradient)"
          opacity="0.8"
        />

        {/* Data nodes - orbiting */}
        <g className={styles.orbitingNodes}>
          <circle cx="100" cy="30" r="4" fill="#00ff88" filter="url(#glow-green)" />
          <circle cx="150" cy="80" r="4" fill="#00d4ff" filter="url(#glow-cyan)" />
          <circle cx="100" cy="130" r="4" fill="#ff00ff" filter="url(#glow-magenta)" />
          <circle cx="50" cy="80" r="4" fill="#00d4ff" filter="url(#glow-cyan)" />
        </g>

        {/* Binary data stream decoration */}
        <g className={styles.binaryStream} opacity="0.4">
          <text x="15" y="165" fill="#00ff88" fontSize="8" fontFamily="monospace">01001</text>
          <text x="165" y="165" fill="#00d4ff" fontSize="8" fontFamily="monospace">10110</text>
          <text x="15" y="175" fill="#00d4ff" fontSize="8" fontFamily="monospace">11010</text>
          <text x="165" y="175" fill="#00ff88" fontSize="8" fontFamily="monospace">01101</text>
        </g>

        {/* Status indicator */}
        <g className={styles.statusIndicator}>
          <rect x="70" y="160" width="60" height="16" fill="rgba(0, 255, 136, 0.1)" stroke="#00ff88" strokeWidth="0.5" />
          <text x="100" y="172" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">ANALYZING</text>
        </g>
      </svg>

      {/* Text below animation */}
      <div className={styles.loaderText}>
        <span className={styles.textMain}>神经网络处理中</span>
        <span className={styles.textDots}>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>

      {/* Glitch bar decoration */}
      <div className={styles.glitchBars}>
        <div className={styles.glitchBar} />
        <div className={styles.glitchBar} />
        <div className={styles.glitchBar} />
      </div>
    </div>
  );
};
