from app.services.trace_engine import recent_traces


def system_metrics() -> dict:
    traces = recent_traces(500)
    failures = [trace for trace in traces if "fail" in trace["event"] or "error" in trace["event"]]
    return {"trace_count": len(traces), "failure_count": len(failures), "healthy": len(failures) < 10}
