const tokenInput = document.getElementById("token");
const statusBox = document.getElementById("status");

chrome.storage.local.get(["accessToken"], (result) => {
  if (result.accessToken) {
    tokenInput.value = result.accessToken;
    statusBox.textContent = "Token already saved.";
  }
});

document.getElementById("save").addEventListener("click", () => {
  const token = tokenInput.value.trim();
  chrome.storage.local.set({ accessToken: token, tokenSavedAt: Date.now() }, () => {
    statusBox.textContent = token ? "Saved. Open a job page and refresh." : "Token cleared.";
  });
});
