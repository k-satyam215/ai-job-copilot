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
    apply: "Apply Now",
    review: "Review",
    skip: "Skip",
  };
  return map[rec?.toLowerCase()] || rec || "Review";
}

/** Returns true if the URL is a job-listing search page, not an individual job */
function isSearchPage(url: string): boolean {
  const searchPatterns = [
    /linkedin\.com\/jobs\/search/,
    /naukri\.com\/[a-z-]+-jobs($|\?)/,
    /indeed\.com\/jobs\?/,
    /foundit\.in\/srp/,
    /apna\.co\/jobs\?/,
    /unstop\.com\/.*search/,
    /arbeitnow\.com\/.*search/,
  ];
  return searchPatterns.some((p) => p.test(url));
}

function getOpenLabel(url: string | undefined): string {
  if (!url) return "Open ↗";
  if (isSearchPage(url)) {
    if (url.includes("linkedin")) return "Search LinkedIn ↗";
    if (url.includes("naukri")) return "Search Naukri ↗";
    if (url.includes("indeed")) return "Search Indeed ↗";
    if (url.includes("foundit")) return "Search Foundit ↗";
    if (url.includes("apna")) return "Search Apna ↗";
    if (url.includes("unstop")) return "Search Unstop ↗";
    return "Search Jobs ↗";
  }
  return "Open Job ↗";
}

export default function JobCard({ job }: { job: Job }) {
  const score = job.match?.match_score ?? 0;
  const skills = (job.skills || job.match?.matched_skills || []).slice(0, 5);
  const openLabel = getOpenLabel(job.url);
  const isSearch = job.url ? isSearchPage(job.url) : false;

  return (
    <article className="job-card">
      <div className="job-card-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="job-card-title">{job.title}</div>
          <div className="job-card-meta">
            <span>{job.company}</span>
            {job.location && (
              <><span style={{ opacity: 0.4 }}>·</span><span>{job.location}</span></>
            )}
            {job.source && (
              <><span style={{ opacity: 0.4 }}>·</span>
              <span style={{ textTransform: "capitalize" }}>{job.source}</span></>
            )}
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

      {/* Search-page hint — tells user they'll land on a results page */}
      {isSearch && (
        <div style={{ fontSize: 11, color: "var(--text-3, #888)", marginTop: 6, marginBottom: 2 }}>
          ℹ️ Opens search results — filter by company name to find this role
        </div>
      )}

      <div className="job-card-footer">
        <span className="badge badge-purple" style={{ fontSize: "10px" }}>
          {getRecommendationLabel(job.match?.recommendation || "")}
        </span>
        {job.url && (
          <a
            className="btn btn-ghost btn-sm"
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {openLabel}
          </a>
        )}
      </div>
    </article>
  );
}
