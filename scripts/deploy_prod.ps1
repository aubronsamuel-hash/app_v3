param(
    [Parameter(Mandatory=$true)][string]$Registry,
    [Parameter(Mandatory=$true)][string]$Username,
    [Parameter(Mandatory=$true)][string]$Password,
    [Parameter(Mandatory=$true)][string]$EnvFilePath
)

docker login $Registry -u $Username -p $Password

docker compose --env-file $EnvFilePath -f compose.prod.yaml pull

docker compose --env-file $EnvFilePath -f compose.prod.yaml up -d
