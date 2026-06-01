console.log("AI Job Copilot Naukri script loaded");

function read(selector) {
  return document.querySelector(selector)?.innerText?.trim() || "";
}

function getJobData() {
  const skillElements = document.querySelectorAll(".key-skill span, .styles_key-skill__GIPn_ span, .styles_chip__7YCfG");
  return {
    source: "naukri",
    title: read("h1") || document.title || "Unknown Role",
    company: read(".companyInfo span a") || read(".companyInfo") || "Unknown Company",
    location: read(".locWdth") || read(".styles_jhc__location__W_pVs"),
    experience: read(".expwdth") || read(".styles_jhc__exp__k_giM"),
    url: location.href,
    description: read(".job-desc, .styles_JDC__dang-inner-html__h0K4t"),
    skills: Array.from(skillElements).map((el) => el.innerText.trim()).filter(Boolean)
  };
}

function clickApplyButton() {
  const buttons = Array.from(document.querySelectorAll("button"));
  const button = buttons.find((btn) => {
    const text = (btn.innerText || "").toLowerCase();
    return text.includes("apply") && !text.includes("company site");
  });
  if (button) {
    button.click();
    return true;
  }
  return false;
}

setTimeout(() => {
  window.AIJobCopilotEngine.run({
    source: "naukri",
    getJobData,
    clickApply: clickApplyButton
  });
}, 2200);
