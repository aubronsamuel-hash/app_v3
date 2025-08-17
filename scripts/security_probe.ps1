param(
    [string]$BaseUrl = "http://localhost:8000"
)

function Check-Headers {
    param([string]$Url)
    $headers = curl -s -D - -o /dev/null $Url
    if ($headers -match 'Content-Security-Policy' -and $headers -match 'Strict-Transport-Security' -and $headers -match 'Access-Control-Allow-Origin') {
        Write-Output "Headers OK"
    } else {
        Write-Output "Missing security headers"
        exit 1
    }
}

function Check-LargeUpload {
    param([string]$Url)
    $temp = New-TemporaryFile
    $bytes = New-Object Byte[] (6MB)
    [System.Random]::new().NextBytes($bytes)
    [System.IO.File]::WriteAllBytes($temp, $bytes)
    $status = curl -s -o /dev/null -w "%{http_code}" -X POST --data-binary @$temp $Url
    Remove-Item $temp
    if ($status -eq 413) {
        Write-Output "Large upload rejected with 413"
    } else {
        Write-Output "Unexpected status: $status"
        exit 1
    }
}

Check-Headers $BaseUrl
Check-LargeUpload $BaseUrl
