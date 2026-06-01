export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">AI Job Copilot</div>
      <nav className="nav">
        <a href="/dashboard">Dashboard</a>
        <a href="/resume">Resume Intelligence</a>
        <a href="/applications">Applications</a>
        <a href="/analytics">Analytics</a>
        <a href="/interview">Interview Prep</a>
        <a href="/roadmap">Roadmap</a>
        <a href="/billing">Billing</a>
        <a href="/">Home</a>
      </nav>
    </aside>
  );
}
