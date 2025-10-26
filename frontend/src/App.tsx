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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "40px",
          zIndex: 4,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
          }}
        >
          <img
            src="/Etudio.svg"
            alt="Etudio Logo"
            style={{
              width: "200px"
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-30px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0,0,0,0.6)",
              padding: "6px 12px",
              borderRadius: "12px",
            }}
          >
            <span
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: "1.5rem",
                fontFamily: "times new roman, serif",
              }}
            >
              Etudio
            </span>
          </div>
        </div>
      </div>

      <div ref={pianoFrameRef} style={{ position: "relative", zIndex: 3 }}>
        <Piano />
      </div>
    </div>
  );
}

export default App;
