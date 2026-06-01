window.AIJobCopilotSecureStorage = (() => {
  async function saveToken(token) {
    await chrome.storage.local.set({ accessToken: token });
  }

  async function getToken() {
    const result = await chrome.storage.local.get(["accessToken"]);
    return result.accessToken || "";
  }

  async function clearToken() {
    await chrome.storage.local.remove(["accessToken"]);
  }

  return { saveToken, getToken, clearToken };
})();
