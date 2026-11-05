#Requires -Version 5.1
<#
QMOOSA BATCH 001 — UNIVERSAL REALITY SYSTEM (URS)
One run: inventory -> preflight -> selected local checks -> CI -> dependency security
-> source-bound testnet evidence -> fail-closed scores and evidence dossier.
No private keys, wallet signing, mainnet activity, remote writes or PR merging.
The repositories' test scripts can access the internet. Use a non-funded account.
#>
[CmdletBinding()]
param(
 [string]$Root = (Join-Path $env:USERPROFILE 'Downloads\QMOOSA_MASTER'),
 [switch]$PreflightOnly,
 [switch]$EvidenceOnly
)
Set-StrictMode -Version Latest
$ErrorActionPreference='Stop'
$expected=@(
 'elon00/QARBI','elon00/solana-ai','elon00/shor-x402','elon00/QSui',
 'elon00/Qmoosa-ICP-Multichain','elon00/Qmoosa-Agentic-Hub',
 'elon00/qmoosa-mezo','elon00/qmoosa-starknet-zk-research',
 'elon00/qmoosa-omni-equality','elon00/Qmoosa-RustChain'
)
$native=@{
 'QARBI'='EVM/Arbitrum'; 'solana-ai'='Solana'; 'shor-x402'='Algorand';
 'QSui'='Sui'; 'Qmoosa-ICP-Multichain'='ICP'; 'Qmoosa-Agentic-Hub'='Polkadot Hub/EVM';
 'qmoosa-mezo'='Mezo EVM'; 'qmoosa-starknet-zk-research'='Starknet';
 'qmoosa-omni-equality'='Multi-chain/Undetermined'; 'Qmoosa-RustChain'='Polkadot'
}
$dir=Join-Path $Root 'MASTER_URS'
$logs=Join-Path $dir 'LOGS'
$evdir=Join-Path $Root 'CHAIN_EVIDENCE'
$srcdir=Join-Path $Root 'BATCH001_LOCAL'
New-Item -ItemType Directory -Force -Path $Root,$dir,$logs,$evdir | Out-Null
$inventory=Join-Path $Root 'BATCH_001.csv'
if (-not (Test-Path -LiteralPath $inventory)) {
 $expected | ForEach-Object { [pscustomobject]@{Repository=$_} } | Export-Csv -LiteralPath $inventory -NoTypeInformation -Encoding UTF8
 Write-Host 'Created canonical Batch 001 manifest (10 original projects).' -ForegroundColor Yellow
}
$names=@(Import-Csv -LiteralPath $inventory | ForEach-Object { [string]$_.Repository })
if ($names.Count -ne 10 -or @($names | Sort-Object -Unique).Count -ne 10) { throw 'Inventory must contain exactly 10 distinct repositories.' }
foreach ($n in $names) { if ($expected -cnotcontains $n) { throw "Unexpected repository in inventory: $n" } }
$run=Get-Date -Format 'yyyyMMdd-HHmmss'
$gates=New-Object System.Collections.ArrayList
$notes=New-Object System.Collections.ArrayList
$sourceData=@{}
$localRows=@()
$phase1Report=''
$phase1Exit=900

