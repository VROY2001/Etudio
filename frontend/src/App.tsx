import React from "react";
import Piano from "./components/Piano";
import brownPaper from "./assets/brown-paper.jpg";

function App() {
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
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
        Etudio - Chopin AI Composer
      </h1>
      <Piano />
    </div>
  );
}

export default App;
