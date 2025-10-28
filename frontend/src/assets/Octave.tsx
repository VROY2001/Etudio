import React from "react";

interface PianoKeysSVGProps extends React.SVGProps<SVGSVGElement> {
  onKeyClick?: (note: string) => void;
  startOctave?: number; // new
  width?: number;
  height?: number;
}

const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
const blackKeys = ["C#", "D#", "F#", "G#", "A#"];
const blackOffsets = [70, 170, 370, 470, 570];

const PianoKeysSVG: React.FC<PianoKeysSVGProps> = ({
  onKeyClick,
  startOctave = 3,
  width = 350,
  height = 125,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    const note = e.currentTarget.dataset.note;
    if (note && onKeyClick) onKeyClick(note);
  };

  const whiteNoteNames = whiteKeys.map((k) => `${k}${startOctave}`);
  const blackNoteNames = blackKeys.map((k) => `${k}${startOctave}`);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 700 250"
      width="100%"
      height="auto"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <defs>
        <linearGradient id="whiteKeyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fefefe" />
          <stop offset="20%" stopColor="#f8f8f8" />
          <stop offset="50%" stopColor="#eeeeee" />
          <stop offset="100%" stopColor="#dcdcdc" />
        </linearGradient>

        <linearGradient id="blackKeyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#555" />
          <stop offset="10%" stopColor="#222" />
          <stop offset="40%" stopColor="#000" />
          <stop offset="100%" stopColor="#111" />
        </linearGradient>

        <linearGradient id="whiteEdge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#888" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.05} />
        </linearGradient>

        <linearGradient id="blackKeyReflection" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.45} />
          <stop offset="25%" stopColor="#fff" stopOpacity={0.1} />
          <stop offset="60%" stopColor="#fff" stopOpacity={0.05} />
          <stop offset="100%" stopColor="transparent" stopOpacity={0} />
        </linearGradient>

        <filter id="blackShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="4" stdDeviation="2" floodColor="#000" floodOpacity={0.6} />
        </filter>
      </defs>

      <rect width="100%" height="100%" fill="#000" />

      {/* White Keys */}
      <g>
        {whiteNoteNames.map((note, i) => (
          <rect
            key={note}
            x={i * 100}
            y={0}
            width={100}
            height={250}
            data-note={note}
            onClick={handleClick}
            fill="url(#whiteKeyGrad)"
            stroke="url(#whiteEdge)"
            strokeWidth={1}
          />
        ))}
      </g>

      {/* Black Keys */}
      <g filter="url(#blackShadow)">
        {blackNoteNames.map((note, i) => (
          <React.Fragment key={note}>
            <rect
              x={blackOffsets[i]}
              y={0}
              width={60}
              height={160}
              rx={4}
              data-note={note}
              fill="url(#blackKeyGrad)"
              onClick={handleClick}
            />
            <rect
              x={blackOffsets[i]}
              y={0}
              width={60}
              height={160}
              rx={4}
              fill="url(#blackKeyReflection)"
              pointerEvents="none"
            />
          </React.Fragment>
        ))}
      </g>

      {/* Labels */}
      <g fontFamily="Arial, sans-serif" fontSize={18} textAnchor="middle" fill="#333">
        {whiteKeys.map((label, i) => (
          <text key={label} x={i * 100 + 50} y={240}>
            {label}
          </text>
        ))}
      </g>
    </svg>
  );
};

export default PianoKeysSVG;
