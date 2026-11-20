# 자료실 파일의 첫 장을 PDF로 뽑는다 (Windows + Microsoft Office 필요).
# 다음에 python scripts/make_thumbs.py 가 PDF를 public/library/thumbs/{id}.png 로 바꾼다.
param([string]$Out = "$PSScriptRoot\..\.thumbs")
$ErrorActionPreference = "Stop"
$lib = Resolve-Path "$PSScriptRoot\..\public\library"
New-Item -ItemType Directory -Force $Out | Out-Null
$Out = Resolve-Path $Out

$xl = New-Object -ComObject Excel.Application; $xl.Visible = $false; $xl.DisplayAlerts = $false
Get-ChildItem "$lib\*.xlsx" | ForEach-Object {
  $wb = $xl.Workbooks.Open($_.FullName, 0, $true)
  $ws = $wb.Worksheets.Item(1)
  $ws.ExportAsFixedFormat(0, (Join-Path $Out ($_.BaseName + ".pdf")))
  $wb.Close($false)
}
$xl.Quit()

# 워드(.docx)는 대화상자에서 멈춘 적이 있어 뺐다. 첫 쪽을 PDF로 저장해 .thumbs 에 직접 넣는다.

# 파워포인트가 이미 켜져 있으면(작업 중인 문서) 건드리지 않는다
if (Get-Process POWERPNT -ErrorAction SilentlyContinue) { Write-Output "PowerPoint 실행 중: .pptx 미리보기는 건너뜀"; exit }
$pp = New-Object -ComObject PowerPoint.Application
Get-ChildItem "$lib\*.pptx" | ForEach-Object {
  $pr = $pp.Presentations.Open($_.FullName, $true, $false, $false)
  $pr.Slides.Item(1).Export((Join-Path $Out ($_.BaseName + ".png")), "PNG", 1280, 720)
  $pr.Close()
}
$pp.Quit()
Write-Output "done: $Out"