function Add-Gate {
 param([string]$Repo,[string]$Gate,[int]$Weight,[string]$Status,[string]$Evidence,[string]$Commit)
 if ($Status -notin @('PASS','FAIL','BLOCKED','PENDING','NOT_RUN','STALE')) { throw "Unexpected status $Status" }
 [void]$gates.Add([pscustomobject]@{
  Repository=$Repo; Gate=$Gate; Weight=$Weight; Status=$Status;
  Earned=$(if($Status -eq 'PASS'){$Weight}else{0}); Evidence=$Evidence;
  Commit=$Commit; VerifiedAt=(Get-Date).ToUniversalTime().ToString('o')
 })
}
function Run-Command {
 param([string]$Command,[string]$Work,[string]$Label)
 $outfile=Join-Path $logs "$Label.stdout.log"
 $errfile=Join-Path $logs "$Label.stderr.log"
 $batfile=Join-Path $logs "$Label.command.cmd"
 Set-Content -LiteralPath $batfile -Encoding ASCII -Value @('@echo off',$Command)
 try {
  $args=@('/d','/c',('"{0}"' -f $batfile))
  $proc=Start-Process -FilePath $env:ComSpec -ArgumentList $args -WorkingDirectory $Work -PassThru -Wait -NoNewWindow -RedirectStandardOutput $outfile -RedirectStandardError $errfile
  return [pscustomobject]@{ Code=[int]$proc.ExitCode; Out=$outfile; Err=$errfile }
 } catch {
  ($_ | Out-String) | Set-Content -LiteralPath $errfile -Encoding UTF8
  return [pscustomobject]@{ Code=900; Out=$outfile; Err=$errfile }
 }
}
function Read-Json {
 param([string]$Path)
 if(-not(Test-Path -LiteralPath $Path)){return $null}
 try{return (Get-Content -LiteralPath $Path -Raw | ConvertFrom-Json)}catch{return $null}
}
function Rpc-Call {
 param([string]$Endpoint,[string]$Method,[object[]]$Params)
 $body=@{jsonrpc='2.0';id=1;method=$Method;params=$Params}|ConvertTo-Json -Depth 15 -Compress
 $result=Invoke-RestMethod -Uri $Endpoint -Method Post -ContentType 'application/json' -Body $body -TimeoutSec 25 -ErrorAction Stop
 if($null -ne $result.error){throw "JSON-RPC returned an error for $Method"}
 if($null -eq $result.result){throw "Missing JSON-RPC result for $Method"}
 return $result.result
}
function Check-EvmTestnetReceipt {
 param([object]$Manifest)
 # Strictly fixed public testnet RPC. No user-provided endpoints, secrets or mainnet IDs.
 if ([string]$Manifest.network -ne 'arbitrum-sepolia' -or [string]$Manifest.chainId -ne '421614') {
  return 'BLOCKED: Only Arbitrum Sepolia (421614) receipt adapter is supported in this release.'
 }
 $tx=[string]$Manifest.transactionHash
 if($tx -cnotmatch '^0x[a-fA-F0-9]{64}$') {return 'BLOCKED: invalid or missing transaction hash'}
 $url='https://sepolia-rollup.arbitrum.io/rpc'
 try {
  $chain=Rpc-Call $url 'eth_chainId' @()
  if ([Convert]::ToInt64(([string]$chain).Substring(2),16) -ne 421614) {return 'FAIL: RPC chain ID mismatch'}
  $receipt=Rpc-Call $url 'eth_getTransactionReceipt' @($tx)
  if ([string]$receipt.transactionHash -ine $tx) {return 'FAIL: mismatched receipt hash'}
  if ([string]$receipt.status -ne '0x1') {return 'FAIL: transaction reverted or unsuccessful'}
  if (-not $receipt.blockNumber -or -not $receipt.blockHash) {return 'BLOCKED: receipt not included in a block'}
  $block=Rpc-Call $url 'eth_getBlockByNumber' @([string]$receipt.blockNumber,$false)
  if ([string]$block.hash -ine [string]$receipt.blockHash) {return 'FAIL: receipt not in canonical queried block'}
  $tip=Rpc-Call $url 'eth_blockNumber' @()
  $height=[Convert]::ToInt64(([string]$tip).Substring(2),16)
  $included=[Convert]::ToInt64(([string]$receipt.blockNumber).Substring(2),16)
  if(($height - $included + 1) -lt 12){return 'PENDING: fewer than 12 L2 block confirmations'}
  $address=[string]$Manifest.contractAddress
  if (-not [string]::IsNullOrWhiteSpace($address)) {
   if($address -cnotmatch '^0x[a-fA-F0-9]{40}$'){return 'BLOCKED: malformed contract address'}
   if ([string]$receipt.contractAddress -ine $address) {return 'BLOCKED: receipt is not a matching contract-creation transaction'}
   $bytecode=Rpc-Call $url 'eth_getCode' @($address,'latest')
   if([string]$bytecode -eq '0x'){return 'FAIL: contract has no deployed bytecode'}
  }
  return "PASS: confirmed successful testnet transaction at block $included (12+ L2 confirmations). Not proof of payment, program correctness or Ethereum L1 finality."
 } catch {
  return "BLOCKED: RPC request or receipt verification failed ($($_.Exception.GetType().Name))."
 }
}

