import React, { useEffect, useState, useCallback } from "react";
import * as Tone from "tone";

interface PianoKey {
  note: string;      // Tone.js note name
  isBlack: boolean;
  fileName: string;  // actual mp3 file in public folder
}

const Piano: React.FC = () => {
  const [sampler, setSampler] = useState<Tone.Sampler | null>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const keys: PianoKey[] = [
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
  ];

  useEffect(() => {
    // Create the sampler with correct mapping
    const samplerInstance = new Tone.Sampler({
      urls: keys.reduce((acc, key) => ({ ...acc, [key.note]: key.fileName }), {}),
      baseUrl: "/samples/piano/",
      onload: () => console.log("Piano samples loaded"),
    }).toDestination();

    setSampler(samplerInstance);

    return () => {
      samplerInstance.dispose();
    };
  }, []);

  const playNote = useCallback(
    async (note: string) => {
      if (!sampler) return;
      if (Tone.context.state === "suspended") await Tone.start();

      sampler.triggerAttackRelease(note, "8n");

      setPressedKeys((prev) => new Set(prev).add(note));
      setTimeout(() => {
        setPressedKeys((prev) => {
          const newSet = new Set(prev);
          newSet.delete(note);
          return newSet;
        });
      }, 200);
    },
    [sampler]
  );

  const whiteKeys = keys.filter((k) => !k.isBlack);
  const blackKeys = keys.filter((k) => k.isBlack);

  return (
    <div className="piano-container" style={{ position: "relative", width: whiteKeys.length * 60 }}>
      <div className="white-keys" style={{ display: "flex", zIndex: 1 }}>
        {whiteKeys.map((key) => (
          <button
            key={key.note}
            className={`piano-key white-key ${pressedKeys.has(key.note) ? "pressed" : ""}`}
            style={{ width: 60, height: 200, margin: 0, position: "relative" }}
            onMouseDown={() => playNote(key.note)}
            onTouchStart={(e) => { e.preventDefault(); playNote(key.note); }}
          >
            <span className="note-label">{key.note}</span>
          </button>
        ))}
      </div>

      <div className="black-keys" style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}>
        {blackKeys.map((key) => {
          const keyIndex = keys.findIndex((k) => k.note === key.note);
          const blackKeyOffset = keyIndex - keys.slice(0, keyIndex).filter(k => k.isBlack).length;
          const left = blackKeyOffset * 60 - 15;

          return (
            <button
              key={key.note}
              className={`black-key ${pressedKeys.has(key.note) ? "pressed" : ""}`}
              style={{
                width: 40,
                height: 120,
                backgroundColor: "black",
                color: "white",
                position: "absolute",
                left,
                top: 0,
              }}
              onMouseDown={() => playNote(key.note)}
              onTouchStart={(e) => { e.preventDefault(); playNote(key.note); }}
            >
              <span className="note-label">{key.note}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Piano;
