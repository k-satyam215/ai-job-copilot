const tokenInput = document.getElementById("token");
const statusBox = document.getElementById("status");

// Load saved token on popup open
chrome.storage.local.get(["token", "accessToken"], (result) => {
  const saved = result.token || result.accessToken || "";
  if (saved) {
    tokenInput.value = saved;
    statusBox.textContent = "✓ Token saved. Extension is active.";
    statusBox.style.color = "#22d3a0";
  }
});

document.getElementById("save").addEventListener("click", () => {
  const token = tokenInput.value.trim();
  // Save under both keys for backward compatibility
  chrome.storage.local.set({ token, accessToken: token, tokenSavedAt: Date.now() }, () => {
    if (token) {
      statusBox.textContent = "✓ Saved! Open a job page and start applying.";
      statusBox.style.color = "#22d3a0";
    } else {
      statusBox.textContent = "Token cleared.";
      statusBox.style.color = "#f87171";
    }
  });
});

// Copy token from input
const copyBtn = document.getElementById("copy");
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    const val = tokenInput.value.trim();
    if (!val) return;
    navigator.clipboard.writeText(val).then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => { copyBtn.textContent = "Copy"; }, 2000);
    });
  });
}
