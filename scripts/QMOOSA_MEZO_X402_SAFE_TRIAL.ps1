#Requires -Version 5.1
<#
Safe QMOOSA MEZO x402 dependency compatibility trial.
Does not remove @x402/paywall, use npm --force, deploy, push, or spend funds.
Clones a new trial from elon00/qmoosa-mezo at the same commit as the
previous local repair, imports only the repaired package-lock.json,
tries same-major x402 updates, runs real tests, and records audit evidence.
Repo tests can access testnet RPC. Do not run with wallet secrets.
#>
[CmdletBinding()]
param(
 [string]$Root = (Join-Path $env:USERPROFILE 'Downloads\QMOOSA_MASTER'),
 [switch]$PreflightOnly
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$source = Join-Path $Root 'SECURITY_REPAIR\qmoosa-mezo'
$sourcePkg = Join-Path $source 'package.json'
$sourceLock = Join-Path $source 'package-lock.json'
foreach($path in @($sourcePkg,$sourceLock,(Join-Path $source '.git'))) {
 if(-not(Test-Path -LiteralPath $path)) {throw "Missing original repair source: $path"}
}
if ($PreflightOnly) {
 Write-Host 'MEZO SAFE UPGRADE PREFLIGHT PASS - no files changed' -ForegroundColor Green
 exit 0
}
foreach($command in @('git','gh','npm','node')) {
 if(-not(Get-Command $command -ErrorAction SilentlyContinue)) {
  throw "Required executable is unavailable: $command"
 }
}
$base=Join-Path $Root 'SECURITY_REPAIR'
$stamp=Get-Date -Format 'yyyyMMdd-HHmmss'
$trial=Join-Path $base "qmoosa-mezo-X402-TRIAL-$stamp"
$logs=Join-Path $base "MEZO_X402_TRIAL_LOGS_$stamp"
New-Item -ItemType Directory -Force -Path $base,$logs | Out-Null
$records=New-Object System.Collections.ArrayList
function Run-Safe {
 param([string]$Name,[string]$Command,[string]$Folder)
 $label=($Name -replace '[^A-Za-z0-9_-]','_')
 $stdout=Join-Path $logs "$label.stdout.log"
 $stderr=Join-Path $logs "$label.stderr.log"
 $runner=Join-Path $logs "$label.cmd"
 Set-Content -LiteralPath $runner -Encoding ASCII -Value @('@echo off',$Command)
 $exit=900
 try {
  $args=@('/d','/c',('"{0}"' -f $runner))
  $p=Start-Process -FilePath $env:ComSpec -ArgumentList $args -WorkingDirectory $Folder -NoNewWindow -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr
  if($p.WaitForExit(1800000)) {$exit=[int]$p.ExitCode}
  else {
   & taskkill.exe /PID $p.Id /T /F 1>$null 2>$null
   Add-Content -LiteralPath $stderr -Value 'Command timed out.'
   $exit=124
  }
 } catch {($_ | Out-String) | Set-Content -LiteralPath $stderr -Encoding UTF8}
 [void]$records.Add([pscustomobject]@{Step=$Name; ExitCode=$exit; Stdout=$stdout; Stderr=$stderr})
 Write-Host "$Name : EXIT $exit"
 return [pscustomobject]@{Code=$exit;Out=$stdout;Err=$stderr}
}
function Audit-Counts {
 param([string]$File)
 try {
  $j=Get-Content -LiteralPath $File -Raw -ErrorAction Stop | ConvertFrom-Json -ErrorAction Stop
  $v=$j.metadata.vulnerabilities
  if($null -eq $v){throw 'Missing audit metadata'}
  return [pscustomobject]@{Critical=[int]$v.critical;High=[int]$v.high;Moderate=[int]$v.moderate;Low=[int]$v.low}
 } catch {
  return $null
 }
}
Write-Host '=== QMOOSA MEZO SAFE X402 COMPATIBILITY TRIAL ===' -ForegroundColor Cyan
Write-Host 'Independent trial copy; existing repair folder will not be modified.'
$clone=Run-Safe 'clone' ('gh repo clone elon00/qmoosa-mezo "{0}" -- --depth 1' -f $trial) $base
if($clone.Code -ne 0){throw "Clone failed; see $($clone.Err)"}
$refLocal=Run-Safe 'source-commit' ('git -C "{0}" rev-parse HEAD' -f $source) $base
$refRemote=Run-Safe 'trial-commit' ('git -C "{0}" rev-parse HEAD' -f $trial) $base
if($refLocal.Code -ne 0 -or $refRemote.Code -ne 0){throw 'Cannot verify clone and source commits'}
$a=(Get-Content -LiteralPath $refLocal.Out -Raw).Trim()
$b=(Get-Content -LiteralPath $refRemote.Out -Raw).Trim()
if($a -notmatch '^[a-f0-9]{40}$' -or $a -ne $b) {
 throw 'Source checkout and fresh trial differ. Preserve existing repair and inspect the new upstream commit.'
}
$clonePkg=Join-Path $trial 'package.json'
if((Get-FileHash -LiteralPath $sourcePkg -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath $clonePkg -Algorithm SHA256).Hash) {
 throw 'package.json differs between local repair and cloned source; aborting rather than overwriting.'
}
$branch=Run-Safe 'create-local-branch' 'git switch -c security/mezo-x402-compatibility-trial' $trial
if($branch.Code -ne 0){throw 'Cannot isolate trial branch'}
Copy-Item -LiteralPath $sourceLock -Destination (Join-Path $trial 'package-lock.json') -Force
Write-Host "Source commit: $a" -ForegroundColor Cyan
$baseline=Run-Safe 'baseline-audit' 'npm audit --omit=dev --audit-level=high --json' $trial
$before=Audit-Counts $baseline.Out
if($null -eq $before) {throw "Cannot parse baseline audit; see $($baseline.Out)"}
Write-Host "BASELINE: critical=$($before.Critical), high=$($before.High), moderate=$($before.Moderate)"
$updated=Run-Safe 'update-x402-same-major' 'npm update @x402/core @x402/evm @x402/express @x402/paywall --package-lock-only --ignore-scripts --no-audit --no-fund' $trial
$installCode=900
$testResults=@()
$after=$null
if($updated.Code -eq 0) {
 $install=Run-Safe 'npm-clean-install' 'npm ci --ignore-scripts --no-audit --no-fund' $trial
 $installCode=$install.Code
 if($install.Code -eq 0) {
  foreach($item in @(
   @{Name='build';Command='npm run build'},
   @{Name='test-lane1';Command='npm run test:lane1'},
   @{Name='test-lane2';Command='npm run test:lane2'}
  )) {
   $t=Run-Safe $item.Name $item.Command $trial
   $testResults+= $t.Code
  }
 }
 $post=Run-Safe 'updated-audit' 'npm audit --omit=dev --audit-level=high --json' $trial
 $after=Audit-Counts $post.Out
}
$valid=($updated.Code -eq 0 -and $installCode -eq 0 -and $testResults.Count -eq 3 -and @($testResults | Where-Object {$_ -ne 0}).Count -eq 0 -and $null -ne $after)
$improved=$false
if($null -ne $after) {
 $improved=(($after.High+$after.Critical) -lt ($before.High+$before.Critical))
 Write-Host "AFTER: critical=$($after.Critical), high=$($after.High), moderate=$($after.Moderate)"
}
$report=[pscustomobject]@{
 OriginalRepository='elon00/qmoosa-mezo'
 Commit=$a
 TrialFolder=$trial
 Baseline=$before
 After=$after
 UpdatedLockfile=$([bool]($updated.Code -eq 0))
 AllSelectedTestsPassed=$valid
 ReducedHighCritical=$improved
 CandidateRecommendation=$(if($valid -and $improved){'REVIEW_CANDIDATE_ONLY'}else{'BLOCKED_OR_NO_IMPROVEMENT'})
 ProductionCertified=$false
 Mainnet='LOCKED'
 Notes='Do not merge/push without source-level x402 authorization, replay and service fulfillment fixes; testnet receipt and genuine AI integration remain unverified.'
}
$reportPath=Join-Path $logs 'TRIAL_RESULT.json'
$report | ConvertTo-Json -Depth 7 | Set-Content -LiteralPath $reportPath -Encoding UTF8
$records | Export-Csv -LiteralPath (Join-Path $logs 'COMMAND_RESULTS.csv') -NoTypeInformation -Encoding UTF8
Write-Host "TRIAL REPORT: $reportPath" -ForegroundColor Green
Write-Host "TRIAL WORKTREE: $trial"
Write-Host 'NO PUSH / NO DEPLOY / NO MAINNET / NO PRODUCTION CERTIFICATION' -ForegroundColor Yellow
if(-not($valid -and $improved)) {
 Write-Warning 'Security remediation remains incomplete. This trial must not be promoted.'
 exit 2
}
Write-Host 'Safe same-major lockfile candidate created for review; security audit may still be unresolved.' -ForegroundColor Green
exit 0
