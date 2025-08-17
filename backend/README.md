# Backend

FastAPI backend for Coulisses Crew Ultra V2.

## Development

```bash
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8001
```

## Testing

```bash
pytest -q
```
