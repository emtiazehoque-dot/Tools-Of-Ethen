@echo off
:: Find a free port and start a basic background server using PowerShell (built-in to Windows)
start /b powershell -windowstyle hidden -Command "$listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8080/'); $listener.Start(); while ($listener.IsListening) { $context = $listener.GetContext(); $req = $context.Request; $res = $context.Response; $file = Join-Path . $req.Url.LocalPath.TrimStart('/'); if (Test-Path $file -PathType Leaf) { $bytes = [System.IO.File]::ReadAllBytes($file); $res.OutputStream.Write($bytes, 0, $bytes.Length) } else { $bytes = [System.IO.File]::ReadAllBytes('index.html'); $res.OutputStream.Write($bytes, 0, $bytes.Length) }; $res.Close() }"

:: Wait 1 second for the server to spin up, then open the browser
timeout /t 1 >nul
start http://localhost:8080/index.html
exit
