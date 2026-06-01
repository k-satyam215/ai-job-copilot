type Job = {
  title: string;
  company: string;
  location?: string;
  url?: string;
  skills?: string[];
  match?: { match_score: number; recommendation: string; matched_skills: string[] };
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <article className="panel">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="badge">{job.match?.match_score ?? 0}% match</span>
        <span className="muted">{job.match?.recommendation ?? "review"}</span>
      </div>
      <h3>{job.title}</h3>
      <p className="muted">{job.company} {job.location ? `- ${job.location}` : ""}</p>
      <p className="muted">{(job.skills || []).slice(0, 6).join(", ")}</p>
      {job.url && <a className="button secondary" href={job.url} target="_blank">Open job</a>}
    </article>
  );
}
