export default function NotFound() {
  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <a
            href="/"
            style={{
              marginTop: "1rem",
              color: "#0070f3",
              textDecoration: "underline",
            }}
          >
            Go back home
          </a>
        </div>
      </body>
    </html>
  );
}
