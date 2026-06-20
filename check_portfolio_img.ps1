Add-Type -AssemblyName System.Drawing

function Show-CustomTree {
    param (
        [string]$Path = ".",
        [string]$Indent = ""
    )

    $items = Get-ChildItem -Path $Path | Where-Object { $_.Name -notlike ".git" } | Sort-Object PSIsContainer, Name
    $count = $items.Count

    for ($i = 0; $i -lt $count; $i++) {
        $item = $items[$i]
        $isLast = ($i -eq ($count - 1))
        
        # 🚀 특수기호 대신 절대 깨지지 않는 영문/숫자 키보드 기호로 대체
        $prefix = if ($isLast) { "\--- " } else { "+--- " }
        $indentSpace = if ($isLast) { "    " } else { "|   " }
        $nextIndent = $Indent + $indentSpace

        if ($item.PSIsContainer) {
            Write-Host "${Indent}${prefix}$($item.Name)/" -ForegroundColor Yellow
            Show-CustomTree -Path $item.FullName -Indent $nextIndent
        } else {
            $sizeKB = [math]::Round($item.Length / 1KB, 1)
            $infoStr = "(${sizeKB} KB)"

            if ($item.Extension -in (".jpg", ".jpeg", ".png", ".gif", ".JPG", ".JPEG", ".PNG")) {
                try {
                    $img = [System.Drawing.Image]::FromFile($item.FullName)
                    $infoStr += " [$($img.Width)x$($img.Height)]"
                    $img.Dispose()
                } catch {
                    $infoStr += " [해상도 읽기 실패]"
                }
            }

            Write-Host "${Indent}${prefix}$($item.Name) " -NoNewline -ForegroundColor Cyan
            Write-Host $infoStr -ForegroundColor Gray
        }
    }
}

Write-Host "=== PROJECT STRUCTURE REPORT ===" -ForegroundColor Green
Show-CustomTree -Path "."