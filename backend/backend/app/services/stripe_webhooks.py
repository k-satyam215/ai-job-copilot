def process_stripe_event(event: dict) -> dict:
    event_type = event.get("type", "")
    data = event.get("data", {}).get("object", {})
    if event_type == "checkout.session.completed":
        return {"action": "activate_subscription", "customer": data.get("customer"), "plan": data.get("metadata", {}).get("plan", "pro")}
    if event_type == "invoice.payment_failed":
        return {"action": "mark_payment_failed", "customer": data.get("customer")}
    return {"action": "ignored", "event_type": event_type}