Write-Host '=== QMOOSA BATCH 001: END-TO-END MASTER URS ===' -ForegroundColor Cyan
Write-Host 'Scope: ten original repos | Testnets: read-only | Mainnet: LOCKED'
foreach($repo in $expected) {
 $name=($repo -split '/')[1]
 $file=Join-Path $evdir "$name.json"
 if(-not(Test-Path -LiteralPath $file)) {
  $template=[ordered]@{
   repository=$repo; family='UNSET'; network=''; chainId='';
   transactionHash=''; contractAddress=''; expectedCommit='';
   notes='Use genuine PUBLIC testnet evidence only; no API keys or wallet secrets. Supported automatic receipt adapter: EVM Arbitrum Sepolia.'
  }
  $template | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $file -Encoding UTF8
 }
}
if ($PreflightOnly) {
 Write-Host 'PREFLIGHT PASS: canonical repository manifest and ten evidence templates validated.' -ForegroundColor Green
 Write-Host "ROOT: $Root"
 Write-Host 'No network, deployment, installation, or test commands executed.'
 exit 0
}

$haveGH=[bool](Get-Command gh -ErrorAction SilentlyContinue)
$haveGit=[bool](Get-Command git -ErrorAction SilentlyContinue)
$havePS=[bool](Get-Command powershell.exe -ErrorAction SilentlyContinue)
if(-not $haveGH){[void]$notes.Add('BLOCKER: GitHub CLI gh missing or unavailable')}
if(-not $haveGit){[void]$notes.Add('BLOCKER: Git missing or unavailable')}
if(-not $havePS){[void]$notes.Add('BLOCKER: Windows PowerShell executable unavailable')}

# Phase 1: run the previously Windows-CI-validated project test controller.
if(-not $EvidenceOnly -and $havePS) {
 Write-Host 'PHASE 1: selected real tests, pinned original runner' -ForegroundColor Cyan
 $p1=Join-Path $dir 'QMOOSA_BATCH001_SAFE_TESTS_PINNED.ps1'
 $fixedUrl='https://raw.githubusercontent.com/elon00/QMOOSA-Universal-AI-Web4-Blockchain-Engineering-Framework/87d3ad532d70e83c422c770d0288a9c1e7277976/scripts/QMOOSA_BATCH001_SAFE_TESTS.ps1'
 $started=Get-Date
 try {
  Invoke-WebRequest -UseBasicParsing -Uri $fixedUrl -OutFile $p1 -TimeoutSec 45
  $stdout=Join-Path $logs 'phase1.stdout.log'
  $stderr=Join-Path $logs 'phase1.stderr.log'
  $args=@('-NoProfile','-ExecutionPolicy','Bypass','-File',('"{0}"' -f $p1),'-Root',('"{0}"' -f $Root))
  $p=Start-Process -FilePath 'powershell.exe' -ArgumentList $args -PassThru -Wait -NoNewWindow -RedirectStandardOutput $stdout -RedirectStandardError $stderr
  $phase1Exit=[int]$p.ExitCode
  $matches=@(Get-ChildItem -LiteralPath $Root -Filter 'BATCH_001_REAL_TEST_RESULTS_*.csv' -File | Where-Object {$_.LastWriteTime -ge $started.AddSeconds(-8)} | Sort-Object LastWriteTime -Descending)
  if($matches.Count -gt 0) {
   $phase1Report=$matches[0].FullName
   $localRows=@(Import-Csv -LiteralPath $phase1Report)
  } else { [void]$notes.Add('PHASE1: no fresh results CSV was created') }
 } catch { [void]$notes.Add("PHASE1: controller unavailable: $($_.Exception.Message)") }
} elseif($EvidenceOnly) {
 Write-Host 'PHASE 1: not executed (EvidenceOnly mode)' -ForegroundColor Yellow
 [void]$notes.Add('PHASE1: skipped by EvidenceOnly switch; scores will not credit local tests')
}

