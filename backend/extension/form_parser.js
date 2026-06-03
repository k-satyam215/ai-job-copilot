window.AIJobCopilotFormParser = (() => {
  function visible(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
  }

  function fieldType(element) {
    if (element.tagName === "TEXTAREA") return "textarea";
    if (element.tagName === "SELECT") return "select";
    return element.getAttribute("type") || "text";
  }

  function labelFor(element) {
    const id = element.id;
    const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`)?.innerText : "";
    const aria = element.getAttribute("aria-label") || element.getAttribute("aria-labelledby") || "";
    const parent = element.closest("label")?.innerText || "";
    const block = element.closest("div, section, li")?.innerText || "";
    return [label, aria, parent, block, element.placeholder, element.name, element.id]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 500);
  }

  function optionsFor(element) {
    if (element.tagName === "SELECT") {
      return Array.from(element.options).map((option) => option.textContent.trim()).filter(Boolean);
    }
    const group = element.closest("fieldset, div, section, li");
    if (!group) return [];
    return Array.from(group.querySelectorAll('input[type="radio"], input[type="checkbox"]'))
      .map((input) => input.closest("label")?.innerText || input.getAttribute("aria-label") || input.value)
      .filter(Boolean)
      .slice(0, 12);
  }

  function parseFields() {
    const selector = [
      "input:not([type=hidden]):not([type=file]):not([disabled])",
      "textarea:not([disabled])",
      "select:not([disabled])"
    ].join(",");

    return Array.from(document.querySelectorAll(selector))
      .filter(visible)
      .map((element, index) => {
        if (!element.dataset.aiJobCopilotFieldId) {
          element.dataset.aiJobCopilotFieldId = `field_${Date.now()}_${index}`;
        }
        const label = labelFor(element);
        return {
          element,
          payload: {
            field_id: element.dataset.aiJobCopilotFieldId,
            field_type: fieldType(element),
            label,
            name: element.name || "",
            placeholder: element.placeholder || "",
            question: label,
            options: optionsFor(element)
          }
        };
      });
  }

  return { parseFields };
})();
