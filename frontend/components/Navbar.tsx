import { getToken } from "../lib/api";

export default function Navbar({ title }: { title: string }) {
  const hasToken = typeof window !== "undefined" && Boolean(getToken());
  return (
    <div className="topbar">
      <div>
        <div className="muted">Autonomous career agent</div>
        <h1 style={{ margin: "4px 0 0" }}>{title}</h1>
      </div>
      <span className="badge">{hasToken ? "Connected" : "Login required"}</span>
    </div>
  );
}
