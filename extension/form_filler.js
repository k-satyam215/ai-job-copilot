window.AIJobCopilotFormFiller = (() => {
  function setNativeValue(element, value) {
    const prototype = element.tagName === "TEXTAREA" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
    if (setter) setter.call(element, value);
    else element.value = value;
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function chooseOption(element, answer) {
    const value = String(answer || "").toLowerCase();
    if (element.tagName === "SELECT") {
      const option = Array.from(element.options).find((item) => item.textContent.toLowerCase().includes(value) || item.value.toLowerCase() === value);
      if (option) {
        element.value = option.value;
        element.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }
    }

    if (element.type === "radio" || element.type === "checkbox") {
      const group = element.closest("fieldset, div, section, li") || document;
      const choices = Array.from(group.querySelectorAll('input[type="radio"], input[type="checkbox"]'));
      const target = choices.find((choice) => {
        const label = choice.closest("label")?.innerText || choice.getAttribute("aria-label") || choice.value || "";
        return label.toLowerCase().includes(value) || choice.value.toLowerCase() === value;
      }) || choices[0];
      if (target) {
        target.click();
        return true;
      }
    }
    return false;
  }

  function fill(fields, answers) {
    const answerMap = new Map((answers || []).map((item) => [item.field_id, item.answer]));
    let filled = 0;
    fields.forEach(({ element, payload }) => {
      const answer = answerMap.get(payload.field_id);
      if (!answer) return;
      if (["radio", "checkbox", "select"].includes(payload.field_type)) {
        if (chooseOption(element, answer)) filled += 1;
        return;
      }
      if (!element.value || payload.field_type === "textarea") {
        setNativeValue(element, String(answer));
        filled += 1;
      }
    });
    return filled;
  }

  return { fill };
})();
