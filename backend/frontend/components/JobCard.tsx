type Job = {
  id?: string | number;
  title: string;
  company: string;
  location?: string;
  url?: string;
  source?: string;
  skills?: string[];
  match?: {
    match_score: number;
    recommendation: string;
    matched_skills?: string[];
  };
};

function getMatchColor(score: number) {
  if (score >= 80) return "badge-green";
  if (score >= 60) return "badge-blue";
  if (score >= 40) return "badge-amber";
  return "badge-neutral";
}

function getRecommendationLabel(rec: string) {
  const map: Record<string, string> = {
    "apply": "Apply Now",
    "review": "Review",
    "skip": "Skip",
  };
  return map[rec?.toLowerCase()] || rec || "Review";
}

export default function JobCard({ job }: { job: Job }) {
  const score = job.match?.match_score ?? 0;
  const skills = (job.skills || job.match?.matched_skills || []).slice(0, 5);

  return (
    <article className="job-card">
      <div className="job-card-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="job-card-title">{job.title}</div>
          <div className="job-card-meta">
            <span>{job.company}</span>
            {job.location && <><span style={{ opacity: 0.4 }}>·</span><span>{job.location}</span></>}
            {job.source && <><span style={{ opacity: 0.4 }}>·</span><span style={{ textTransform: "capitalize" }}>{job.source}</span></>}
          </div>
        </div>
        <span className={`badge ${getMatchColor(score)}`} style={{ flexShrink: 0 }}>
          {score}%
        </span>
      </div>

      <div className="match-bar">
        <div className="match-bar-fill" style={{ width: `${Math.min(score, 100)}%` }} />
      </div>

      {skills.length > 0 && (
        <div className="job-card-skills">
          {skills.map((skill) => (
            <span key={skill} className="badge badge-neutral">{skill}</span>
          ))}
        </div>
      )}

      <div className="job-card-footer">
        <span className="badge badge-purple" style={{ fontSize: "10px" }}>
          {getRecommendationLabel(job.match?.recommendation || "")}
        </span>
        {job.url && (
          <a className="btn btn-ghost btn-sm" href={job.url} target="_blank" rel="noopener">
            Open ↗
          </a>
        )}
      </div>
    </article>
  );
}
