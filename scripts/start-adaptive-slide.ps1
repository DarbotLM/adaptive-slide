param(
  [int]$Port = 3001,
  [int]$MaxPortAttempts = 20,
  [switch]$NoBuild
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$serverPath = Join-Path $projectRoot "dist\plugins\mcp-app\server.js"
$logRoot = Join-Path $env:TEMP "adaptive-slide"
$stdoutLog = Join-Path $logRoot "server.stdout.log"
$stderrLog = Join-Path $logRoot "server.stderr.log"

New-Item -ItemType Directory -Force -Path $logRoot | Out-Null
Set-Location $projectRoot

function Test-AdaptiveSlideMcp {
  param([int]$TestPort)

  $initializeBody = @{
    jsonrpc = "2.0"
    id = 1
    method = "initialize"
    params = @{
      protocolVersion = "2024-11-05"
      capabilities = @{}
      clientInfo = @{
        name = "adaptive-slide-start-script"
        version = "1.0.0"
      }
    }
  } | ConvertTo-Json -Depth 10

  try {
    $response = Invoke-RestMethod `
      -Method Post `
      -Uri "http://localhost:$TestPort/mcp" `
      -Headers @{ Accept = "application/json, text/event-stream" } `
      -ContentType "application/json" `
      -Body $initializeBody `
      -TimeoutSec 3

    return $response.result.serverInfo.name -eq "Adaptive Slide"
  } catch {
    return $false
  }
}

if (-not (Test-Path (Join-Path $projectRoot "node_modules"))) {
  npm install
}

if (-not $NoBuild -or -not (Test-Path $serverPath)) {
  npm run build
}

$selectedPort = $null
for ($candidatePort = $Port; $candidatePort -lt ($Port + $MaxPortAttempts); $candidatePort++) {
  $listener = Get-NetTCPConnection -LocalPort $candidatePort -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
  if (-not $listener) {
    $selectedPort = $candidatePort
    break
  }

  if (Test-AdaptiveSlideMcp -TestPort $candidatePort) {
    Write-Host "Adaptive Slide MCP server is already running at http://localhost:$candidatePort/mcp (PID $($listener.OwningProcess))."
    exit 0
  }

  Write-Host "Port $candidatePort is in use by PID $($listener.OwningProcess); trying port $($candidatePort + 1)."
}

if (-not $selectedPort) {
  throw "No available port found from $Port through $($Port + $MaxPortAttempts - 1)."
}

$env:PORT = [string]$selectedPort
$process = Start-Process `
  -FilePath "node" `
  -ArgumentList @($serverPath) `
  -WorkingDirectory $projectRoot `
  -RedirectStandardOutput $stdoutLog `
  -RedirectStandardError $stderrLog `
  -PassThru

$deadline = (Get-Date).AddSeconds(30)
do {
  if ($process.HasExited) {
    throw "Adaptive Slide server exited early with code $($process.ExitCode). See $stderrLog"
  }

  if (Test-AdaptiveSlideMcp -TestPort $selectedPort) {
    Write-Host "Adaptive Slide MCP server started at http://localhost:$selectedPort/mcp (PID $($process.Id))."
    Write-Host "Logs: $stdoutLog"
    exit 0
  }

  Start-Sleep -Milliseconds 500
} while ((Get-Date) -lt $deadline)

throw "Timed out waiting for Adaptive Slide MCP server at http://localhost:$selectedPort/mcp. See $stderrLog"
