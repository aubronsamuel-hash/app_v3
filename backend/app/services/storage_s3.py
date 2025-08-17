async def save_file(path: str, data: bytes) -> str:
    with open(path, "wb") as f:
        f.write(data)
    return path