# Phase 2: immutable local-commit, remote-commit and latest CI context snapshot.
foreach($repo in $expected) {
 $name=($repo -split '/')[1]
 $localDir=Join-Path $srcdir $name
 $local='UNKNOWN'
 $remote='UNKNOWN'
 $ciStatus='BLOCKED'
 $codeQLStatus='PENDING'
 $ciDetail='GitHub checks unavailable'
 $codeQlDetail='CodeQL security evidence unavailable'
 if($haveGit -and (Test-Path -LiteralPath (Join-Path $localDir '.git'))) {
  $g=Run-Command "git -C ""$localDir"" rev-parse HEAD" $dir "$name-local-sha"
  if($g.Code -eq 0){$local=((Get-Content -LiteralPath $g.Out -Raw).Trim() -split '\r?\n')[0]}
 }
 if($haveGH) {
  $remoteResponse=Run-Command "gh api repos/$repo/commits/main" $dir "$name-remote-commit"
  if($remoteResponse.Code -eq 0) {
   $obj=Read-Json $remoteResponse.Out
   if($obj -and $obj.sha){$remote=[string]$obj.sha}
  }
  if($remote -match '^[a-f0-9]{40}$') {
   $checksResponse=Run-Command "gh api ""repos/$repo/commits/$remote/check-runs?per_page=100""" $dir "$name-ci"
   if($checksResponse.Code -eq 0){
    $obj=Read-Json $checksResponse.Out
    if($obj -and $null -ne $obj.check_runs) {
     $latest=@()
     foreach($group in @($obj.check_runs | Group-Object name)){
      $latest+=@($group.Group | Sort-Object -Property started_at -Descending | Select-Object -First 1)
     }
     if($latest.Count -gt 0) {
      $failed=@($latest | Where-Object {$_.conclusion -in @('failure','cancelled','timed_out','action_required','startup_failure')})
      $pending=@($latest | Where-Object {$_.status -ne 'completed' -or -not $_.conclusion})
      $ok=@($latest | Where-Object {$_.conclusion -eq 'success'})
      if($failed.Count -gt 0){$ciStatus='FAIL'}
      elseif($pending.Count -gt 0){$ciStatus='PENDING'}
      elseif($ok.Count -gt 0){$ciStatus='PASS'}
      else {$ciStatus='BLOCKED'}
      $ciDetail="Latest check contexts: success=$($ok.Count); failed=$($failed.Count); pending=$($pending.Count). Not a full test certification."
      $codeChecks=@($latest | Where-Object {$_.name -match 'codeql'})
      $cqBad=@($codeChecks | Where-Object {$_.conclusion -ne 'success'})
      if($codeChecks.Count -gt 0 -and $cqBad.Count -eq 0) {
       $alerts=Run-Command "gh api ""repos/$repo/code-scanning/alerts?state=open&per_page=100""" $dir "$name-code-scanning"
       if($alerts.Code -eq 0) {
        $open=@(Read-Json $alerts.Out)
        if($open.Count -eq 0){$codeQLStatus='PASS';$codeQlDetail='Latest CodeQL checks successful and accessible open-alert query returned none; scope not independently audited.'}
        else {$codeQLStatus='FAIL';$codeQlDetail="Code-scanning open alerts: $($open.Count); review severities and pagination"}
       } else {$codeQLStatus='BLOCKED';$codeQlDetail='CodeQL checks successful but code scanning alert access unavailable'}
      } elseif($codeChecks.Count -gt 0) {
       $codeQLStatus='FAIL';$codeQlDetail='CodeQL checks not all successful'
      }
     }
    }
   }
  }
 }
 $sourceData[$repo]=[pscustomobject]@{ Local=$local; Remote=$remote }
 $rows=@($localRows | Where-Object {$_.Repository -eq $repo})
 if($local -eq 'UNKNOWN' -or $remote -eq 'UNKNOWN'){$localStatus='BLOCKED'}
 elseif($local -ne $remote){$localStatus='STALE'}
 elseif($rows.Count -eq 0){$localStatus='NOT_RUN'}
 elseif(@($rows | Where-Object {$_.Result -ne 'PASS' -or $_.ExitCode -ne '0' -or $_.Commit -ne $local}).Count -gt 0){$localStatus='FAIL'}
 else {$localStatus='PASS'}
 Add-Gate $repo 'LocalSelectedTests' 25 $localStatus "Fresh run checks=$($rows.Count); source SHA=$local; runnerExit=$phase1Exit; CSV=$phase1Report" $local
 Add-Gate $repo 'GitHubLatestCI' 15 $ciStatus $ciDetail $remote
 Add-Gate $repo 'CodeQLAndAlerts' 10 $codeQLStatus $codeQlDetail $remote
 Write-Host "$name: Local=$localStatus; GitHubCI=$ciStatus; CodeQL=$codeQLStatus"
}

