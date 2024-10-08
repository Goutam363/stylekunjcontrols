import "./HomeContent.css";
export default function HomeContent() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <div className="home-content">
          <div
            style={{
              zIndex: 1,
              position: "relative",
              padding: "20px",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <div style={{ marginTop: "5rem" }}>
              <h1 className="main-heading">Welcome to Stylekunj Controls</h1>
            </div>
          </div>
          <div className="wave1">
            <svg
              data-name="Layer 1"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                className="shape-fill"
              ></path>
            </svg>
          </div>
        </div>
    </div>
  )
}
