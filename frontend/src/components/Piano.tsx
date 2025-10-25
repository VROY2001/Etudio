import React, { useEffect, useState, useCallback } from "react";
import * as Tone from "tone";
import oakTexture from "../assets/oak.jpg";

interface PianoKey {
  note: string;
  isBlack: boolean;
  fileName: string;
}

const Piano: React.FC = () => {
  const [sampler, setSampler] = useState<Tone.Sampler | null>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [imageLoaded, setImageLoaded] = useState(false);

  const keys: PianoKey[] = [
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
  ];

  // oak texture preloading
  useEffect(() => {
    const img = new Image();
    img.src = oakTexture;
    img.onload = () => setImageLoaded(true);
  }, []);

  useEffect(() => {
    const samplerInstance = new Tone.Sampler({
      urls: keys.reduce((acc, key) => ({ ...acc, [key.note]: key.fileName }), {}),
      baseUrl: "/samples/piano/",
      onload: () => console.log("Piano samples loaded"),
    }).toDestination();
  
    // Add gentle ADSR envelope for smoother sustain and fadeout
    samplerInstance.attack = 0.01;
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
  
      // Transpose up an octave
      const [base, octaveStr] = note.match(/^([A-G]#?)(\d)$/)!.slice(1);
      const octave = parseInt(octaveStr, 10) + 1;
      const transposed = `${base}${octave}`;
  
      // Play note with Tone's envelope handling sustain & release
      sampler.triggerAttackRelease(transposed, "2n");
  
      // Visual press
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
  

  const whiteKeys = keys.filter((k) => !k.isBlack);
  const blackKeys = keys.filter((k) => k.isBlack);

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
          <div className="piano-container" style={{ width: whiteKeys.length * 60 }}>
            <div className="white-keys">
              {whiteKeys.map((key) => (
                <button
                  key={key.note}
                  className={`piano-key white-key ${pressedKeys.has(key.note) ? "pressed" : ""}`}
                  onMouseDown={() => playNote(key.note)}
                  onTouchStart={(e) => { e.preventDefault(); playNote(key.note); }}
                >
                  <span className="note-label">{key.note}</span>
                </button>
              ))}
            </div>

            <div className="black-keys">
              {blackKeys.map((key) => {
                const whiteWidth = 60;
                const blackWidth = 40;

                const blackToWhiteBefore: Record<string, string> = {
                  "C#": "C",
                  "D#": "D",
                  "F#": "F",
                  "G#": "G",
                  "A#": "A",
                };

                const [noteBase, octave] = key.note.match(/^([A-G]#?)(\d)$/)!.slice(1);
                const whiteBefore = `${blackToWhiteBefore[noteBase]}${octave}`;
                const whiteIndex = whiteKeys.findIndex((k) => k.note === whiteBefore);
                const left = (whiteIndex + 1) * whiteWidth - blackWidth / 2;

                return (
                  <button
                    key={key.note}
                    className={`black-key ${pressedKeys.has(key.note) ? "pressed" : ""}`}
                    style={{ left }}
                    onMouseDown={() => playNote(key.note)}
                    onTouchStart={(e) => { e.preventDefault(); playNote(key.note); }}
                  >
                    <span className="note-label">{key.note}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>Loading piano...</div>
      )}
    </>
  );
};

export default Piano;