# Phase 3: dependency security (read-only package advisories; no npm audit fix).
foreach($repo in $expected) {
 $name=($repo -split '/')[1]
 $work=Join-Path $srcdir $name
 $sha=[string]$sourceData[$repo].Local
 $security='PENDING'
 $detail='No applicable dependency audit tool or lockfile is available'
 if((Test-Path -LiteralPath (Join-Path $work 'package-lock.json')) -and (Get-Command npm -ErrorAction SilentlyContinue)){
  $res=Run-Command 'npm audit --omit=dev --audit-level=high --json' $work "$name-npm-audit"
  $j=Read-Json $res.Out
  if($null -ne $j -and $null -ne $j.metadata -and $null -ne $j.metadata.vulnerabilities){
   $v=$j.metadata.vulnerabilities
   $high=[int]$v.high+[int]$v.critical
   $security=if($high -eq 0 -and $res.Code -eq 0){'PASS'}else{'FAIL'}
   $detail="npm audit production dependencies: high=$($v.high), critical=$($v.critical); exit=$($res.Code)"
  } else {
   $security='BLOCKED';$detail="npm audit failed without parseable vulnerability metadata; exit=$($res.Code)"
  }
 } elseif((Test-Path -LiteralPath (Join-Path $work 'Cargo.toml')) -and (Get-Command cargo-audit -ErrorAction SilentlyContinue)) {
  $res=Run-Command 'cargo audit' $work "$name-cargo-audit"
  $security=if($res.Code -eq 0){'PASS'}else{'FAIL'}
  $detail="cargo audit exit=$($res.Code)"
 } elseif((Test-Path -LiteralPath (Join-Path $work 'pyproject.toml')) -and (Get-Command pip-audit -ErrorAction SilentlyContinue)) {
  $res=Run-Command 'pip-audit' $work "$name-pip-audit"
  $security=if($res.Code -eq 0){'PASS'}else{'FAIL'}
  $detail="pip-audit exit=$($res.Code)"
 }
 Add-Gate $repo 'DependencySecurity' 15 $security $detail $sha
}

# Phase 4: public testnet receipts ONLY, and only with explicit, commit-bound evidence.
foreach($repo in $expected){
 $name=($repo -split '/')[1]
 $e=Read-Json (Join-Path $evdir "$name.json")
 $sha=[string]$sourceData[$repo].Remote
 $status='PENDING'
 $detail="No approved public testnet evidence; native candidate $($native[$name])."
 if($e -and [string]$e.repository -eq $repo -and [string]$e.expectedCommit -eq $sha -and $sha -match '^[a-f0-9]{40}$'){
  if([string]$e.family -eq 'evm'){
   $result=Check-EvmTestnetReceipt $e
   $detail=$result
   if($result.StartsWith('PASS:')){$status='PASS'}
   elseif($result.StartsWith('FAIL:')){$status='FAIL'}
   elseif($result.StartsWith('BLOCKED:')){$status='BLOCKED'}
   else {$status='PENDING'}
  } elseif([string]$e.family -ne 'UNSET' -and -not [string]::IsNullOrWhiteSpace([string]$e.family)) {
   $status='BLOCKED'
   $detail="Native on-chain adapter for $($e.family) has not been implemented; do not accept explorer screenshots alone."
  }
 } elseif($e -and -not [string]::IsNullOrWhiteSpace([string]$e.transactionHash)) {
  $status='STALE';$detail='Evidence repository/commit mismatch or GitHub commit unavailable.'
 }
 Add-Gate $repo 'TestnetTransactionReceipt' 20 $status $detail $sha
 Add-Gate $repo 'x402SettlementAndReplay' 5 'PENDING' 'Requires genuine facilitator challenge, independent settlement journal, finality and repeated-proof rejection test. A confirmed transaction alone does not satisfy this gate.' $sha
 Add-Gate $repo 'ExternalReviewAndReleaseApproval' 10 'PENDING' 'Manual code review, SBOM, signed release attestation, rollback drill, operational runbook, and release authorization required. Mainnet remains locked.' $sha
}

