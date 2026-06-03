window.AIJobCopilotActionExecutor = (() => {
  function execute(actions, answers) {
    const fields = window.AIJobCopilotFormParser?.parseFields?.() || [];
    const fillActions = actions.filter((action) => ["fill_field", "select_option"].includes(action.type) && action.allowed);
    const filtered = fields.filter((field) => fillActions.some((action) => action.field_id === field.payload.field_id));
    return window.AIJobCopilotFormFiller?.fill?.(filtered, answers) || 0;
  }
  return { execute };
})();
