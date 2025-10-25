import React, { useRef, useEffect } from "react";

interface NoteRainProps {
  frameRef: React.RefObject<HTMLDivElement | null>;
}

const NoteRain: React.FC<NoteRainProps> = ({ frameRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const notes = "♪♫♩♬";
    const numNotes = 30;

    const rain: {
      x: number;
      y: number;
      size: number;
      speed: number;
      char: string;
      swayAmplitude: number;
      swayFrequency: number;
      phase: number;
      rotation: number;
      rotationSpeed: number;
    }[] = [];

    for (let i = 0; i < numNotes; i++) {
      rain.push({
        x: Math.random() * width,
        y: height + Math.random() * 200,
        size: 20 + Math.random() * 20,
        speed: 0.5 + Math.random() * 2,
        char: notes[Math.floor(Math.random() * notes.length)],
        swayAmplitude: 20 + Math.random() * 30,
        swayFrequency: 0.01 + Math.random() * 0.02,
        phase: Math.random() * 2 * Math.PI,
        rotation: Math.random() * 2 * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Get piano frame position to clip notes
      const frameRect = frameRef.current?.getBoundingClientRect();

      rain.forEach((note) => {
        const swayX = note.swayAmplitude * Math.sin(note.phase);
        note.phase += note.swayFrequency;
        note.rotation += note.rotationSpeed;

        // Only draw notes that are outside the piano frame
        const noteX = note.x + swayX;
        const noteY = note.y;

        const insideFrame =
          frameRect &&
          noteX >= frameRect.left &&
          noteX <= frameRect.right &&
          noteY >= frameRect.top &&
          noteY <= frameRect.bottom;

        if (!insideFrame) {
          ctx.save();
          ctx.translate(noteX, noteY);
          ctx.rotate(note.rotation);
          ctx.font = `${note.size}px Arial`;
          ctx.fillStyle = "rgba(0,0,0,0.6)";
          ctx.fillText(note.char, -note.size / 2, note.size / 2);
          ctx.restore();
        }

        note.y -= note.speed;

        if (note.y + note.size < 0) {
          note.y = height + 20 + Math.random() * 50;
          note.x = Math.random() * width;
          note.size = 20 + Math.random() * 20;
          note.speed = 0.5 + Math.random() * 2;
          note.char = notes[Math.floor(Math.random() * notes.length)];
          note.swayAmplitude = 20 + Math.random() * 30;
          note.swayFrequency = 0.01 + Math.random() * 0.02;
          note.phase = Math.random() * 2 * Math.PI;
          note.rotation = Math.random() * 2 * Math.PI;
          note.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [frameRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 1,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default NoteRain;
