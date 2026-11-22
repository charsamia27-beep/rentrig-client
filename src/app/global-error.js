"use client";

export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#fbf8f3", color: "#1b2236", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 32, marginBottom: 8 }}>RentRig hit a snag</h1>
          <p style={{ opacity: 0.7 }}>Please refresh the page or try again in a moment.</p>
          <button
            onClick={() => reset()}
            style={{ marginTop: 20, padding: "12px 24px", borderRadius: 999, border: 0, background: "#f59e0b", fontWeight: 700, cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
