import React from "react";

interface StudioIllustration404Props {
  className?: string;
}

/**
 * Custom SVG Studio Illustration featuring:
 * - Studio spotlight on a C-stand / boom arm casting a glowing illumination cone
 * - Professional cinema / photo camera on a heavy-duty studio tripod inside the spotlight beam
 * - Studio cyclorama curve, reflection pool, floor cable, and viewfinder screen with 404 crosshair
 * - Fully responsive and styled for both light and dark StudioSpace themes
 */
export function StudioIllustration404({
  className = "w-full max-w-lg h-auto mx-auto",
}: StudioIllustration404Props) {
  return (
    <svg
      viewBox="0 0 540 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <defs>
        {/* Spotlight light beam gradient */}
        <linearGradient
          id="spotlightBeamGrad"
          x1="120"
          y1="50"
          x2="350"
          y2="280"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--color-primary, #bd583d)" stopOpacity="0.45" />
          <stop offset="40%" stopColor="var(--color-accent, #d3a344)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--color-primary, #bd583d)" stopOpacity="0.01" />
        </linearGradient>

        {/* Ambient bulb glow */}
        <radialGradient
          id="spotlightBulbGlow"
          cx="0.5"
          cy="0.5"
          r="0.5"
          fx="0.5"
          fy="0.5"
        >
          <stop offset="0%" stopColor="var(--color-accent, #d3a344)" stopOpacity="0.9" />
          <stop offset="35%" stopColor="var(--color-primary, #bd583d)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-primary, #bd583d)" stopOpacity="0" />
        </radialGradient>

        {/* Floor reflection ellipse */}
        <radialGradient
          id="floorPoolGlow"
          cx="0.5"
          cy="0.5"
          r="0.5"
          fx="0.5"
          fy="0.5"
        >
          <stop offset="0%" stopColor="var(--color-primary, #bd583d)" stopOpacity="0.22" />
          <stop offset="60%" stopColor="var(--color-accent, #d3a344)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* Camera lens optical coating reflection */}
        <linearGradient
          id="lensGlassGrad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="var(--color-info, #4a7b84)" stopOpacity="0.8" />
          <stop offset="50%" stopColor="var(--color-secondary, #49675e)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-primary, #bd583d)" stopOpacity="0.8" />
        </linearGradient>

        {/* Filter drop shadow for subtle depth */}
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. BACKGROUND STUDIO CYCLORAMA WALL & STAGE FLOOR */}
      {/* Curved studio backdrop infinity cove line */}
      <path
        d="M 20 220 Q 270 235 520 220"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        className="text-base-300 opacity-60"
      />
      {/* Floor base line */}
      <line
        x1="40"
        y1="285"
        x2="500"
        y2="285"
        stroke="currentColor"
        strokeWidth="1"
        className="text-base-300 opacity-40"
      />

      {/* 2. SPOTLIGHT BEAM ILLUMINATION CONE */}
      {/* Ellipse on floor receiving the light */}
      <ellipse
        cx="290"
        cy="285"
        rx="160"
        ry="28"
        fill="url(#floorPoolGlow)"
      />

      {/* Light cone emanating from the spotlight fixture down onto stage & camera */}
      <polygon
        points="115,55 450,285 140,285 95,70"
        fill="url(#spotlightBeamGrad)"
      />

      {/* Floating creative light dust motes in the spotlight beam */}
      <circle cx="165" cy="115" r="2" fill="var(--color-accent, #d3a344)" opacity="0.6" />
      <circle cx="210" cy="150" r="1.5" fill="var(--color-primary, #bd583d)" opacity="0.7" />
      <circle cx="280" cy="190" r="2.5" fill="var(--color-accent, #d3a344)" opacity="0.5" />
      <circle cx="240" cy="95" r="1.2" fill="currentColor" className="text-base-content opacity-40" />
      <circle cx="340" cy="225" r="1.8" fill="var(--color-accent, #d3a344)" opacity="0.6" />

      {/* 3. STUDIO SPOTLIGHT FIXTURE & MOUNT (Top Left) */}
      <g id="spotlight-fixture">
        {/* Overhead boom arm / C-stand pipe */}
        <line
          x1="30"
          y1="10"
          x2="95"
          y2="60"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="text-base-content opacity-70"
        />
        {/* Grip head / mounting knuckle */}
        <circle
          cx="95"
          cy="60"
          r="7"
          fill="currentColor"
          className="text-base-300"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="95"
          cy="60"
          r="3"
          fill="var(--color-primary, #bd583d)"
        />

        {/* T-handle tightening screw */}
        <line
          x1="95"
          y1="49"
          x2="95"
          y2="42"
          stroke="currentColor"
          strokeWidth="3"
          className="text-base-content opacity-80"
        />
        <line
          x1="89"
          y1="42"
          x2="101"
          y2="42"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-base-content opacity-80"
        />

        {/* Spotlight Yoke bracket */}
        <path
          d="M 95 65 L 102 75 L 108 72"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="text-base-content opacity-75"
        />

        {/* Spotlight cylindrical housing (angled down at ~35 deg) */}
        <g transform="rotate(35, 105, 65)">
          {/* Main lamp housing body */}
          <rect
            x="85"
            y="48"
            width="42"
            height="34"
            rx="5"
            fill="currentColor"
            className="text-base-content"
          />
          {/* Heat dissipation rib vents */}
          <line x1="91" y1="53" x2="91" y2="77" stroke="currentColor" strokeWidth="1.5" className="text-base-300 opacity-60" />
          <line x1="97" y1="53" x2="97" y2="77" stroke="currentColor" strokeWidth="1.5" className="text-base-300 opacity-60" />
          <line x1="103" y1="53" x2="103" y2="77" stroke="currentColor" strokeWidth="1.5" className="text-base-300 opacity-60" />

          {/* Front lens ring */}
          <rect
            x="127"
            y="47"
            width="8"
            height="36"
            rx="2"
            fill="var(--color-primary, #bd583d)"
          />

          {/* Glowing Fresnel front lens */}
          <ellipse
            cx="135"
            cy="65"
            rx="4"
            ry="17"
            fill="var(--color-accent, #d3a344)"
          />

          {/* Top Barndoor (angled open) */}
          <polygon
            points="128,47 155,30 152,24 125,43"
            fill="currentColor"
            className="text-base-content"
            opacity="0.9"
          />
          {/* Bottom Barndoor (angled open) */}
          <polygon
            points="128,83 155,100 152,106 125,87"
            fill="currentColor"
            className="text-base-content"
            opacity="0.9"
          />
          {/* Side Barndoor flap */}
          <polygon
            points="132,54 160,50 160,80 132,76"
            fill="currentColor"
            className="text-base-300"
            opacity="0.4"
          />
        </g>

        {/* Ambient spotlight bulb flare aura */}
        <circle
          cx="115"
          cy="68"
          r="26"
          fill="url(#spotlightBulbGlow)"
          filter="url(#softGlow)"
        />
      </g>

      {/* 4. PROFESSIONAL STUDIO CINEMA CAMERA & TRIPOD (Center Stage) */}
      <g id="studio-camera">
        {/* TRIPOD LEGS & SPREADER */}
        {/* Rubber feet */}
        <ellipse cx="215" cy="285" rx="6" ry="2.5" fill="currentColor" className="text-base-content opacity-90" />
        <ellipse cx="288" cy="287" rx="7" ry="3" fill="currentColor" className="text-base-content opacity-90" />
        <ellipse cx="360" cy="285" rx="6" ry="2.5" fill="currentColor" className="text-base-content opacity-90" />

        {/* Left tripod twin leg tube */}
        <line x1="284" y1="185" x2="216" y2="284" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-base-content opacity-85" />
        <line x1="287" y1="185" x2="220" y2="284" stroke="currentColor" strokeWidth="1.5" className="text-base-300 opacity-60" />

        {/* Center tripod leg tube */}
        <line x1="288" y1="185" x2="288" y2="285" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" className="text-base-content opacity-90" />

        {/* Right tripod twin leg tube */}
        <line x1="292" y1="185" x2="359" y2="284" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-base-content opacity-85" />
        <line x1="289" y1="185" x2="355" y2="284" stroke="currentColor" strokeWidth="1.5" className="text-base-300 opacity-60" />

        {/* Mid-level leg spreader brackets */}
        <line x1="250" y1="238" x2="325" y2="238" stroke="currentColor" strokeWidth="2.5" className="text-base-content opacity-75" />
        <circle cx="288" cy="238" r="3.5" fill="var(--color-primary, #bd583d)" />

        {/* Leg lock collars */}
        <rect x="245" y="234" width="7" height="6" rx="1.5" fill="currentColor" className="text-base-content" />
        <rect x="284" y="246" width="8" height="6" rx="1.5" fill="currentColor" className="text-base-content" />
        <rect x="323" y="234" width="7" height="6" rx="1.5" fill="currentColor" className="text-base-content" />

        {/* FLUID TRIPOD HEAD & BASE BOWL */}
        <ellipse cx="288" cy="186" rx="14" ry="4" fill="currentColor" className="text-base-300" />
        <rect x="281" y="172" width="14" height="14" rx="2" fill="currentColor" className="text-base-content" />
        {/* Pan-tilt fluid handle */}
        <path
          d="M 283 178 L 246 194 L 235 204"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-base-content opacity-80"
        />
        {/* Rubber handle grip */}
        <line x1="243" y1="197" x2="235" y2="204" stroke="var(--color-primary, #bd583d)" strokeWidth="4.5" strokeLinecap="round" />

        {/* CAMERA MAIN BODY (Facing leftwards towards the set) */}
        <g id="camera-body">
          {/* Cinema camera main chassis */}
          <rect
            x="266"
            y="126"
            width="52"
            height="46"
            rx="6"
            fill="currentColor"
            className="text-base-content"
          />
          {/* Accent side plate */}
          <rect
            x="274"
            y="132"
            width="36"
            height="34"
            rx="3"
            fill="currentColor"
            className="text-base-200"
            opacity="0.3"
          />

          {/* Top NATO handle & mic mount */}
          <path
            d="M 276 126 L 276 112 Q 292 108 308 112 L 308 126"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-base-content"
          />
          {/* Handle grip padding */}
          <line
            x1="282"
            y1="112"
            x2="302"
            y2="112"
            stroke="var(--color-primary, #bd583d)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Shotgun microphone on cold shoe */}
          <rect
            x="250"
            y="106"
            width="32"
            height="6"
            rx="3"
            fill="currentColor"
            className="text-base-300"
          />
          <line x1="253" y1="109" x2="265" y2="109" stroke="currentColor" strokeWidth="1" className="text-base-content opacity-50" />

          {/* Large Cinema Lens Barrel */}
          <rect
            x="226"
            y="135"
            width="40"
            height="28"
            rx="2"
            fill="currentColor"
            className="text-base-content"
          />
          {/* Focus & Zoom gear teeth rings */}
          <rect x="248" y="133" width="5" height="32" rx="1" fill="var(--color-primary, #bd583d)" />
          <rect x="238" y="133" width="5" height="32" rx="1" fill="currentColor" className="text-base-300" />

          {/* Matte Box / Sun Hood on Lens */}
          <polygon
            points="226,133 205,124 205,174 226,165"
            fill="currentColor"
            className="text-base-content"
            opacity="0.95"
          />
          {/* Top French flag flap on matte box */}
          <polygon
            points="205,124 185,116 218,116 226,133"
            fill="currentColor"
            className="text-base-300"
            opacity="0.8"
          />
          {/* Front glass lens element with multi-coated optical reflection */}
          <ellipse
            cx="205"
            cy="149"
            rx="4.5"
            ry="23"
            fill="url(#lensGlassGrad)"
          />
          <ellipse
            cx="204"
            cy="145"
            rx="2"
            ry="10"
            fill="#ffffff"
            opacity="0.5"
          />

          {/* Tally Recording LED Indicator Light (Glows red/primary) */}
          <circle
            cx="272"
            cy="133"
            r="3.5"
            fill="var(--color-error, #b94d45)"
          />
          <circle
            cx="272"
            cy="133"
            r="6"
            fill="var(--color-error, #b94d45)"
            opacity="0.4"
            filter="url(#softGlow)"
          />

          {/* ARTICULATING DIRECTOR'S MONITOR (Flipped out at back right) */}
          <g id="director-monitor" transform="rotate(-6, 320, 130)">
            {/* Monitor arm */}
            <line x1="318" y1="140" x2="330" y2="136" stroke="currentColor" strokeWidth="3" className="text-base-content" />
            {/* Monitor bezel */}
            <rect
              x="328"
              y="122"
              width="44"
              height="32"
              rx="3"
              fill="currentColor"
              className="text-base-content"
              stroke="currentColor"
              strokeWidth="1"
            />
            {/* Monitor screen glass */}
            <rect
              x="331"
              y="125"
              width="38"
              height="26"
              rx="1.5"
              fill="var(--color-base-100, #172321)"
            />
            {/* Crosshairs & "404" indicator on screen */}
            <line x1="350" y1="128" x2="350" y2="148" stroke="var(--color-primary, #bd583d)" strokeWidth="0.8" opacity="0.6" />
            <line x1="334" y1="138" x2="366" y2="138" stroke="var(--color-primary, #bd583d)" strokeWidth="0.8" opacity="0.6" />
            <text
              x="350"
              y="141"
              textAnchor="middle"
              fontSize="7.5"
              fontWeight="bold"
              fontFamily="monospace"
              fill="var(--color-primary, #bd583d)"
            >
              404
            </text>
            <circle cx="334" cy="128" r="1.2" fill="var(--color-error, #b94d45)" />
          </g>

          {/* Camera battery pack (V-mount attached at back) */}
          <rect
            x="318"
            y="142"
            width="10"
            height="22"
            rx="2"
            fill="currentColor"
            className="text-base-300"
          />
        </g>
      </g>

      {/* 5. STUDIO FLOOR DETAILS */}
      {/* Coiled heavy-duty studio XLR / power stinger cable on floor */}
      <path
        d="M 330 286 C 360 284, 380 292, 400 287 C 418 282, 430 291, 445 287 C 455 284, 465 288, 478 286"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        className="text-base-content opacity-50"
      />

      {/* Classic gaffer tape "X" mark on stage floor */}
      <g id="gaffer-x" opacity="0.8">
        <line
          x1="168"
          y1="281"
          x2="182"
          y2="289"
          stroke="var(--color-accent, #d3a344)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="182"
          y1="281"
          x2="168"
          y2="289"
          stroke="var(--color-accent, #d3a344)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Stylized studio watermark "SCENE 404 • TAKE 1" */}
      <text
        x="475"
        y="42"
        textAnchor="end"
        fontSize="11"
        letterSpacing="2"
        fontFamily="monospace"
        fill="currentColor"
        className="text-base-content opacity-30 select-none"
      >
        STUDIO SPACE // SET 404
      </text>
    </svg>
  );
}

export default StudioIllustration404;
