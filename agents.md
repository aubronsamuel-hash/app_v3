Cree router auth.py:
- POST /auth/register: username, password -> cree user, role=intermittent.
- POST /auth/token-json: JSON {username,password} -> retourne {access_token} (non JWT).
- GET /auth/me: retourne profil courant.
- PUT /auth/me/prefs: maj notification prefs (email?, telegram?, telegram_chat_id?).
- POST /auth/me/notify-test: si prefs actifs, log/return un objet simulant envoi (dry-run).
Gestion erreurs en FR (ASCII sans accents) et HTTP codes corrects.
