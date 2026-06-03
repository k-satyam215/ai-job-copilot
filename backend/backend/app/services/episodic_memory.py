_EPISODES: dict[int, list[dict]] = {}


def add_episode(user_id: int, episode: dict) -> dict:
    _EPISODES.setdefault(user_id, []).append(episode)
    return episode
