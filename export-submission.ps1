# Script export-submission.ps1
# Huong dan su dung: .\export-submission.ps1 -StudentCode "QE190031"

param (
    [string]$StudentCode = "QE190031"
)

$StudentCode = $StudentCode.Trim().ToUpper()
$SubmissionDir = $StudentCode
$ZipFilePath = Join-Path $SubmissionDir "code.zip"
$TempStagingDir = Join-Path $env:TEMP "staging_$StudentCode"

Write-Host ">>> Dang chuan bi xuat thu muc nop bai: $SubmissionDir..." -ForegroundColor Cyan

# Danh sach cac thu muc va file can copy
$ItemsToCopy = @(
    "src",
    "public",
    "prisma",
    "package.json",
    "package-lock.json",
    "components.json",
    "next.config.ts",
    "next-env.d.ts",
    "tsconfig.json",
    ".env.example",
    ".gitignore",
    "README.md",
    "eslint.config.mjs",
    "prisma.config.ts"
)

# Tao thu muc nop bai neu chua co
if (-not (Test-Path $SubmissionDir)) {
    New-Item -ItemType Directory -Path $SubmissionDir | Out-Null
}

# Xoa folder code cu neu con ton tai trong thu muc nop bai (khong de folder code tho)
$OldCodeDir = Join-Path $SubmissionDir "code"
if (Test-Path $OldCodeDir) {
    Remove-Item $OldCodeDir -Recurse -Force
}

# Xoa file zip cu trong submission dir neu ton tai
if (Test-Path $ZipFilePath) {
    Remove-Item $ZipFilePath -Force
}

# Tao staging tam thoi de zip
if (Test-Path $TempStagingDir) {
    Remove-Item $TempStagingDir -Recurse -Force
}
New-Item -ItemType Directory -Path $TempStagingDir | Out-Null

$CopiedItems = @()
foreach ($item in $ItemsToCopy) {
    if (Test-Path $item) {
        Copy-Item -Path $item -Destination (Join-Path $TempStagingDir $item) -Recurse -Force
        $CopiedItems += $item
    }
}

# Nen toan bo noi dung staging vao code.zip nam ben trong thu muc SubmissionDir
Compress-Archive -Path "$TempStagingDir\*" -DestinationPath $ZipFilePath -Force

# Don dep thu muc staging tam
Remove-Item $TempStagingDir -Recurse -Force

Write-Host ">>> Da tao file zip source code tai: $ZipFilePath" -ForegroundColor Green
Write-Host ">>> Noi dung zip bao gom: $($CopiedItems -join ', ')" -ForegroundColor Yellow
Write-Host ">>> KHONG chua: node_modules, .next, .git, .env" -ForegroundColor Green
Write-Host ">>> Thu muc nop bai $SubmissionDir hien tai chi gom: '$StudentCode.docx' va 'code.zip'" -ForegroundColor Cyan
