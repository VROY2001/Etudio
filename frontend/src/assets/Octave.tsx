import React from "react";

interface PianoKeysSVGProps extends React.SVGProps<SVGSVGElement> {
  onKeyClick?: (note: string) => void;
  startOctave?: number;
}

const whiteKeys = ["C", "D", "E", "F", "G", "A", "B"];
const blackKeys = ["C#", "D#", "F#", "G#", "A#"];
const blackOffsets = [70, 170, 370, 470, 570];

// Master key map (matches your app)
const keyMap: Record<string, string> = {
  q: "C3", 1: "C#3", w: "D3", 2: "D#3", e: "E3",
  r: "F3", 3: "F#3", t: "G3", 4: "G#3", y: "A3",
  5: "A#3", u: "B3", i: "C4", 6: "C#4", o: "D4",
  7: "D#4", p: "E4", "[": "F4", 8: "F#4", "]": "G4",
  9: "G#4", "\\": "A4", 0: "A#4", "'": "B4",
  z: "C5", s: "C#5", x: "D5", d: "D#5", c: "E5",
  v: "F5", g: "F#5", b: "G5", h: "G#5", n: "A5",
  j: "A#5", m: "B5", ",": "C6", l: "C#6", ".": "D6",
  ";": "D#6", "/": "E6", " ": "F6"
};

// Reverse lookup: note -> key label
const noteToKeyLabel = Object.entries(keyMap).reduce<Record<string, string>>(
  (acc, [key, note]) => ({ ...acc, [note]: key.toUpperCase() }),
  {}
);

const PianoKeysSVG: React.FC<PianoKeysSVGProps> = ({
  onKeyClick,
  startOctave = 3,
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

      {/* Keyboard Labels */}
      <g fontFamily="Arial, sans-serif" fontSize={16} textAnchor="middle">
        {/* White key labels */}
        {whiteNoteNames.map((note, i) => (
          <text
            key={`label-${note}`}
            x={i * 100 + 50}
            y={230}
            fill="#333"
          >
            {noteToKeyLabel[note] || ""}
          </text>
        ))}

        {/* Black key labels */}
        {blackNoteNames.map((note, i) => (
          <text
            key={`label-${note}`}
            x={blackOffsets[i] + 30}
            y={140}
            fill="#fff"
          >
            {noteToKeyLabel[note] || ""}
          </text>
        ))}
      </g>
    </svg>
  );
};

export default PianoKeysSVG;
