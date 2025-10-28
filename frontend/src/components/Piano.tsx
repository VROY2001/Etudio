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
    { note: "C#4", isBlack: true,  fileName: "Cs4.mp3" },
    { note: "D4",  isBlack: false, fileName: "D4.mp3" },
    { note: "D#4", isBlack: true,  fileName: "Ds4.mp3" },
    { note: "E4",  isBlack: false, fileName: "E4.mp3" },
    { note: "F4",  isBlack: false, fileName: "F4.mp3" },
    { note: "F#4", isBlack: true,  fileName: "Fs4.mp3" },
    { note: "G4",  isBlack: false, fileName: "G4.mp3" },
    { note: "G#4", isBlack: true,  fileName: "Gs4.mp3" },
    { note: "A4",  isBlack: false, fileName: "A4.mp3" },
    { note: "A#4", isBlack: true,  fileName: "As4.mp3" },
    { note: "B4",  isBlack: false, fileName: "B4.mp3" },
    { note: "C5",  isBlack: false, fileName: "C5.mp3" },
    { note: "C#5", isBlack: true,  fileName: "Cs5.mp3" },
    { note: "D5",  isBlack: false, fileName: "D5.mp3" },
    { note: "D#5", isBlack: true,  fileName: "Ds5.mp3" },
    { note: "E5",  isBlack: false, fileName: "E5.mp3" },
    { note: "F5",  isBlack: false, fileName: "F5.mp3" },
    { note: "F#5", isBlack: true,  fileName: "Fs5.mp3" },
    { note: "G5",  isBlack: false, fileName: "G5.mp3" },
    { note: "G#5", isBlack: true,  fileName: "Gs5.mp3" },
    { note: "A5",  isBlack: false, fileName: "A5.mp3" },
    { note: "A#5", isBlack: true,  fileName: "As5.mp3" },
    { note: "B5",  isBlack: false, fileName: "B5.mp3" },
    { note: "C6",  isBlack: false, fileName: "C6.mp3" },
    { note: "C#6", isBlack: true,  fileName: "Cs6.mp3" },
    { note: "D6",  isBlack: false, fileName: "D6.mp3" },
    { note: "D#6", isBlack: true,  fileName: "Ds6.mp3" },
    { note: "E6",  isBlack: false, fileName: "E6.mp3" },
    { note: "F6",  isBlack: false, fileName: "F6.mp3"},
    { note: "F#6", isBlack: true,  fileName: "Fs6.mp3" },
    { note: "G6",  isBlack: false, fileName: "G6.mp3" },
    { note: "G#6", isBlack: true,  fileName: "Gs6.mp3" },
    { note: "A6",  isBlack: false, fileName: "A6.mp3" },
    { note: "A#6", isBlack: true,  fileName: "As6.mp3" },
    { note: "B6",  isBlack: false, fileName: "B6.mp3" },
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

    samplerInstance.release = 2;
    samplerInstance.attack = 0;
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
  
      // Play the note exactly as is (no transpose)
      sampler.triggerAttackRelease(note, "2n");
  
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
            {[3, 4, 5].map((octave) => (
              <PianoKeysSVG
                key={octave}
                startOctave={octave}
                onKeyClick={playNote}
                width={350}
                height={125}
              />
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
