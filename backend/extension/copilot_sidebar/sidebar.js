const output = document.getElementById("output");

async function activeTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

document.getElementById("analyze").addEventListener("click", async () => {
  const tab = await activeTab();
  output.textContent = `Current page:\n${tab?.title || ""}\n${tab?.url || ""}`;
});

document.getElementById("fill").addEventListener("click", async () => {
  output.textContent = "Use the floating page panel button: AI Fill Questions.";
});
