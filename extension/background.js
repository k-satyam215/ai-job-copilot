const BACKEND = "http://127.0.0.1:8000";

async function getToken() {
  const result = await chrome.storage.local.get(["accessToken"]);
  return result.accessToken;
}

async function apiFetch(path, payload) {
  const token = await getToken();
  if (!token) {
    return { error: "Login token missing. Open extension popup and save your token." };
  }

  const res = await fetch(`${BACKEND}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok) {
    return { error: data.detail || "Backend request failed" };
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
