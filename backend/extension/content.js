console.log("AI Job Copilot LinkedIn script loaded");

function text(selector) {
  return document.querySelector(selector)?.innerText?.trim() || "";
}

function getLinkedInJobData() {
  const skillText = text(".jobs-description__content, .jobs-box__html-content");
  const skills = skillText
    .split(/[,|•\n]/)
    .map((value) => value.trim())
    .filter((value) => value.length > 2 && value.length < 42)
    .slice(0, 24);

  return {
    source: "linkedin",
    title: text(".job-details-jobs-unified-top-card__job-title, h1") || document.title,
    company: text(".job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name") || "Unknown Company",
    location: text(".job-details-jobs-unified-top-card__primary-description-container, .jobs-unified-top-card__bullet"),
    url: location.href,
    description: skillText,
    skills
  };
}

function clickEasyApply() {
  const buttons = Array.from(document.querySelectorAll("button"));
  const easyApply = buttons.find((btn) => /easy apply|apply/i.test(btn.innerText || ""));
  if (easyApply) {
    easyApply.click();
    return true;
  }
  return false;
}

setTimeout(() => {
  window.AIJobCopilotEngine.run({
    source: "linkedin",
    getJobData: getLinkedInJobData,
    clickApply: clickEasyApply
  });
}, 2200);
