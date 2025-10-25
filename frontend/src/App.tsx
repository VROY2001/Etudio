import React, { useRef } from "react";
import Piano from "./components/Piano";
import NoteRain from "./components/NoteRain";
import brownPaper from "./assets/brown-paper.jpg";

function App() {
  const pianoFrameRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#d2b48c",
        backgroundImage: `url(${brownPaper})`,
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >

      <NoteRain frameRef={pianoFrameRef} />

      <h1 style={{ textAlign: "center", marginBottom: "40px", zIndex: 4 }}>
        Etudio - Chopin AI Composer
      </h1>

      <div ref={pianoFrameRef} style={{ position: "relative", zIndex: 3 }}>
        <Piano />
      </div>
    </div>
  );
}

export default App;
