def invoice_summary(customer_id: str, plan: str, amount: int) -> dict:
    return {"customer_id": customer_id, "plan": plan, "amount_cents": amount, "currency": "usd"}
