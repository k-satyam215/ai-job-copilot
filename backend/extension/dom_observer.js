window.AIJobCopilotDomObserver = (() => {
  function observe() {
    const fields = window.AIJobCopilotFormParser?.parseFields?.() || [];
    const buttons = Array.from(document.querySelectorAll("button")).map((button) => (button.innerText || "").toLowerCase());
    return {
      url: location.href,
      title: document.title,
      fields: fields.map((field) => field.payload),
      has_next_button: buttons.some((text) => text.includes("next") || text.includes("continue")),
      has_submit_button: buttons.some((text) => text.includes("submit") || text.includes("send application")),
      captcha_detected: /captcha|verify you are human|unusual activity|security check/i.test(document.body.innerText),
      validation_errors: Array.from(document.querySelectorAll('[role="alert"], .error, .invalid')).map((node) => node.innerText).filter(Boolean).slice(0, 8)
    };
  }
  return { observe };
})();
