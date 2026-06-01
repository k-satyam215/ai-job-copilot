def organization_payload(name: str, owner_id: int) -> dict:
    return {"name": name, "owner_id": owner_id, "members": [owner_id], "plan": "enterprise"}
