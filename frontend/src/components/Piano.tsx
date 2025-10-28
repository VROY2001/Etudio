import React, { useEffect, useState, useCallback, useRef } from "react";
import * as Tone from "tone";
import oakTexture from "../assets/oak.jpg";
import PianoKeysSVG from "../assets/Octave"; // your new React SVG component

interface PianoKey {
  note: string;
  isBlack: boolean;
  fileName: string;
}

const Piano: React.FC = () => {
  const [sampler, setSampler] = useState<Tone.Sampler | null>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [imageLoaded, setImageLoaded] = useState(false);

  const pianoContainerRef = useRef<HTMLDivElement>(null);

  // Define your keys (you can expand as needed)
  const keys: PianoKey[] = [
    { note: "C3",  isBlack: false, fileName: "C3.mp3" },
    { note: "C#3", isBlack: true,  fileName: "Cs3.mp3" },
    { note: "D3",  isBlack: false, fileName: "D3.mp3" },
    { note: "D#3", isBlack: true,  fileName: "Ds3.mp3" },
    { note: "E3",  isBlack: false, fileName: "E3.mp3" },
    { note: "F3",  isBlack: false, fileName: "F3.mp3" },
    { note: "F#3", isBlack: true,  fileName: "Fs3.mp3" },
    { note: "G3",  isBlack: false, fileName: "G3.mp3" },
    { note: "G#3", isBlack: true,  fileName: "Gs3.mp3" },
    { note: "A3",  isBlack: false, fileName: "A3.mp3" },
    { note: "A#3", isBlack: true,  fileName: "As3.mp3" },
    { note: "B3",  isBlack: false, fileName: "B3.mp3" },
    { note: "C4",  isBlack: false, fileName: "C4.mp3" },
  ];

  // Preload oak texture
  useEffect(() => {
    const img = new Image();
    img.src = oakTexture;
    img.onload = () => setImageLoaded(true);
  }, []);

  // Initialize sampler
  useEffect(() => {
    const samplerInstance = new Tone.Sampler({
      urls: keys.reduce((acc, key) => ({ ...acc, [key.note]: key.fileName }), {}),
      baseUrl: "/samples/piano/",
      onload: () => console.log("Piano samples loaded"),
    }).toDestination();

    samplerInstance.attack = 0.03;
    samplerInstance.release = 1.2;
    samplerInstance.volume.value = -2;

    setSampler(samplerInstance);

    return () => {
      samplerInstance.dispose();
    };
  }, []);

  const playNote = useCallback(
    async (note: string) => {
      if (!sampler) return;
      if (Tone.context.state === "suspended") await Tone.start();

      // Transpose up one octave
      const [base, octaveStr] = note.match(/^([A-G]#?)(\d)$/)!.slice(1);
      const octave = parseInt(octaveStr, 10) + 1;
      const transposed = `${base}${octave}`;

      sampler.triggerAttackRelease(transposed, "2n");

      // Visual press effect
      setPressedKeys((prev) => new Set(prev).add(note));
      setTimeout(() => {
        setPressedKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(note);
          return newSet;
        });
      }, 800);
    },
    [sampler]
  );

  // Handle touch events
  useEffect(() => {
    const container = pianoContainerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      const note = target.dataset.note;
      if (note) playNote(note);
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: false });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
    };
  }, [playNote]);

  return (
    <>
      {imageLoaded ? (
        <div
          className="piano-frame"
          style={{
            backgroundImage: `url(${oakTexture})`,
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          <div
            className="piano-container"
            ref={pianoContainerRef}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  flex: "1",
                }}
              >
              <PianoKeysSVG
                onKeyClick={playNote}
              />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>Loading piano...</div>
      )}
    </>
  );
};

export default Piano;
