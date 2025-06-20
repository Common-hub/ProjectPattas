$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like '192.*' }).IPAddress
Write-Host "Using detected local IP: $ip"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "ng serve --host $ip --port 4200 --open"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "java -jar projectPattas_jar/crackers-shop-0.0.1-SNAPSHOT.jar"