# Phase 5: immutable local evidence dossier; hash local logs (do not publish secrets).
$checksCsv=Join-Path $dir "GATES_$run.csv"
$scoreCsv=Join-Path $dir "SCORECARD_$run.csv"
$manifestFile=Join-Path $dir "LOG_HASHES_$run.csv"
$summaryFile=Join-Path $dir "EXECUTIVE_REPORT_$run.md"
$gates | Export-Csv -LiteralPath $checksCsv -Encoding UTF8 -NoTypeInformation
$scores=@()
foreach($repo in $expected) {
 $projectGates=@($gates | Where-Object {$_.Repository -eq $repo})
 if($projectGates.Count -ne 7){throw "Incomplete gate count for $repo"}
 $max=[int](($projectGates | Measure-Object Weight -Sum).Sum)
 $pts=[int](($projectGates | Measure-Object Earned -Sum).Sum)
 if($max -ne 100){throw "Noncanonical score weights for $repo"}
 $missing=@($projectGates | Where-Object {$_.Status -ne 'PASS'})
 $scores+= [pscustomobject]@{
  Repository=$repo; SourceSHA=$sourceData[$repo].Remote;
  Earned=$pts; Maximum=100; MissingGates=$missing.Count;
  ProductionCertified='NO'; Mainnet='LOCKED'
 }
}
$scores | Export-Csv -LiteralPath $scoreCsv -Encoding UTF8 -NoTypeInformation
$hashes=@(Get-ChildItem -LiteralPath $logs -File | Where-Object {$_.Extension -in @('.log','.json')} | ForEach-Object {
 [pscustomobject]@{File=$_.Name; SHA256=(Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash}
})
if($phase1Report -and (Test-Path -LiteralPath $phase1Report)) {
 $hashes+= [pscustomobject]@{File=(Split-Path -Leaf $phase1Report);SHA256=(Get-FileHash -LiteralPath $phase1Report -Algorithm SHA256).Hash}
}
$hashes | Export-Csv -LiteralPath $manifestFile -Encoding UTF8 -NoTypeInformation
$md=@(
 '# QMOOSA Batch 001 — End-to-End Reality Gate',
 '',
 "Timestamp (UTC): $((Get-Date).ToUniversalTime().ToString('o'))",
 "Selected local test report: $phase1Report",
 'Scope: 10 original repositories. No mainnet operation, wallet signing, PR merge or deployment performed.',
 'All scores are provisional evidence-coverage points, not production certifications.',
 '',
 '| Repository | Evidence points | Missing gates | Production |',
 '|---|---:|---:|---|'
)
foreach($score in $scores){$md+="| $($score.Repository) | $($score.Earned)/100 | $($score.MissingGates) | NOT CERTIFIED |"}
$md+=@('','## Limitations','- No automatic mainnet certification or spending.','- Unsupported native receipt adapters stay BLOCKED/PENDING.','- GitHub check context success is narrower than a full external audit.','- Testnet transaction confirmation is not x402 settlement verification.','- Manifests must be bound to exact repository SHA; never paste private keys.','','## Next blockers')
foreach($gate in @($gates | Where-Object {$_.Status -ne 'PASS'})){$md+="- $($gate.Repository): $($gate.Gate) — $($gate.Status). $($gate.Evidence)"}
if($notes.Count -gt 0){$md+='';$md+='## Runner notes';foreach($n in $notes){$md+="- $n"}}
$md | Set-Content -LiteralPath $summaryFile -Encoding UTF8

Write-Host '=== QMOOSA BATCH 001 FINAL EVIDENCE SCORECARD ===' -ForegroundColor Cyan
$scores | Format-Table Repository,Earned,MissingGates,ProductionCertified -AutoSize
Write-Host "GATES: $checksCsv" -ForegroundColor Green
Write-Host "SCORECARD: $scoreCsv" -ForegroundColor Green
Write-Host "EVIDENCE REPORT: $summaryFile" -ForegroundColor Green
Write-Host "LOG HASHES: $manifestFile"
Write-Host "TESTNET EVIDENCE TEMPLATES: $evdir"
Write-Host 'PRODUCTION CERTIFICATION: NO | MAINNET: LOCKED' -ForegroundColor Yellow
# The program is a complete bounded audit, not a promise that external
# authorizations and all blockchain integrations can be completed automatically.
if(@($gates | Where-Object {$_.Status -ne 'PASS'}).Count -gt 0){exit 2}
exit 0
