GRAPH = {
    "observe": ["understand"],
    "understand": ["plan"],
    "plan": ["execute", "pause"],
    "execute": ["verify"],
    "verify": ["recover", "review"],
    "recover": ["observe", "pause"],
    "review": ["complete"],
}


def next_states(state: str) -> list[str]:
    return GRAPH.get(state, [])
