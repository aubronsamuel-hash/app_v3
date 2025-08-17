Cree missions.py:
- GET /missions avec filtres q,status,date_from,date_to,role,perfect_match,page,per_page.
- POST /missions: creation avec MissionCreateIn -> MissionOut.
- GET /missions/{mid}, PUT /missions/{mid}, DELETE (soft delete) -> 204.

Cree assignments.py:
- POST /missions/{mid}/assign: AssignmentIn {role_label, user_id?, status?} -> AssignmentOut; verifie role_label existe.
- GET /missions/{mid}/assignments, PUT /assignments/{aid}, DELETE /assignments/{aid}.
