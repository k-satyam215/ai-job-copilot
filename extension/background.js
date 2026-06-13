const BACKEND = "https://ai-job-copilot-backend.onrender.com";

// Token key — matches frontend localStorage key "token"
async function getToken() {
  // Try both keys for backwards compatibility
  const result = await chrome.storage.local.get(["token", "accessToken"]);
  return result.token || result.accessToken || null;
}

async function apiFetch(path, payload) {
  const token = await getToken();
  if (!token) {
    return { error: "Login token missing. Open extension popup and paste your JWT token." };
  }

  let res;
  try {
    res = await fetch(`${BACKEND}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return { error: `Network error: ${err.message}. Is the backend running?` };
  }

  let data;
  try {
    data = await res.json();
  } catch {
    return { error: "Backend returned non-JSON response." };
  }

  if (!res.ok) {
    if (res.status === 401) {
      return { error: "Token expired or invalid. Re-paste your token in the extension popup." };
    }
    return { error: data.detail || `Backend error (${res.status})` };
  }
  return data;
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("AI Job Copilot extension installed");
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "MATCH_JOB") {
    apiFetch("/jobs/match", msg.data).then(sendResponse);
    return true;
  }

  if (msg.type === "APPLY_JOB") {
    apiFetch("/apply/", msg.data).then(sendResponse);
    return true;
  }

  if (msg.type === "COPILOT_ANSWERS") {
    apiFetch("/copilot/answers", msg.data).then(sendResponse);
    return true;
  }

  if (msg.type === "WORKFLOW_PLAN") {
    apiFetch("/automation/workflow/plan", msg.data).then(sendResponse);
    return true;
  }
});
