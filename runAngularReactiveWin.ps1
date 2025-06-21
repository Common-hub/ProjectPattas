$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like '192.*' }).IPAddress
Write-Host "Using detected local IP: $ip"
$env_a = Red-Host "Environment: ....(development or production)"
$env_b="-Dspring.profiles.active=dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ng serve --configuration= $env_a --host $ip --port 4200 --open"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "java $env_b -jar  projectPattas_jar/crackers-shop-0.0.1-SNAPSHOT.jar"
