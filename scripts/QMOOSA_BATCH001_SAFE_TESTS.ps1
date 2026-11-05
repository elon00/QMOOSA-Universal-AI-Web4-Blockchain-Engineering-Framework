#Requires -Version 5.1
<#
QMOOSA Batch 001 Windows PowerShell 5.1 controlled test runner.
Reads existing BATCH_001.csv; clones only missing repos; runs allowlisted tests.
No deploy, wallet, merge, certificate, or mainnet commands are dispatched.
Repository test scripts themselves may access networks. Do not supply private keys.
#>
[CmdletBinding()]
param(
    [string]$Root = (Join-Path $env:USERPROFILE 'Downloads\QMOOSA_MASTER'),
    [switch]$OnlyFailed
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$manifest = Join-Path $Root 'BATCH_001.csv'
if (-not (Test-Path -LiteralPath $manifest)) { throw "Cannot find $manifest" }
$batch = @(Import-Csv -LiteralPath $manifest)
if ($batch.Count -ne 10) { throw "Expected 10 repositories; got $($batch.Count)" }
$src = Join-Path $Root 'BATCH001_LOCAL'
$logs = Join-Path $Root 'TEST_LOGS'
New-Item -ItemType Directory -Force -Path $Root,$src,$logs | Out-Null

$plans = @{
 'QARBI' = @('npm run typecheck','npm run test:nist','npm run test:x402','npm run compile:contracts')
 'solana-ai' = @('npm run test:nist','npm run test:x402','cargo fmt --manifest-path program/Cargo.toml -- --check','cargo test --manifest-path program/Cargo.toml --locked')
 'shor-x402' = @('npm run test','npm run lint')
 'QSui' = @('npm run typecheck','npm run test:nist')
 'Qmoosa-ICP-Multichain' = @('npm test')
 'Qmoosa-Agentic-Hub' = @('npm run test:pqc','npm run test:x402')
 'qmoosa-mezo' = @('npm run test:lane1','npm run test:lane2')
 'qmoosa-starknet-zk-research' = @('python -m unittest discover tests -v')
 'qmoosa-omni-equality' = @('python -m pytest -q')
 'Qmoosa-RustChain' = @('cargo fmt --all -- --check','cargo test --workspace')
}
foreach ($row in $batch) {
 if ($row.Repository -notmatch '^elon00/([A-Za-z0-9._-]+)$') { throw "Invalid repository: $($row.Repository)" }
 $n = $Matches[1]
 if (-not $plans.ContainsKey($n)) { throw "Unknown test plan: $n" }
}
if (@($batch | Select-Object -ExpandProperty Repository -Unique).Count -ne 10) { throw 'Duplicate repositories in batch' }

$results = New-Object System.Collections.ArrayList
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$report = Join-Path $Root "BATCH_001_REAL_TEST_RESULTS_$stamp.csv"
function Save-Result {
 param([string]$Repo,[string]$Cmd,[string]$Status,[int]$Code,[string]$Label,[string]$Commit)
 [void]$results.Add([pscustomobject]@{ Repository=$Repo; Commit=$Commit; Check=$Cmd; Result=$Status; ExitCode=$Code; StdoutLog="$Label.stdout.log"; StderrLog="$Label.stderr.log"; Mainnet='LOCKED' })
 $results | Export-Csv -LiteralPath $report -NoTypeInformation -Encoding UTF8
 Write-Host "  $Status : $Cmd"
}
function Run-Logged {
 param([string]$Cmd,[string]$Work,[string]$Label)
 $stdout = Join-Path $logs "$Label.stdout.log"
 $stderr = Join-Path $logs "$Label.stderr.log"
 $runner = Join-Path $logs "$Label.runner.cmd"
 Set-Content -LiteralPath $runner -Encoding ASCII -Value @('@echo off',$Cmd)
 try {
  $arg = @('/d','/c',('"{0}"' -f $runner))
  $proc = Start-Process -FilePath $env:ComSpec -ArgumentList $arg -WorkingDirectory $Work -Wait -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr -NoNewWindow
  return [int]$proc.ExitCode
 }
 catch {
  ($_ | Out-String) | Set-Content -LiteralPath $stderr -Encoding UTF8
  return 900
 }
}
Write-Host '=== QMOOSA BATCH 001 REAL TESTS ===' -ForegroundColor Cyan
if ($OnlyFailed) {
 Write-Host 'Targeted rerun: Agentic Hub and RustChain only' -ForegroundColor Yellow
 $batch = @($batch | Where-Object { $_.Repository -in @('elon00/Qmoosa-Agentic-Hub','elon00/Qmoosa-RustChain') })
 if ($batch.Count -ne 2) { throw 'Targeted rerun requires both named repositories in the batch manifest' }
}
foreach ($row in $batch) {
 $repo = [string]$row.Repository
 $name = ($repo -split '/')[1]
 $dir = Join-Path $src $name
 $commit = 'UNKNOWN'
 Write-Host "REPOSITORY $repo" -ForegroundColor Yellow
 if (-not (Test-Path -LiteralPath (Join-Path $dir '.git'))) {
  if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
   Save-Result $repo 'CLONE' 'BLOCKED' 900 "$name-clone" $commit
   continue
  }
  $cmd = 'gh repo clone {0} "{1}" -- --depth 1' -f $repo,$dir
  $exitCode = Run-Logged $cmd $src "$name-clone"
  if ($exitCode -ne 0) {
   Save-Result $repo 'CLONE' 'BLOCKED' $exitCode "$name-clone" $commit
   continue
  }
 }
 if (Get-Command git -ErrorAction SilentlyContinue) {
  $hash = & git -C $dir rev-parse HEAD
  if ($LASTEXITCODE -eq 0 -and $hash) { $commit = ($hash | Select-Object -First 1).ToString() }
 }
 $commands = @($plans[$name])
 $npmCommands = @($commands | Where-Object { $_ -like 'npm *' })
 $npmReady = $true
 if ($npmCommands.Count -gt 0) {
  $npmReady = $false
  if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
   Save-Result $repo 'npm ci' 'SKIPPED' 900 "$name-npm-ci" $commit
  }
  elseif (-not (Test-Path -LiteralPath (Join-Path $dir 'package-lock.json'))) {
   Save-Result $repo 'npm ci' 'SKIPPED' 901 "$name-npm-ci" $commit
  }
  else {
   $install = if ($name -eq 'Qmoosa-Agentic-Hub') { 'npm ci --legacy-peer-deps --ignore-scripts --no-audit --no-fund' } else { 'npm ci --ignore-scripts --no-audit --no-fund' }
   $exitCode = Run-Logged $install $dir "$name-npm-ci"
   $npmReady = ($exitCode -eq 0)
   $status = if ($npmReady) { 'PASS' } else { 'FAIL' }
   Save-Result $repo 'npm ci' $status $exitCode "$name-npm-ci" $commit
  }
 }
 foreach ($cmd in $commands) {
  $exe = ($cmd -split ' ')[0]
  $label = "$name-" + ($cmd -replace '[^a-zA-Z0-9]','_')
  if ((-not (Get-Command $exe -ErrorAction SilentlyContinue)) -or ($exe -eq 'npm' -and -not $npmReady)) {
   Save-Result $repo $cmd 'SKIPPED' 902 $label $commit
   continue
  }
  $exitCode = Run-Logged $cmd $dir $label
  $status = if ($exitCode -eq 0) { 'PASS' } else { 'FAIL' }
  Save-Result $repo $cmd $status $exitCode $label $commit
 }
}
Write-Host '=== FINAL BATCH RESULTS ===' -ForegroundColor Cyan
$results | Group-Object Result | Select-Object Name,Count | Format-Table -AutoSize
Write-Host "REPORT: $report" -ForegroundColor Green
Write-Host "LOGS: $logs"
Write-Host 'No deployment, PR merge or production certification performed.'
$incomplete = @($results | Where-Object { $_.Result -ne 'PASS' })
if ($incomplete.Count -gt 0) {
 Write-Warning "$($incomplete.Count) failing, skipped or blocked checks; readiness NOT certified."
 exit 2
}
Write-Host 'Selected local checks exited successfully. On-chain and production evidence remains separate.'
