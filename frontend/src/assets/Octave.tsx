import React from "react";

interface PianoKeysSVGProps extends React.SVGProps<SVGSVGElement> {
  onKeyClick?: (note: string) => void;
  width?: number; // allow resizing
  height?: number;
}

const PianoKeysSVG: React.FC<PianoKeysSVGProps> = ({
  onKeyClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    const note = e.currentTarget.dataset.note;
    if (note && onKeyClick) onKeyClick(note);
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 700 250"
      width="100%"      // fill parent container width
      height="auto"     // keep aspect ratio
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
        {["C3","D3","E3","F3","G3","A3","B3"].map((note, i) => (
          <rect
            key={note}
            x={i * 100}
            y={0}
            width={100}
            height={250}
            fill="url(#whiteKeyGrad)"
            stroke="url(#whiteEdge)"
            strokeWidth={1}
            data-note={note}
            onClick={handleClick}
          />
        ))}
      </g>

      {/* Black Keys */}
      <g filter="url(#blackShadow)">
        {[{note:"C#3", x:70},{note:"D#3", x:170},{note:"F#3", x:370},{note:"G#3", x:470},{note:"A#3", x:570}].map(({note,x}) => (
          <React.Fragment key={note}>
            <rect
              x={x}
              y={0}
              width={60}
              height={160}
              rx={4}
              fill="url(#blackKeyGrad)"
              data-note={note}
              onClick={handleClick}  // Only this rect is interactive
            />
            <rect
              x={x}
              y={0}
              width={60}
              height={160}
              rx={4}
              fill="url(#blackKeyReflection)"
              pointerEvents="none"   // REFLECTION won't block clicks
            />
          </React.Fragment>
        ))}
      </g>

      {/* Labels */}
      <g fontFamily="Arial, sans-serif" fontSize={18} textAnchor="middle" fill="#333">
        {["C","D","E","F","G","A","B"].map((label,i) => (
          <text key={label} x={i*100 + 50} y={240}>{label}</text>
        ))}
      </g>
    </svg>
  );
};

export default PianoKeysSVG;
