# Example PowerShell calls to the API
$token = (Invoke-RestMethod -Method Post -Uri "http://localhost:8001/auth/token" -Body @{username='admin';password='admin'}).access_token
Invoke-RestMethod -Headers @{Authorization="Bearer $token"} -Uri "http://localhost:8001/missions/"
