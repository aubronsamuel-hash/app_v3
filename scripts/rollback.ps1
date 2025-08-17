param(
    [Parameter(Mandatory=$true)][string]$EnvFilePath,
    [string]$ApiTag,
    [string]$FrontTag
)

if ($ApiTag) { $env:API_TAG = $ApiTag }
if ($FrontTag) { $env:FRONT_TAG = $FrontTag }

docker compose --env-file $EnvFilePath -f compose.prod.yaml down
docker compose --env-file $EnvFilePath -f compose.prod.yaml up -d
