$filesToPack = @(
	"index.js",
	"index.css",
	"README.md",
	"README_zh_CN.md",
	"i18n",
	"icon.png",
	"plugin.json",
	"preview.png"
)
$outputPath = "package.zip"
if (Test-Path $outputPath) {
	Remove-Item $outputPath -Force | Out-Null
}
$files = @()
foreach ($file in $filesToPack) {
	if (Test-Path $file) {
		$files += $file
	}
}
if ($files.Count -gt 0) {
	Compress-Archive -Path $files -DestinationPath $outputPath -Force | Out-Null
} else {
	exit 1
}
