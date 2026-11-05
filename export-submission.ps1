# Script export-submission.ps1
# Huong dan su dung: .\export-submission.ps1 -StudentCode "QE190031"

param (
    [string]$StudentCode = "QE190031"
)

$StudentCode = $StudentCode.Trim().ToUpper()
$SubmissionDir = $StudentCode
$CodeDir = Join-Path $SubmissionDir "code"

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

# Xoa cac file zip cu neu ton tai
Get-ChildItem -Path $SubmissionDir -Filter "*.zip" -ErrorAction SilentlyContinue | Remove-Item -Force
Get-ChildItem -Path "." -Filter "*.zip" -ErrorAction SilentlyContinue | Remove-Item -Force

# Lam moi thu muc code
if (Test-Path $CodeDir) {
    Remove-Item $CodeDir -Recurse -Force
}
New-Item -ItemType Directory -Path $CodeDir | Out-Null

# Copy cac file va folder can thiet vao thu muc code
$CopiedItems = @()
foreach ($item in $ItemsToCopy) {
    if (Test-Path $item) {
        Copy-Item -Path $item -Destination (Join-Path $CodeDir $item) -Recurse -Force
        $CopiedItems += $item
    }
}

Write-Host ">>> Da copy source code vao: $CodeDir" -ForegroundColor Green
Write-Host ">>> Danh sach noi dung bao gom: $($CopiedItems -join ', ')" -ForegroundColor Yellow
Write-Host ">>> KHONG chua: node_modules, .next, .git, .env, *.zip" -ForegroundColor Green
Write-Host ">>> Thu muc nop bai hoan tat: $SubmissionDir (gom folder 'code' va '$StudentCode.docx')" -ForegroundColor Cyan

