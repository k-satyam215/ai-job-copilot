window.AIJobCopilotEngine = (() => {
  function sendMessage(message) {
    return new Promise((resolve) => chrome.runtime.sendMessage(message, resolve));
  }

  function injectPanel(source, match, onFill) {
    let box = document.getElementById("ai-job-copilot-panel");
    if (!box) {
      box = document.createElement("div");
      box.id = "ai-job-copilot-panel";
      box.style.cssText = `
        position: fixed; right: 18px; top: 90px; z-index: 2147483647;
        width: 300px; padding: 14px; border-radius: 12px; background: #0b1020;
        color: #eef2ff; box-shadow: 0 18px 50px rgba(0,0,0,.35);
        font-family: Inter, Arial, sans-serif; border: 1px solid #26314f;
      `;
      document.body.appendChild(box);
    }
    box.innerHTML = `
      <div style="font-weight:800;margin-bottom:6px;">AI Job Copilot</div>
      <div style="color:#94a3b8;font-size:12px;margin-bottom:10px;">${source} dynamic copilot</div>
      <div style="font-size:34px;font-weight:900;color:#38bdf8;">${match.match_score || 0}%</div>
      <button id="ai-copilot-fill" style="margin-top:10px;width:100%;padding:10px;border:0;border-radius:8px;background:#38bdf8;font-weight:800;cursor:pointer;">AI Fill Questions</button>
      <div id="ai-copilot-status" style="margin-top:8px;color:#cbd5e1;font-size:11px;">${(match.matched_skills || []).slice(0, 5).join(", ")}</div>
    `;
    document.getElementById("ai-copilot-fill").onclick = onFill;
  }

  async function run({ source, getJobData, clickApply }) {
    const job = getJobData();
    const match = await sendMessage({ type: "MATCH_JOB", data: job });
    if (!match || match.error) {
      console.warn("AI Job Copilot match failed", match?.error);
      return;
    }

    injectPanel(source, match, async () => {
      const status = document.getElementById("ai-copilot-status");
      if (status) status.textContent = "Opening form and reading questions...";
      if (clickApply) clickApply();
      await new Promise((resolve) => setTimeout(resolve, 1600));

      const fields = window.AIJobCopilotFormParser.parseFields();
      const response = await sendMessage({
        type: "COPILOT_ANSWERS",
        data: { source, job: getJobData(), fields: fields.map((field) => field.payload) }
      });

      if (!response || response.error) {
        if (status) status.textContent = response?.error || "Could not generate answers.";
        return;
      }

      const filled = window.AIJobCopilotFormFiller.fill(fields, response.answers || []);
      await sendMessage({
        type: "APPLY_JOB",
        data: { ...getJobData(), status: "copilot_filled", answers: { filled, answers: response.answers || [] } }
      });
      if (status) status.textContent = `Filled ${filled} fields. Review before submit.`;
      alert(`AI Job Copilot filled ${filled} fields/questions. Please review before submitting.`);
    });
  }

  return { run };
})();
