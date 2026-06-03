def update_policy(reward: float) -> dict:
    return {"policy_update": "increase" if reward > 0 else "decrease", "reward": reward}
