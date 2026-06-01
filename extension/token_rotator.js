window.AIJobCopilotTokenRotator = (() => {
  async function tokenAgeStatus() {
    const result = await chrome.storage.local.get(["tokenSavedAt"]);
    return { savedAt: result.tokenSavedAt || null, rotationRecommended: false };
  }
  return { tokenAgeStatus };
})();
