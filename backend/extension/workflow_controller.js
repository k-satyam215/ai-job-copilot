window.AIJobCopilotWorkflowController = (() => {
  function sendMessage(message) {
    return new Promise((resolve) => chrome.runtime.sendMessage(message, resolve));
  }

  async function plan(source) {
    const observation = window.AIJobCopilotDomObserver.observe();
    return sendMessage({
      type: "WORKFLOW_PLAN",
      data: {
        workflow_id: `${source}_${Date.now()}`,
        source,
        job_url: location.href,
        autonomous_mode: false,
        observation
      }
    });
  }

  return { plan };
})();
