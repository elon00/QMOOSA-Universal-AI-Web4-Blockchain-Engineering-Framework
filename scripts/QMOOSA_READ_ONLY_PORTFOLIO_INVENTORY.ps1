# QMOOSA inventory only. PowerShell 5.1 compatible. No repo edits, deployment, or expenditure.
[CmdletBinding()]
param(
  [string]$Owner = 'elon00',
  [int]$Limit = 10000,
  [string]$OutputDirectory = (Join-Path $env:USERPROFILE 'Downloads\QMOOSA_PORTFOLIO_AUDIT')
)
$ErrorActionPreference = 'Stop'
if ($Owner -ne 'elon00') { throw 'Only the approved elon00 owner may be inventoried.' }
if ($Limit -lt 3423) { throw 'Limit is below the 3423-project user target; inventory could be truncated.' }
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw 'GitHub CLI (gh) is missing.' }
New-Item -ItemType Directory -Force -Path $OutputDirectory | Out-Null

Write-Host 'Collecting GitHub-owned repository metadata, read-only...'
$raw = & gh repo list $Owner --limit $Limit --json 'nameWithOwner,isFork,isArchived,primaryLanguage,url' 2>&1
if ($LASTEXITCODE -ne 0) {
  throw ('GitHub inventory failed; no files changed. ' + ($raw | Out-String))
}
if (-not $raw) { throw 'Empty GitHub CLI response; not treating this as zero repositories.' }
$records = @($raw | ConvertFrom-Json)

$rows = @(
  foreach ($r in $records) {
    if (-not $r.nameWithOwner -or $r.nameWithOwner -notmatch '^elon00/') {
      throw 'Unexpected repository owner in GitHub response.'
    }
    [pscustomobject]@{
      Repository = [string]$r.nameWithOwner
      URL = [string]$r.url
      IsFork = [bool]$r.isFork
      IsArchived = [bool]$r.isArchived
      PrimaryLanguage = $(if ($r.primaryLanguage -and $r.primaryLanguage.name) { [string]$r.primaryLanguage.name } else { 'UNKNOWN' })
      ChainFamily = 'UNASSESSED'
      NativeAdapter = 'NOT_VERIFIED'
      TechnologyIntegration = 'NOT_VERIFIED'
      LocalTests = 'NOT_RUN'
      CI = 'NOT_VERIFIED'
      Testnet = 'NOT_VERIFIED'
      Mainnet = 'LOCKED'
      ProductionCertified = $false
    }
  }
)

if ($rows.Count -ne $records.Count) { throw 'Inventory row count mismatch.' }
$csv = Join-Path $OutputDirectory 'QMOOSA_REPOSITORY_INVENTORY.csv'
$json = Join-Path $OutputDirectory 'QMOOSA_REPOSITORY_INVENTORY.json'
$rows | Sort-Object Repository | Export-Csv -LiteralPath $csv -NoTypeInformation -Encoding UTF8
$rows | Sort-Object Repository | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $json -Encoding UTF8

$originals = @($rows | Where-Object { -not $_.IsFork }).Count
$forks = @($rows | Where-Object { $_.IsFork }).Count
$archives = @($rows | Where-Object { $_.IsArchived }).Count
Write-Host ('Repositories returned: ' + $rows.Count)
Write-Host ('Owned originals (not forks): ' + $originals)
Write-Host ('Forks: ' + $forks + '; archived (overlapping): ' + $archives)
if ($rows.Count -eq $Limit) {
  Write-Warning 'Results equal --limit; increase the limit and rerun to exclude truncation.'
}
if ($rows.Count -ne 3423) {
  Write-Warning ('User-supplied 3423 target differs from current accessible repository count: ' + $rows.Count + '. Reconcile before batch updates.')
}
Write-Host ('Read-only audit exported: ' + $csv)
Write-Host ('Structured manifest: ' + $json)
Write-Host 'No repositories modified, no deployments, and no technology certifications performed.'
