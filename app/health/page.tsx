export default function HealthCheck() {
  return (
    <div style={{ padding: "40px", fontFamily: "monospace" }}>
      <h1>✅ App is running!</h1>
      <p>Time: {new Date().toISOString()}</p>
      <p>Environment: {process.env.NODE_ENV}</p>
      <ul>
        <li>Next.js App Router: Working</li>
        <li>TypeScript: Working</li>
        <li>Build: Successful</li>
      </ul>
    </div>
  )
}
