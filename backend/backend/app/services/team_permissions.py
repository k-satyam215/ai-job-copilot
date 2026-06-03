ROLE_PERMISSIONS = {
    "owner": ["admin", "billing", "apply", "view"],
    "admin": ["apply", "view"],
    "member": ["view"],
}


def permissions_for(role: str) -> list[str]:
    return ROLE_PERMISSIONS.get(role, ROLE_PERMISSIONS["member"])
