"use client";

import Terminal from "./components/Terminal";

const sendCmd = (cmd: string) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("terminal:run", { detail: { cmd } }));
  }
};

export default function Home() {
  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "2rem",
      }}
    >
      {/* Header */}
      
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <a href="#" className="nav-link" style={{ fontSize: "0.9rem" }} >
          laura chen
        </a>

        <nav style={{ display: "flex", gap: "1.5rem" }}>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); sendCmd("about"); }}>about</a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); sendCmd("work"); }}>work</a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); sendCmd("contact"); }}>contact</a>
        </nav>
      </header>

      {/* Terminal section — centered vertically */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Terminal />
      </div>

      {/* Footer */}
      <footer style={{ alignSelf: "flex-start" }}>
        <span style={{ fontSize: "1rem", color: "#8a8a8a" }}>
          programmer
        </span>
      </footer>
    </main>
  );
}
